# MRB Exam Management System — Frontend

## Overview

A full-stack web application for managing Hindi language proficiency exams (Rashtrabhasha Pravin Pareeksha) conducted by Maharashtra Rashtrabhasha Sabha, Pune. The frontend is a React SPA that serves three user roles — Admin, Exam Officer, and Student — with role-based dashboards and functionality.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | TailwindCSS + inline styles |
| Routing | React Router v7 |
| State / Server Data | TanStack React Query v5 |
| Auth | JWT (cookie-based, 1-day expiry) |
| HTTP Client | Axios |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Notifications | react-hot-toast |
| PDF Generation | html2pdf.js |

---

## Project Structure

```
src/
├── main.jsx                    # Root render, AuthProvider wraps App
├── App.jsx                     # Route definitions, QueryClientProvider
├── api.js                      # Central Axios instance + ~80 API functions
├── context/
│   └── AuthContext.jsx          # JWT auth context (user, token, role, login/logout)
├── utils/
│   ├── cookie.js               # Cookie helpers (set/get/remove)
│   └── fileUtils.js            # Presigned URL resolution for file uploads
├── hooks/
│   └── useFileUrl.js           # React hook for async file URL resolution
├── pages/
│   ├── LandingPage.jsx         # Public landing page with role-based login modals
│   ├── AdminDashboard.jsx      # Admin SPA (~900 lines) — tabs, metrics, CRUD
│   ├── ExamOfficerDashboard.jsx# Exam Officer SPA — limited tabs
│   ├── StudentDashboard.jsx    # Student SPA — exams, applications, results
│   └── StudentRegistration.jsx # Student self-registration form
├── admin/components/
│   ├── ExamManager.jsx         # Multi-step exam creation wizard (7 steps)
│   ├── StudentManager.jsx      # Student list with search/pagination
│   ├── ApplicationManager.jsx  # Application list + batch hall ticket generation
│   ├── ResultPublisher.jsx     # Single/bulk result entry
│   ├── ResultViewer.jsx        # Result viewing with rankings/stats
│   ├── ExamOfficerManager.jsx  # Exam officer CRUD modal
│   ├── DashboardLayout.jsx     # Admin layout shell
│   ├── Sidebar.jsx             # Admin navigation sidebar
│   ├── GlobalSearch.jsx        # Cmd+K search across all entities
│   ├── MetricCard.jsx          # Animated stat card
│   ├── *DetailView.jsx         # Detail views for Student, School, Region, Exam Centre
│   └── modern-ui/              # Active versions of CRUD managers
├── student/components/
│   ├── ExamList.jsx            # Available exams listing
│   ├── ApplyModal.jsx          # Exam application modal
│   ├── HallTicket.jsx          # Hall ticket rendering
│   ├── MyResults.jsx           # Student results view
│   ├── Marksheet.jsx           # Marksheet PDF rendering
│   ├── Certificate.jsx         # Certificate rendering
│   ├── StudentProfileSection.jsx # Profile create/edit form
│   ├── StudentLayout.jsx       # Student layout shell
│   └── StudentSidebar.jsx      # Student navigation sidebar
└── common/components/
    ├── Pagination.jsx          # Shared pagination with page buttons
    └── FileImage.jsx           # Presigned URL image resolver
```

---

## Authentication & Authorization

- **Mechanism**: Cookie-based JWT (`jwt_token`, `jwt_role`, `jwt_user`) with 1-day expiry, SameSite=Lax
- **Flow**: User logs in via role-specific login form → API returns JWT → stored in cookies → Axios interceptor attaches `Authorization: Bearer <token>` header to every request
- **Roles**: `ADMIN`, `EXAM_OFFICER`, `STUDENT`
- **No route guards** — each dashboard internally checks auth state and redirects to login if unauthenticated
- **React Query queries** are gated with `enabled: !!user` to prevent API calls before authentication

---

## Key Features

### Admin Dashboard
- **Analytics dashboard** with Recharts (application trends, student distribution by region)
- **6 management modules** via tab-based SPA routing: Exams, Students, Applications, Results, Regions, Exam Centres, Schools, Exam Officers
- **Multi-step exam creation wizard** (7 steps): Basic Info → Dates → Papers → Identity → Rules → Admin → Review/Submit
- **Detail views** with drill-down for Students, Schools, Regions, and Exam Centres
- **Batch operations**: Generate hall tickets in bulk, publish results in bulk
- **Global search** (Cmd+K) across all entities

### Exam Officer Dashboard
- Limited version of admin — can manage students, applications, and publish results
- Auto-redirects to `/admin` if role is ADMIN

### Student Portal
- **Self-registration** with school selection
- **Profile management** with document uploads (photo, signature)
- **Exam browsing** and application with fee payment
- **Hall ticket** generation and download
- **Results viewing** with marksheet and certificate rendering
- **Certificate viewer**

---

## API Layer

- Central Axios instance in `api.js` with base URL `http://localhost:8080`
- ~80 exported API functions covering all CRUD operations
- JWT interceptor automatically attaches auth headers
- Separate API modules for exams (`exam-api.js`), applications (`exam-application-api.js`), and exam officers (`exam-officer-api.js`)
- File uploads go through a dedicated `uploadFiles` function that returns S3/MinIO object keys

---

## Data Fetching Pattern

All server state managed via TanStack React Query:
- `useQuery` for reads with `enabled` guards for auth
- `useMutation` for writes with cache invalidation
- Config: 5-min staleTime, 30-min cacheTime, 1 retry
- Paginated endpoints return `{ content, totalElements, totalPages }` (Spring Page format)

---

## File Storage

- Files (logos, signatures, photos) uploaded as S3/MinIO object keys
- Resolved to presigned URLs via `FileImage` component + `useFileUrl` hook
- Upload handled through `UploadField` component with progress indication

---

## Design Decisions

1. **Tab-based SPA routing** within dashboards instead of nested React Router — simplifies state management for each role's isolated context
2. **Inline styles** in many components over pure Tailwind — allows dynamic theming and conditional styling
3. **Dual component versions** — older commented-out versions coexist with modern UI versions in the same files, allowing quick rollback during development
4. **Cookie-based JWT** over localStorage — more secure against XSS, with SameSite protection
5. **React Query** for all server state — automatic caching, refetching, and optimistic updates without manual state management
