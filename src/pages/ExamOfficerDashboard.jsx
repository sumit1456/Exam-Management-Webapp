import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  BookOpen,
  FileText,
  Award,
  ClipboardList,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ExamOfficerSidebar from "../admin/components/ExamOfficerSidebar";
import StudentManager from "../admin/components/modern-ui/StudentManager";
import ApplicationManager from "../admin/components/modern-ui/ApplicationManager";
import ApplicationDetailView from "../admin/components/ApplicationDetailView";
import ResultPublisher from "../admin/components/ResultPublisher";
import ResultViewer from "../admin/components/ResultViewer";

import {
  getStudents,
  getExamApplications,
  getExamResults,
  createExamResult,
} from "../api";
import { searchExams as getExams } from "../api/exam-api";

// ─── Exam Officer Overview Panel ────────────────────────────────────────────
const ExamOfficerOverview = ({ stats, onNavigate }) => {
  const cards = [
    {
      label: "Total Students",
      value: stats.students,
      icon: Users,
      color: "#4c84ff",
      bg: "rgba(76,132,255,0.08)",
      tab: "students",
    },
    {
      label: "Active Exams",
      value: stats.exams,
      icon: BookOpen,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.08)",
      tab: "exams",
    },
    {
      label: "Pending Applications",
      value: stats.pendingApplications,
      icon: Clock,
      color: "#ef4444",
      bg: "rgba(239,68,68,0.08)",
      tab: "applications",
    },
    {
      label: "Results Published",
      value: stats.results,
      icon: Award,
      color: "#10b981",
      bg: "rgba(16,185,129,0.08)",
      tab: "results",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1b223c] tracking-tight">
          Exam Officer Dashboard
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Manage applications, publish results, and view exam data.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map((card) => (
          <button
            key={card.tab}
            onClick={() => onNavigate(card.tab)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: card.bg }}
            >
              <card.icon size={22} style={{ color: card.color }} />
            </div>
            <p className="text-2xl font-black text-[#1b223c]">
              {card.value.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wider">
              {card.label}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-[#1b223c] mb-5 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate("applications")}
            className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Review Applications</p>
              <p className="text-xs text-blue-600 mt-0.5">Approve or reject pending applications</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("publish")}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900">Publish Results</p>
              <p className="text-xs text-emerald-600 mt-0.5">Enter and publish exam results</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("results")}
            className="flex items-center gap-3 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
              <Award size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-900">View Results</p>
              <p className="text-xs text-purple-600 mt-0.5">Browse all published results</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Exam Officer Exams View (read-only) ─────────────────────────────────────
const ExamOfficerExamsView = () => {
  const { data: examsPage, isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: () => getExams({ size: 50 }),
  });
  const exams = examsPage?.content || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#1b223c]">Exams</h2>
        <p className="text-sm text-gray-400 mt-1">All available exams (read-only view)</p>
      </div>
      <div className="grid gap-4">
        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">No exams found</p>
          </div>
        ) : (
          exams.map((exam) => (
            <div
              key={exam.examNo}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-[#1b223c]">{exam.exam_name}</p>
                <p className="text-sm text-gray-400 mt-0.5 font-mono">{exam.exam_code}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">
                    Papers: <strong>{exam.no_of_papers}</strong>
                  </span>
                  <span className="text-xs text-gray-500">
                    Fees: <strong>₹{exam.exam_fees}</strong>
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${exam.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : exam.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {exam.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ─── Main ExamOfficerDashboard ────────────────────────────────────────────────
const ExamOfficerDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAppForReview, setSelectedAppForReview] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    region: "",
    centre: "",
    school: "",
    status: "",
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

  // Redirect if not EXAM_OFFICER
  useEffect(() => {
    if (user && role === "ADMIN") {
      navigate("/admin");
    } else if (!user || !role) {
      navigate("/admin"); // go to login
    }
  }, [user, role, navigate]);

  // Data queries for stats
  const { data: studentsPage } = useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents({ size: 1 }),
    enabled: !!user,
  });

  const { data: examsPage } = useQuery({
    queryKey: ["exams"],
    queryFn: () => getExams({ size: 1 }),
    enabled: !!user,
  });

  const { data: applicationsPage } = useQuery({
    queryKey: ["applications"],
    queryFn: () => getExamApplications({ size: 1 }),
    enabled: !!user,
  });

  const { data: pendingApplicationsPage } = useQuery({
    queryKey: ["applications-pending"],
    queryFn: () => getExamApplications({ size: 1, status: "PENDING" }),
    enabled: !!user,
  });

  const { data: resultsPage } = useQuery({
    queryKey: ["results"],
    queryFn: () => getExamResults({ size: 1 }),
    enabled: !!user,
  });

  const stats = {
    students: studentsPage?.totalElements || 0,
    exams: examsPage?.totalElements || 0,
    applications: applicationsPage?.totalElements || 0,
    pendingApplications: pendingApplicationsPage?.totalElements || 0,
    results: resultsPage?.totalElements || 0,
  };

  // Auto-calculate percentage for result form
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
        totalObtained += parseFloat(resultForm.oralMarks) || 0;
        totalMax += 50;
      }
      if (resultForm.hasProject) {
        totalObtained += parseFloat(resultForm.projectMarks) || 0;
        totalMax += 50;
      }
      const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      setResultForm((prev) => ({ ...prev, score: `${percentage.toFixed(2)}%` }));
    }
  }, [
    resultForm.paperMarks,
    resultForm.examPapers,
    resultForm.oralMarks,
    resultForm.projectMarks,
    resultForm.hasOral,
    resultForm.hasProject,
  ]);

  const publishResultMutation = useMutation({
    mutationFn: ({ payload, applicationId }) =>
      createExamResult(payload, applicationId),
    onSuccess: () => {
      toast.success("Result Published!");
      setResultForm({
        applicationId: "",
        score: "",
        remarks: "Pass",
        paperMarks: {},
        examPapers: [],
        oralMarks: 0,
        projectMarks: 0,
        hasOral: false,
        hasProject: false,
      });
      queryClient.invalidateQueries({ queryKey: ["results"] });
    },
    onError: () => toast.error("Failed to publish result"),
  });

  const handlePublishResult = (e, directPayload = null, directAppId = null) => {
    if (e) e.preventDefault();
    if (directPayload) {
      const appId = directAppId || directPayload.application?.applicationId;
      const { application, ...restPayload } = directPayload;
      publishResultMutation.mutate({ payload: restPayload, applicationId: appId });
      return;
    }
    if (!resultForm.applicationId || !resultForm.score) {
      return toast.error("Please fill all fields");
    }
    const paperMarks = resultForm.paperMarks;
    let totalObtained = Object.values(paperMarks).reduce(
      (sum, m) => sum + (parseFloat(m) || 0),
      0
    );
    let totalMax = resultForm.examPapers.reduce(
      (sum, p) => sum + (p.maxMarks || 0),
      0
    );
    if (resultForm.hasOral) { totalObtained += parseFloat(resultForm.oralMarks) || 0; totalMax += 50; }
    if (resultForm.hasProject) { totalObtained += parseFloat(resultForm.projectMarks) || 0; totalMax += 50; }
    const percentageNumeric = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const payload = {
      totalMarks: parseFloat(totalMax.toFixed(2)),
      percentage: parseFloat(percentageNumeric.toFixed(2)),
      resultData: JSON.stringify({
        score: resultForm.score,
        remarks: resultForm.remarks,
        totalObtained,
        totalMax,
        breakdown: paperMarks,
        oralMarks: resultForm.oralMarks,
        projectMarks: resultForm.projectMarks,
      }),
      publishedAt: new Date().toISOString(),
    };
    publishResultMutation.mutate({
      payload,
      applicationId: parseInt(resultForm.applicationId),
    });
  };

  const selectApplication = (appId) => {
    // use local applications data from queryClient cache
    const cached = queryClient.getQueryData(["applications"]);
    const applications = cached?.content || [];
    const app = applications.find((a) => a.applicationId === appId);
    let papers = [];
    let hasOral = false;
    let hasProject = false;
    if (app?.exam) {
      try { papers = JSON.parse(app.exam.papers || "[]"); } catch { }
      try {
        const d = typeof app.exam.exam_details === "string"
          ? JSON.parse(app.exam.exam_details)
          : app.exam.exam_details;
        hasOral = d?.structure?.hasOral || false;
        hasProject = d?.structure?.hasProject || false;
      } catch { }
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

  // Guard: show nothing while redirecting
  if (!user || role !== "EXAM_OFFICER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fe] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <ExamOfficerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pl-64 flex flex-col min-h-screen relative z-10">
        <main className="p-8 pt-6 flex-1">

          {/* Overview */}
          {activeTab === "overview" && (
            <ExamOfficerOverview
              stats={stats}
              onNavigate={setActiveTab}
            />
          )}

          {/* Students — read-only */}
          {activeTab === "students" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#1b223c]">Students</h2>
                <p className="text-sm text-gray-400 mt-1">View registered students</p>
              </div>
              <StudentManager />
            </div>
          )}

          {/* Exams — read-only */}
          {activeTab === "exams" && <ExamOfficerExamsView />}

          {/* Applications */}
          {activeTab === "applications" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#1b223c]">Applications</h2>
                <p className="text-sm text-gray-400 mt-1">Review and manage exam applications</p>
              </div>
              <ApplicationManager
                selectApplication={selectApplication}
                reviewApplication={handleReviewApplication}
                onPublishWithFilters={handlePublishWithFilters}
                activeFilters={activeFilters}
              />
            </div>
          )}

          {/* Application Detail */}
          {activeTab === "application_detail" && (
            <ApplicationDetailView
              application={selectedAppForReview}
              onBack={() => setActiveTab("applications")}
            />
          )}

          {/* Publish Results */}
          {activeTab === "publish" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#1b223c]">Publish Results</h2>
                <p className="text-sm text-gray-400 mt-1">Enter and publish exam results for students</p>
              </div>
              <ResultPublisher
                resultForm={resultForm}
                setResultForm={setResultForm}
                handlePublishResult={handlePublishResult}
                applications={[]}
                isLoading={publishResultMutation.isPending}
                initialFilters={activeFilters}
              />
            </div>
          )}

          {/* View Results */}
          {activeTab === "results" && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-[#1b223c]">View Results</h2>
                <p className="text-sm text-gray-400 mt-1">Browse all published exam results</p>
              </div>
              <ResultViewer />
            </div>
          )}

        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.15); }
      `}</style>
    </div>
  );
};

export default ExamOfficerDashboard;
