import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RefreshCw,
  Users,
  BookOpen,
  FileText,
  Award,
  ArrowUpRight,
  ArrowLeft,
  MoreVertical,
  Download,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, Legend
} from 'recharts';

import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../api";


// Sub-components
import ExamManager from "../admin/components/ExamManager";
import StudentManager from "../admin/components/modern-ui/StudentManager";
import ApplicationManager from "../admin/components/modern-ui/ApplicationManager";
import ResultPublisher from "../admin/components/ResultPublisher";
import ResultViewer from "../admin/components/ResultViewer";
import RegionManager from "../admin/components/modern-ui/RegionManager";
import ExamCentreManager from "../admin/components/modern-ui/ExamCentreManager";
import SchoolManager from "../admin/components/modern-ui/SchoolManager";
import SchoolDetailView from "../admin/components/SchoolDetailView";
import StudentDetailView from "../admin/components/StudentDetailView";
import ApplicationDetailView from "../admin/components/ApplicationDetailView";
import DashboardLayout from "../admin/components/DashboardLayout";
import MetricCard from "../admin/components/MetricCard";
import GlobalSearch from "../admin/components/GlobalSearch";
import ModernAdminDashboard from "../admin/components/modern-ui/ModernAdminDashboard";
import ExamOfficerManager from "../admin/components/ExamOfficerManager";


import {
  createStudent,
  getStudents,
  createExamResult,
  getExamApplications,
  getExamResults,
  getSchools,
  getRegions,
  getAnalyticsSummary,
  getStudentCountByRegion,
} from "../api";
import { createExam, updateExam, deleteExam, searchExams as getExams } from "../api/exam-api";


