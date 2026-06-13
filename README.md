# MRB Exam Management System - Frontend

A comprehensive React-based frontend application for the Maharashtra Rashtrabhasha Sabha (MRB) Exam Management System. This system manages Hindi language proficiency examinations (Rashtrabhasha Pravin Pariksha) including student registration, exam applications, result publishing, and certificate generation.

## 🚀 Project Overview

This is a modern, responsive web application built with React 19, Vite, and Tailwind CSS. It provides two main portals:

- **Admin Portal**: For administrators to manage exams, students, schools, regions, exam centers, applications, and results
- **Student Portal**: For students to register, apply for exams, view results, download hall tickets, and access certificates

## ✨ Key Features

### Admin Portal Features
- **Dashboard**: Comprehensive analytics with charts showing student statistics, application trends, and result distributions
- **Exam Management**: Create, update, delete exams with detailed configurations (papers, fees, dates, rules)
- **Student Management**: CRUD operations for student records with advanced search and filtering
- **Application Management**: Review and manage exam applications with approval workflows
- **Result Publishing**: Publish exam results with marksheet generation capabilities
- **School Management**: Manage affiliated schools across different regions
- **Region Management**: Administrative region management for geographic organization
- **Exam Centre Management**: Configure and manage examination centers
- **Global Search**: Unified search across all entities (students, applications, exams, schools)
- **Result Viewer**: View and analyze published results with detailed breakdowns

### Student Portal Features
- **Student Registration**: New student registration with validation and school selection
- **Student Login**: Secure authentication for existing students
- **Exam Application**: Apply for available exams with detailed application form
- **Hall Ticket Generation**: Download hall tickets with exam details and center information
- **Result Viewing**: View exam results with detailed marksheet
- **Certificate Management**: Download and manage certificates
- **Profile Management**: View and update student profile information

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.12.0
- **State Management**: TanStack React Query 5.90.20
- **UI Components**: Lucide React 0.562.0 (icons)
- **Animations**: Framer Motion 12.24.11
- **Charts**: Recharts 3.7.0
- **HTTP Client**: Axios 1.13.2
- **Notifications**: React Hot Toast 2.6.0
- **PDF Generation**: html2pdf.js 0.14.0
- **Testing**: Vitest 4.0.18, Cypress 15.11.0

## 📁 Project Structure

```
src/
├── pages/                    # Main page components
│   ├── LandingPage.jsx       # Landing page with portal selection
│   ├── AdminDashboard.jsx    # Main admin dashboard with all admin features
│   ├── StudentDashboard.jsx  # Main student dashboard with all student features
│   └── StudentRegistration.jsx # New student registration page
├── admin/                    # Admin-specific components
│   └── components/
│       ├── ExamManager.jsx           # Exam CRUD operations
│       ├── StudentManager.jsx         # Student management interface
│       ├── ApplicationManager.jsx    # Application review and approval
│       ├── ResultPublisher.jsx       # Result publishing interface
│       ├── ResultViewer.jsx          # Result viewing and analysis
│       ├── RegionManager.jsx         # Region management
│       ├── ExamCentreManager.jsx     # Exam center management
│       ├── SchoolManager.jsx         # School management
│       ├── ApplicationDetailView.jsx # Detailed application view
│       ├── SchoolDetailView.jsx      # Detailed school information
│       ├── StudentDetailView.jsx     # Detailed student information
│       ├── GlobalSearch.jsx          # Unified search functionality
│       ├── DashboardLayout.jsx       # Admin layout wrapper
│       ├── Sidebar.jsx               # Admin navigation sidebar
│       └── MetricCard.jsx            # Dashboard metric cards
├── student/                  # Student-specific components
│   └── components/
│       ├── StudentLogin.jsx          # Student authentication
│       ├── ApplyModal.jsx            # Exam application form
│       ├── ExamList.jsx              # Available exams list
│       ├── HallTicket.jsx            # Hall ticket generation and display
│       ├── Marksheet.jsx             # Marksheet display
│       ├── MyResults.jsx             # Student's results list
│       ├── MyCertificates.jsx        # Student's certificates
│       ├── StudentProfileSection.jsx # Profile management
│       ├── StudentLayout.jsx         # Student layout wrapper
│       └── StudentSidebar.jsx        # Student navigation sidebar
├── api/                      # API integration layer
│   ├── api.js                # Main API client and endpoints
│   └── exam-api.js           # Exam-specific API endpoints
├── common/                   # Shared components
├── assets/                   # Static assets
├── App.jsx                   # Main app component with routing
└── main.jsx                  # Application entry point
```