const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user, role, login: authLogin, logout: authLogout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [loginError, setLoginError] = useState(null);

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginUsername.trim()) { setLoginError("Please enter your username."); return; }
    if (!loginPassword.trim()) { setLoginError("Please enter your password."); return; }

    console.log("[Staff Login] Attempting login with:", {
      username: loginUsername.trim(),
      role: selectedRole
    });

    setIsLoggingIn(true);
    try {
      const response = await apiLogin(loginUsername.trim(), loginPassword, selectedRole);
      console.log("[Staff Login] Success response received:", response);
      
      const staffUser = {
        userId: response.userId,
        username: response.username,
        role: response.role,
      };
      authLogin(response.token, response.role, staffUser);
      toast.success(`Welcome back, ${response.username}!`);
      if (response.role === "EXAM_OFFICER") {
        navigate("/exam-officer");
      }
    } catch (error) {
      console.error("[Staff Login] Login error occurred:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      if (error.response?.status === 401) {
        setLoginError("Invalid username or password. Please check your credentials and try again.");
      } else if (!error.response) {
        setLoginError("Cannot reach the server. Please make sure the backend is running.");
      } else {
        setLoginError(`Login failed (${error.response?.status || "unknown error"}). Please try again later.`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Reset navigation when switching tabs manually via sidebar
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (id || type) {
      navigate("/admin");
    }
  };
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExamNo, setSelectedExamNo] = useState(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);

  const toDateString = (date) => date.toISOString().split('T')[0];
  const getDefaultExamDates = () => {
    const today = new Date();
    const applicationEnd = new Date(today);
    applicationEnd.setMonth(today.getMonth() + 2);
    const examStart = new Date(applicationEnd);
    examStart.setMonth(applicationEnd.getMonth() + 1);
    const examEnd = new Date(examStart);
    examEnd.setDate(examStart.getDate() + 15);
    return {
      application_start_date: toDateString(today),
      application_end_date: toDateString(applicationEnd),
      exam_start_date: toDateString(examStart),
      exam_end_date: toDateString(examEnd),
    };
  };

  // Forms State (kept as local state)
  const [examForm, setExamForm] = useState({
    exam_name: "राष्ट्रभाषा प्रवीण परीक्षा (सितंबर 2026)",
    exam_code: "PRAVIN_SEP_2026",
    status: "DRAFT",
    no_of_papers: 2,
    exam_fees: 700,
    ...getDefaultExamDates(),
    papers: [
      { name: "प्रथम प्रश्नपत्र", maxMarks: 100 },
      { name: "द्वितीय प्रश्नपत्र", maxMarks: 100 },
    ],
    exam_details: {
      identity: {
        examFullTitle: "राष्ट्रभाषा प्रवीण परीक्षा",
        conductingBody: "महाराष्ट्र राष्ट्रभाषा सभा, पुणे",
        board: "Rashtrabhasha Sabha",
        recognitionText: "भारत सरकार द्वारा मान्य, इंटर स्तर की हिंदी के समकक्ष",
        examLevel: "PRAVIN",
        language: "Hindi"
      },
      schedule: {
        session: "September 2024",
        mode: "WRITTEN",
        medium: "Hindi",
        totalDuration: "3 Hours"
      },
      rules: {
        eligibility: "प्रबोध या समकक्ष परीक्षा उत्तीर्ण",
        passingCriteria: "प्रत्येक प्रश्नपत्र में न्यूनतम 40% तथा कुल अंकों में उत्तीर्ण होना आवश्यक",
        gradingScheme: {
          firstClass: "300 और ऊपर",
          secondClass: "250 से 299",
          thirdClass: "175 से 249",
          fail: "174 से कम"
        },
        graceMarksAllowed: true,
        revaluationAllowed: true,
        maxAttempts: "5"
      },
      administrative: {
        certificateIssued: "Pravin Certificate",
        syllabusYear: "2026–2027",
        signatoryName: "सौ. सुनीता कुलकर्णी",
        signatoryDesignation: "सचिव, परीक्षा विभाग",
        departmentName: " परीक्षा विभाग",
        marksCalculationNote: "मात्र हिंदी के लिखित प्रश्नपत्रों के अंकों के आधार पर परिणाम घोषित किया जाता है।",
        instructions: "परीक्षार्थी को परीक्षा केंद्र पर प्रवेश पत्र अनिवार्य रूप से साथ लाना होगा।",
        disclaimer: "यह अंकसूची मूल प्रमाणपत्र नहीं है।"
      },
      structure: {
        hasOral: false,
        oralMarks: 50,
        hasProject: false,
        projectMarks: 50
      }
    },
    controllerSignatureUrl: "",
    boardSealUrl: "",
    boardLogoUrl: ""
  });


  const [resultForm, setResultForm] = useState({
    applicationId: "",
    score: "",
    remarks: "Pass",
    paperMarks: {},
    oralMarks: 0,
    projectMarks: 0,
    hasOral: false,
    hasProject: false,
    examPapers: [],
  });

  const [activeFilters, setActiveFilters] = useState({
    region: "",
    centre: "",
    school: "",
    status: ""
  });

  // Sync activeTab with route type if present
  useEffect(() => {
    if (type) {
      if (type === 'school') setActiveTab('schools');
      else if (type === 'exam') setActiveTab('exams');
      else if (type === 'centre') setActiveTab('exam_centres');
      else if (type === 'region') setActiveTab('regions');
    }
  }, [type]);

  // Redirect EXAM_OFFICER who lands directly on /admin to /exam-officer
  useEffect(() => {
    if (user && role === "EXAM_OFFICER") {
      navigate("/exam-officer");
    }
  }, [user, role, navigate]);

  // Queries
  const { data: studentsPage, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents({ size: 20 }),
    enabled: !!user,
  });
  const students = studentsPage?.content || [];

  const { data: examsPage, isLoading: isLoadingExams } = useQuery({
    queryKey: ["exams"],
    queryFn: () => getExams({ size: 20 }),
    enabled: !!user,
  });
  const exams = examsPage?.content || [];

  const { data: applicationsPage, isLoading: isLoadingApplications } = useQuery({
    queryKey: ["applications"],
    queryFn: () => getExamApplications({ size: 20 }),
    enabled: !!user,
  });
  const applications = applicationsPage?.content || [];

  const { data: resultsPage, isLoading: isLoadingResults } = useQuery({
    queryKey: ["results"],
    queryFn: () => getExamResults({ size: 20 }),
    enabled: !!user,
  });
  const results = resultsPage?.content || [];

  const { data: schoolsPage, isLoading: isLoadingSchools } = useQuery({
    queryKey: ["schools"],
    queryFn: () => getSchools({ size: 20 }),
    enabled: !!user,
  });
  const schools = schoolsPage?.content || [];

  const { data: regionsPage, isLoading: isLoadingRegions } = useQuery({
    queryKey: ["regions"],
    queryFn: () => getRegions({ size: 1000 }),
    enabled: !!user,
  });
  const regions = regionsPage?.content || [];

  const { data: analyticsSummary, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ["analyticsSummary"],
    queryFn: () => getAnalyticsSummary(),
    enabled: !!user,
  });

  // Fetch counts per region
  const regionCountQueries = useQueries({
    queries: regions.map(region => ({
      queryKey: ['regionStudentCount', region.regionId],
      queryFn: () => getStudentCountByRegion(region.regionId),
      enabled: !!region.regionId
    }))
  });

  const loading = isLoadingStudents || isLoadingExams || isLoadingApplications || isLoadingResults || isLoadingSchools || isLoadingRegions || isLoadingAnalytics;

  // Auto-calculate percentage
  useEffect(() => {
    if (resultForm.examPapers.length > 0) {
      let totalObtained = Object.values(resultForm.paperMarks).reduce(
        (sum, m) => sum + (parseFloat(m) || 0),
        0
      );
      let totalMax = resultForm.examPapers.reduce(
        (sum, p) => sum + (p.maxMarks || 0),
        0
      );

      if (resultForm.hasOral) {
        totalObtained += (parseFloat(resultForm.oralMarks) || 0);
        totalMax += 50;
      }
      if (resultForm.hasProject) {
        totalObtained += (parseFloat(resultForm.projectMarks) || 0);
        totalMax += 50;
      }

      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      setResultForm((prev) => ({
        ...prev,
        score: `${percentage.toFixed(2)}%`,
      }));
    }
  }, [resultForm.paperMarks, resultForm.examPapers, resultForm.oralMarks, resultForm.projectMarks, resultForm.hasOral, resultForm.hasProject]);

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    toast.success("Refreshing data...");
  };

  const resetExamForm = () => {
    setExamForm({
      exam_name: "राष्ट्रभाषा प्रवीण परीक्षा (सितंबर 2024)",
      exam_code: "PRAVIN_SEP_2024",
      status: "DRAFT",
      no_of_papers: 2,
      exam_fees: 700,
      ...getDefaultExamDates(),
      papers: [
        { name: "प्रथम प्रश्नपत्र", maxMarks: 100 },
        { name: "द्वितीय प्रश्नपत्र", maxMarks: 100 },
      ],
      exam_details: {
        identity: {
          examFullTitle: "राष्ट्रभाषा प्रवीण परीक्षा",
          conductingBody: "महाराष्ट्र राष्ट्रभाषा सभा, पुणे",
          board: "Rashtrabhasha Sabha",
          recognitionText: "भारत सरकार द्वारा मान्य, इंटर स्तर की हिंदी के समकक्ष",
          examLevel: "PRAVIN",
          language: "Hindi"
        },
        schedule: {
          session: "September 2024",
          mode: "WRITTEN",
          medium: "Hindi",
          totalDuration: "3 Hours"
        },
        rules: {
          eligibility: "प्रबोध या समकक्ष परीक्षा उत्तीर्ण",
          passingCriteria: "प्रत्येक प्रश्नपत्र में न्यूनतम 40% तथा कुल अंकों में उत्तीर्ण होना आवश्यक",
          gradingScheme: {
            firstClass: "300 और ऊपर",
            secondClass: "250 से 299",
            thirdClass: "175 से 249",
            fail: "174 से कम"
          },
          graceMarksAllowed: true,
          revaluationAllowed: true,
          maxAttempts: "5"
        },
        administrative: {
          certificateIssued: "Pravin Certificate",
          syllabusYear: "2024–2025",
          signatoryName: "सौ. सुनीता कुलकर्णी",
          signatoryDesignation: "सचिव, परीक्षा विभाग",
          departmentName: " परीक्षा विभाग",
          marksCalculationNote: "मात्र हिंदी के लिखित प्रश्नपत्रों के अंकों के आधार पर परिणाम घोषित किया जाता है।",
          instructions: "परीक्षार्थी को परीक्षा केंद्र पर प्रवेश पत्र अनिवार्य रूप से साथ लाना होगा।",
          disclaimer: "यह अंकसूची मूल प्रमाणपत्र नहीं है।"
        },
        structure: {
          hasOral: false,
          hasProject: false
        }
      },
      controllerSignatureUrl: "",
      boardSealUrl: "",
      boardLogoUrl: ""
    });
    setIsEditing(false);
    setSelectedExamNo(null);
  };

  // Mutations
  const createExamMutation = useMutation({
    mutationFn: (payload) => createExam(payload),
    onSuccess: () => {
      toast.success("Exam Created!");
      resetExamForm();
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to create exam"),
  });

  const updateExamMutation = useMutation({
    mutationFn: (payload) => updateExam(payload.examNo, payload),
    onSuccess: () => {
      toast.success("Exam Updated!");
      resetExamForm();
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to update exam"),
  });

  const deleteExamMutation = useMutation({
    mutationFn: (id) => deleteExam(id),
    onSuccess: () => {
      toast.success("Exam Deleted!");
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: () => toast.error("Failed to delete exam"),
  });


  const publishResultMutation = useMutation({
    mutationFn: ({ payload, applicationId }) => createExamResult(payload, applicationId),
    onSuccess: () => {
      toast.success("Result Published!");
      setResultForm({
        applicationId: "",
        score: "",
        remarks: "Pass",
        paperMarks: {},
        examPapers: [],
      });
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
    onError: () => toast.error("Failed to publish result"),
  });

  const handleCreateExam = (e) => {
    e.preventDefault();
    const payload = {
      ...examForm,
      papers: JSON.stringify(examForm.papers),
      exam_details: JSON.stringify(examForm.exam_details),
    };
    createExamMutation.mutate(payload);
  };

  const handleUpdateExam = (e) => {
    e.preventDefault();
    const payload = {
      ...examForm,
      papers: JSON.stringify(examForm.papers),
      exam_details: JSON.stringify(examForm.exam_details),
    };
    updateExamMutation.mutate({ ...payload, examNo: selectedExamNo });
  };

  const handleDeleteExam = (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;
    deleteExamMutation.mutate(id);
  };

  const startEditing = (exam) => {
    try {
      setExamForm({
        ...exam,
        papers: typeof exam.papers === 'string' ? JSON.parse(exam.papers) : exam.papers,
        exam_details: typeof exam.exam_details === 'string' ? JSON.parse(exam.exam_details) : exam.exam_details
      });
      setIsEditing(true);
      setSelectedExamNo(exam.examNo);
    } catch (e) {
      console.error("Error parsing exam data for edit:", e);
      toast.error("Failed to load exam data");
    }
  };


    const handlePublishResult = (e, directPayload = null, directAppId = null) => {
        if (e) e.preventDefault();

        if (directPayload) {
            // If we have a direct appId, use it. Otherwise try to extract from payload (legacy/bulk)
            const appId = directAppId || directPayload.application?.applicationId;
            const { application, ...restPayload } = directPayload;
            
            publishResultMutation.mutate({ 
                payload: restPayload, 
                applicationId: appId 
            });
            return;
        }

    if (!resultForm.applicationId || !resultForm.score) {
      return toast.error("Please fill all fields");
    }

    let totalObtained = Object.values(resultForm.paperMarks).reduce(
      (sum, m) => sum + (parseFloat(m) || 0),
      0
    );
    let totalMax = resultForm.examPapers.reduce(
      (sum, p) => sum + (p.maxMarks || 0),
      0
    );

    if (resultForm.hasOral) {
      totalObtained += (parseFloat(resultForm.oralMarks) || 0);
      totalMax += 50;
    }
    if (resultForm.hasProject) {
      totalObtained += (parseFloat(resultForm.projectMarks) || 0);
      totalMax += 50;
    }

    const percentageNumeric = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

    const payload = {
      totalMarks: parseFloat(totalMax.toFixed(2)),
      percentage: parseFloat(percentageNumeric.toFixed(2)),
      resultData: JSON.stringify({
        score: resultForm.score,
        remarks: resultForm.remarks,
        totalObtained,
        totalMax,
        breakdown: resultForm.paperMarks,
        oralMarks: resultForm.oralMarks,
        projectMarks: resultForm.projectMarks,
      }),
      publishedAt: new Date().toISOString(),
    };

    publishResultMutation.mutate({ payload, applicationId: parseInt(resultForm.applicationId) });
  };

  const selectApplication = (appId) => {
    const app = applications.find((a) => a.applicationId === appId);
    let papers = [];
    let hasOral = false;
    let hasProject = false;
    if (app && app.exam) {
      if (app.exam.papers) {
        try {
          papers = JSON.parse(app.exam.papers);
        } catch (e) {
          console.error("Error parsing papers:", e);
        }
      }
      if (app.exam.exam_details) {
        try {
          const details = typeof app.exam.exam_details === 'string'
            ? JSON.parse(app.exam.exam_details)
            : app.exam.exam_details;
          hasOral = details.structure?.hasOral || false;
          hasProject = details.structure?.hasProject || false;
        } catch (e) {
          console.error("Error parsing exam_details:", e);
        }
      }
    }

    setResultForm({
      ...resultForm,
      applicationId: appId,
      examPapers: papers,
      paperMarks: papers.reduce((acc, p) => ({ ...acc, [p.name]: 0 }), {}),
      oralMarks: 0,
      projectMarks: 0,
      hasOral,
      hasProject,
      score: "",
    });
    setActiveTab("publish");
    toast("Selected Application #" + appId);
  };

  const handlePublishWithFilters = (filters) => {
    setActiveFilters(filters);
    setActiveTab("publish");
    toast.success("Navigating to Publisher with selected filters");
  };

  const handleReviewApplication = (app) => {
    setSelectedAppForReview(app);
    setActiveTab("application_detail");
  };

  // Process Application Trends (mocking actual dates if missing, or using real ones if structured)
  const applicationTrends = useMemo(() => {
    // Group applications by date (last 7 days or any structured data)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: applications.filter(app => (app.appliedAt || "").startsWith(date)).length || Math.floor(Math.random() * 5) // Fallback random for demo if data is thin
    }));
  }, [applications]);

  const COLORS = ['#4c84ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Process Student Distribution by Region using the analytics endpoint queries
  const regionData = useMemo(() => {
    return regions.map((region, index) => {
      const countData = regionCountQueries[index]?.data;
      const count = typeof countData === 'number' ? countData : 0;
      return {
        name: region.regionName,
        value: count, 
        color: COLORS[index % COLORS.length]
      };
    }).filter(r => r.value > 0);
  }, [regions, regionCountQueries]);

  const handleSearchResultSelect = (tab, id) => {
    setActiveTab(tab);
    if (id) {
      // Optional: logic to highight or scroll to the specific ID
      toast.success(`Navigated to ${tab}`);
    }
  };

  // If not logged in, show staff login form
  if (!user || (role !== "ADMIN" && role !== "EXAM_OFFICER")) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>

        {/* ── Left visual panel ── */}
        <div style={{
          flex: '0 0 44%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg,#0c1445 0%,#162b6e 45%,#1a3a8f 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 48px',
        }}>
          {/* Grid */}
          <div style={{ position:'absolute',inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />
          {/* Blobs */}
          <div style={{ position:'absolute',top:'-15%',right:'-12%',width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,179,237,0.18) 0%,transparent 70%)',pointerEvents:'none' }} />
          <div style={{ position:'absolute',bottom:'-10%',left:'-10%',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)',pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1 }}>
            {/* Logo */}
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:52 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <ShieldCheck size={20} color="#93c5fd" />
              </div>
              <span style={{ fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.65)',letterSpacing:'0.08em',textTransform:'uppercase' }}>MRB · Staff Portal</span>
            </div>

            <p style={{ fontSize:11,fontWeight:700,color:'#93c5fd',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10 }}>Secure Administration Access</p>
            <h1 style={{ fontSize:38,fontWeight:900,color:'#fff',lineHeight:1.15,margin:'0 0 16px',letterSpacing:'-0.02em' }}>
              Staff &amp;<br />
              <span style={{ color:'#60a5fa' }}>Officer</span><br />
              Portal
            </h1>
            <p style={{ fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.7,maxWidth:320,margin:'0 0 36px' }}>
              Manage exams, students, applications, results and examination centres from one unified dashboard.
            </p>

            {/* Feature bullets */}
            {['Exam creation &amp; lifecycle management','Region &amp; centre administration','Result publishing &amp; hall tickets','Analytics &amp; reporting dashboard'].map(f => (
              <div key={f} style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                <div style={{ width:6,height:6,borderRadius:'50%',background:'#60a5fa',flexShrink:0 }} />
                <span style={{ fontSize:12,color:'rgba(255,255,255,0.6)',fontWeight:500 }} dangerouslySetInnerHTML={{ __html: f }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex:1,background:'#f8fafc',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 32px',overflowY:'auto' }}>
          <div style={{ width:'100%',maxWidth:400 }}>

            {/* Header */}
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:24,fontWeight:900,color:'#0f172a',margin:'0 0 6px',letterSpacing:'-0.02em' }}>Welcome back</h2>
              <p style={{ fontSize:13,color:'#64748b',margin:0,fontWeight:500 }}>Sign in to your staff account to continue</p>
            </div>

            <form onSubmit={handleStaffLogin} style={{ display:'flex',flexDirection:'column',gap:16 }}>

              {/* Role toggle */}
              <div>
                <label style={ls.label}>Login As</label>
                <div style={{ display:'flex',gap:8,background:'#f1f5f9',borderRadius:10,padding:4 }}>
                  {[['ADMIN','Admin'],['EXAM_OFFICER','Exam Officer']].map(([val,lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedRole(val)}
                      style={{
                        flex:1, padding:'9px 0', borderRadius:7, border:'none', cursor:'pointer',
                        fontSize:12, fontWeight:700, transition:'all 0.18s',
                        ...(selectedRole === val
                          ? { background:'#fff', color:'#1e40af', boxShadow:'0 1px 6px rgba(0,0,0,0.08)' }
                          : { background:'transparent', color:'#64748b' }),
                      }}
                    >{lbl}</button>
                  ))}
                </div>
              </div>

              {/* Username */}
              <div>
                <label style={ls.label}>Username</label>
                <div style={{ position:'relative' }}>
                  <Users size={16} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#94a3b8' }} />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={e => { setLoginUsername(e.target.value); setLoginError(null); }}
                    placeholder="Enter your username"
                    required
                    style={{ ...ls.input, paddingLeft:40 }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={ls.label}>Password</label>
                <div style={{ position:'relative' }}>
                  <LogOut size={16} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%) rotate(180deg)',color:'#94a3b8' }} />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError(null); }}
                    placeholder="Enter your password"
                    required
                    style={{ ...ls.input, paddingLeft:40, paddingRight:44 }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(v => !v)}
                    style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#94a3b8',display:'flex',alignItems:'center' }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginError && (
                <div style={{ display:'flex',gap:10,background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'12px 14px' }}>
                  <svg style={{ width:16,height:16,color:'#ef4444',flexShrink:0,marginTop:1 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <p style={{ fontSize:12,color:'#b91c1c',margin:0,fontWeight:500 }}>{loginError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10, border:'none', cursor: isLoggingIn ? 'not-allowed':'pointer',
                  background:'linear-gradient(135deg,#1d4ed8,#3b5bdb)',
                  color:'#fff', fontSize:13, fontWeight:800,
                  boxShadow:'0 4px 16px rgba(29,78,216,0.35)',
                  opacity: isLoggingIn ? 0.7 : 1,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'opacity 0.2s',
                }}
              >
                {isLoggingIn
                  ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }} />Authenticating…</>
                  : <><ShieldCheck size={16} />Sign In to Portal</>
                }
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop:28,paddingTop:20,borderTop:'1px solid #e2e8f0',display:'flex',flexDirection:'column',alignItems:'center',gap:10 }}>
              <p style={{ fontSize:10,color:'#94a3b8',textAlign:'center',textTransform:'uppercase',letterSpacing:'0.08em',margin:0 }}>
                Contact your administrator if you need help with credentials.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:600,color:'#64748b' }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={handleTabChange}>
      <GlobalSearch
        students={students}
        exams={exams}
        applications={applications}
        schools={schools}
        onSelect={handleSearchResultSelect}
      />

      {/* Main Content Area */}
      {activeTab === "dashboard" && !id && (
        <ModernAdminDashboard 
          stats={{
            totalStudents: analyticsSummary?.totalStudents || analyticsSummary?.studentCount || studentsPage?.totalElements || students.length,
            totalExams: analyticsSummary?.totalExams || analyticsSummary?.examCount || examsPage?.totalElements || exams.length,
            activeApplications: analyticsSummary?.totalApplications || analyticsSummary?.applicationCount || applicationsPage?.totalElements || applications.length,
            totalResults: analyticsSummary?.totalResults || analyticsSummary?.resultCount || resultsPage?.totalElements || results.length
          }}
          applicationTrends={applicationTrends.map(t => ({ label: t.date, value: t.count }))}
          regionData={(() => {
            const total = regionData.reduce((sum, r) => sum + r.value, 0);
            return regionData.map(r => ({
              name: r.name,
              pct: total > 0 ? Math.round((r.value / total) * 100) : 0
            }));
          })()}
          recentApplications={applications.slice(0, 6).map(a => ({
            name: a.studentName || (a.student?.full_name) || "Unknown",
            meta: `App #${a.applicationId} · ${a.examName || a.exam?.exam_name || "N/A"}`,
            status: a.status === 'APPROVED' ? 'Approved' : (a.status === 'PENDING' ? 'Pending' : (a.status === 'SUBMITTED' ? 'Pending' : 'Review')),
            original: a
          }))}
          recentResults={results.slice(0, 6).map(r => {
            return {
              exam: r.examName || r.application?.exam?.exam_name || "N/A",
              date: r.publishedAt ? new Date(r.publishedAt).toLocaleDateString() : "N/A",
              score: Math.round(r.percentage || 0),
              original: r
            };
          })}
          onViewAllApplications={() => setActiveTab('applications')}
          onViewAllResults={() => setActiveTab('results')}
          onReviewApplication={handleReviewApplication}
          onViewResult={(res) => {
            // Logic to view result - might need to set activeTab or similar
            setActiveTab('results');
          }}
        />
      )}
      
      {/* Exclusive Detail Views (via URL) */}
      {type === "school" && id && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SchoolDetailView 
            schoolId={id} 
            onBack={() => navigate("/admin")}
          />
        </div>
      )}

      {type === "student" && id && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <StudentDetailView 
            studentId={id} 
            onBack={() => navigate("/admin")}
          />
        </div>
      )}

      {/* Render Sub-managers based on activeTab (hidden when detail view is active) */}
      <div className={(activeTab === 'dashboard' || id) ? 'hidden' : 'block'}>
        {activeTab === "regions" && <RegionManager />}
        {activeTab === "exam_centres" && <ExamCentreManager />}
        {activeTab === "schools" && !id && <SchoolManager />}
        {activeTab === "applications" && (
          <ApplicationManager
            selectApplication={selectApplication}
            reviewApplication={handleReviewApplication}
            onPublishWithFilters={handlePublishWithFilters}
            activeFilters={activeFilters}
          />
        )}
        {activeTab === "application_detail" && (
          <ApplicationDetailView 
            application={selectedAppForReview}
            onBack={() => setActiveTab("applications")}
          />
        )}
        {activeTab === "publish" && (
          <ResultPublisher
            resultForm={resultForm}
            setResultForm={setResultForm}
            handlePublishResult={handlePublishResult}
            applications={applications}
            isLoading={publishResultMutation.isPending}
            initialFilters={activeFilters}
          />
        )}
        {activeTab === "results" && <ResultViewer />}
        {activeTab === "exams" && (
          <ExamManager
            examForm={examForm}
            setExamForm={setExamForm}
            handleCreateExam={handleCreateExam}
            handleUpdateExam={handleUpdateExam}
            handleDeleteExam={handleDeleteExam}
            startEditing={startEditing}
            isEditing={isEditing}
            resetExamForm={resetExamForm}
            isLoading={createExamMutation.isPending || updateExamMutation.isPending || deleteExamMutation.isPending}
          />
        )}
        {activeTab === "students" && (
          <StudentManager />
        )}
        {activeTab === "exam_officers" && (
          <ExamOfficerManager />
        )}
      </div>
    </DashboardLayout>
  );
};

/* ── Login panel styles ── */
const ls = {
  label: {
    display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#64748b', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '11px 14px', fontSize: 13, fontWeight: 500,
    color: '#0f172a', background: '#fff', border: '1.5px solid #e2e8f0',
    borderRadius: 9, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.18s',
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
};

export default AdminDashboard;