## 📄 Main Pages Explained

### LandingPage.jsx
- **Purpose**: Entry point of the application
- **Functionality**: Displays two interactive cards for Admin and Student portals
- **Features**: Animated hover effects using Framer Motion, responsive design
- **Routes**: Links to `/admin` and `/student` routes

### AdminDashboard.jsx
- **Purpose**: Central hub for all administrative operations
- **Functionality**:
  - Tab-based navigation for different admin modules
  - Analytics dashboard with charts (student count by region, application trends)
  - Integration with all admin components (ExamManager, StudentManager, etc.)
  - Global search functionality
  - Metric cards showing key statistics
- **Key Features**:
  - Uses TanStack Query for data fetching and caching
  - Recharts for data visualization
  - Dynamic component loading based on active tab
  - Route handling for detail views (`/admin/manage/:type/:id`)

### StudentDashboard.jsx
- **Purpose**: Central hub for all student operations
- **Functionality**:
  - Student authentication and session management
  - Tab-based navigation for different student features
  - Profile viewing and editing
  - Exam application submission
  - Result and certificate viewing
- **Key Features**:
  - Login form with password visibility toggle
  - Master data loading (regions, exam centers, schools)
  - Application form with validation
  - Hall ticket and marksheet generation
  - Responsive layout with sidebar navigation

### StudentRegistration.jsx
- **Purpose**: New student registration
- **Functionality**:
  - Registration form with comprehensive validation
  - School selection dropdown
  - Password confirmation
  - Form error handling and display
- **Key Features**:
  - Real-time validation (email regex, phone number format, age range)
  - Password matching validation
  - School data fetching from API
  - Success/error toast notifications

## 🔧 API Integration

The application communicates with a Spring Boot backend running on `http://localhost:8080`. Key API endpoints include:

- **Students**: `/students` (CRUD operations)
- **Exams**: `/exams` (CRUD operations)
- **Applications**: `/exam-applications` (application management)
- **Results**: `/exam-results` (result management)
- **Schools**: `/schools` (school data)
- **Regions**: `/regions` (region data)
- **Exam Centres**: `/exam-centres` (center data)

All API calls are centralized in `src/api.js` and `src/api/exam-api.js` using Axios with proper error handling.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MRB-DEMO-FRONTEND-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest unit tests
- `npm run cy:open` - Open Cypress interactive test runner
- `npm run cy:run` - Run Cypress tests headlessly

## 🧪 Testing

The project includes two testing frameworks:

- **Vitest**: Unit testing for React components
- **Cypress**: End-to-end testing for user flows

Test files are located in:
- `src/__tests__/` for Vitest tests
- `cypress/` for Cypress tests

## 🎨 Styling

The application uses Tailwind CSS 4.1.18 with the Vite plugin for:
- Utility-first CSS approach
- Responsive design
- Custom color schemes (blue/indigo theme)
- Dark mode support (if needed)

## 📊 State Management

- **TanStack React Query**: Server state management, caching, and synchronization
- **React useState/useEffect**: Local component state
- **React Context**: Not currently used, but can be added for global state

## 🔐 Authentication

- **Admin**: Currently no authentication (demo mode)
- **Student**: Email/password-based authentication via backend API
- Session management handled through local state

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Environment Variables

Currently, the API base URL is hardcoded in `src/api.js`. For production, consider using environment variables:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## 🤝 Contributing

This is a demo/prototype project for the Maharashtra Rashtrabhasha Sabha examination system.

## 📄 License

Proprietary - Maharashtra Rashtrabhasha Sabha
