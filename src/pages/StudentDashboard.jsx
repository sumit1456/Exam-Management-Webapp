import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  getStudents,
  login,
  createExamApplication,
  getExamResults,
  getExamApplications,
  getMyStudentProfile,
  getRegions,
  getExamCentres,
  getSchools,
} from "../api";
import { searchExams as getExams } from "../api/exam-api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Award,
  User,
  UserPlus,
  LogOut,
  CheckCircle,
  BookOpen,
  FileText,
  Calendar,
  DollarSign,
  Bell,
  Download,
  FileCheck,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import MyResults from "../student/components/MyResults";
import ApplyModal from "../student/components/ApplyModal";
import ExamList from "../student/components/ExamList";

import StudentProfileSection from "../student/components/StudentProfileSection";
import StudentLayout from "../student/components/StudentLayout";
import HallTicket from "../student/components/HallTicket";
import MyCertificates from "../student/components/MyCertificates";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, role, login: authLogin, logout: authLogout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [regions, setRegions] = useState([]);
  const [centres, setCentres] = useState([]);
  const [schools, setSchools] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loginEmail, setLoginEmail] = useState("rahuljoshi123@gmail.com");
  const [loginPassword, setLoginPassword] = useState("student123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);

  const [selectedExam, setSelectedExam] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    gender: "Male",
  });

  useEffect(() => {
    if (user && role === "STUDENT") {
      setCurrentUser(user);
    }
  }, [user, role]);

  useEffect(() => {
    if (!currentUser) return; // Don't fetch until user is logged in
    
    const loadExams = async () => {
      try {
        const examPage = await getExams({ size: 1000 });
        setExams(examPage?.content || []);
      } catch (error) {
        console.error("Failed to load exams", error);
      }
    };
    const loadMasterData = async () => {
      try {
        const [rData, cData, sData] = await Promise.all([
          getRegions({ size: 1000 }),
          getExamCentres({ size: 1000 }),
          getSchools({ size: 1000 })
        ]);
        setRegions(rData?.content || []);
        setCentres(cData?.content || []);
        setSchools(sData?.content || []);
      } catch (error) {
        console.error("Failed to load master data", error);
      }
    };
    loadExams();
    loadMasterData();
  }, [currentUser]);

  const fetchProfile = async (studentData) => {
    try {
      const data = await getMyStudentProfile();
      setStudentProfile(data);
      return data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Profile not found for student, user needs to complete it.");
      } else {
        console.error("Failed to fetch profile in dashboard", error);
      }
      return null;
    }
  };

  useEffect(() => {
    if (currentUser?.studentId) {
      fetchMyResults();
      fetchMyApplications();
      
      const loadProfileAndSetTab = async () => {
        const profileData = await fetchProfile(currentUser);
        if (!profileData) {
          // Profile not found, guide to completion
          if (currentUser.hasProfile !== false) {
            setCurrentUser(prev => ({ ...prev, hasProfile: false }));
          }
          setActiveTab("profile");
        } else {
          // Profile exists
          if (currentUser.hasProfile !== true) {
            setCurrentUser(prev => ({ ...prev, hasProfile: true }));
          }
          setActiveTab("exams");
        }
      };
      
      loadProfileAndSetTab();
    }
  }, [currentUser?.studentId]);

  const fetchMyApplications = async () => {
    if (!currentUser?.studentId) return;
    setIsLoadingApplications(true);
    try {
      const data = await getExamApplications({ studentId: currentUser.studentId, size: 100 });
      setMyApplications(data?.content || []);
    } catch (error) {
      console.error("Could not fetch applications", error);
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail.trim()) return toast.error("Please enter your email address");
    if (!loginPassword.trim()) return toast.error("Please enter your password");

    setIsLoggingIn(true);
    try {
      const response = await login(loginEmail.trim(), loginPassword, "STUDENT");
      const studentUser = {
        studentId: response.userId,
        email: response.username,
        firstName: response.username.split("@")[0],
      };
      authLogin(response.token, response.role, studentUser);
      setCurrentUser(studentUser);
      toast.success(`Welcome back, ${studentUser.firstName}!`);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        console.error("Login failed", error);
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchMyResults = async () => {
    if (!currentUser?.studentId) return;
    try {
      const data = await getExamResults({ studentId: currentUser.studentId });
      setMyResults(data?.content || []);
    } catch (error) {
      console.error("Could not fetch results", error);
    }
  };

  const openApplyModal = async (exam) => {
    if (!currentUser) return toast.error("Please select a user first");

    let profileData = studentProfile;
    if (!profileData) {
      try {
        profileData = await getMyStudentProfile();
        setStudentProfile(profileData);
      } catch {
        setActiveTab("profile");
        return toast.error("Please complete your profile first before applying.");
      }
    }

    const requiredFields = [
      profileData?.dateOfBirth,
      profileData?.fatherName,
      profileData?.gender,
      profileData?.address?.line1,
      profileData?.address?.villageOrCity,
      profileData?.address?.state,
      profileData?.address?.pincode,
    ];
    const isProfileComplete = requiredFields.every(Boolean);

    if (!isProfileComplete) {
      setActiveTab("profile");
      return toast.error("Please complete your profile before applying. Fill in all required fields.");
    }

    setSelectedExam(exam);
  };

  const handleProfileUpdated = async () => {
    await fetchProfile(currentUser);
    setCurrentUser(prev => ({ ...prev, hasProfile: true }));
    setActiveTab("exams");
  };

  // Skip down to rendering for brevity...
  if (!currentUser) {
    return (
      <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>

        {/* ── Left visual panel ── */}
        <div style={{
          flex:'0 0 44%', position:'relative', overflow:'hidden',
          background: 'linear-gradient(145deg, #090d16 0%, #0d1629 45%, #15223e 100%)',
          display:'flex', flexDirection:'column', justifyContent:'center', padding:'56px 48px',
        }}>
          {/* Grid */}
          <div style={{ position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',backgroundSize:'40px 40px',pointerEvents:'none' }} />



          <div style={{ position:'relative', zIndex:1 }}>
            {/* Logo */}
            <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:52 }}>
              <div style={{ width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <GraduationCap size={20} color="#93c5fd" />
              </div>
              <span style={{ fontSize:12,fontWeight:700,color:'rgba(255,255,255,0.65)',letterSpacing:'0.08em',textTransform:'uppercase' }}>MRB · Student Portal</span>
            </div>

            <p style={{ fontSize:11,fontWeight:700,color:'#93c5fd',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10 }}>Your Exam Journey Starts Here</p>
            <h1 style={{ fontSize:38,fontWeight:900,color:'#fff',lineHeight:1.15,margin:'0 0 16px',letterSpacing:'-0.02em' }}>
              Student<br />
              <span style={{ color:'#60a5fa' }}>Examination</span><br />
              Portal
            </h1>
            <p style={{ fontSize:13,color:'rgba(255,255,255,0.5)',lineHeight:1.7,maxWidth:320,margin:'0 0 36px' }}>
              Access your exam applications, download hall tickets, track results and manage your profile — all in one place.
            </p>

            {/* Feature bullets */}
            {[
              'Browse &amp; apply for available exams',
              'Download hall tickets instantly',
              'View published results &amp; marks',
              'Download merit certificates',
            ].map(f => (
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
              <h2 style={{ fontSize:24,fontWeight:900,color:'#0f172a',margin:'0 0 6px',letterSpacing:'-0.02em' }}>Student Sign In</h2>
              <p style={{ fontSize:13,color:'#64748b',margin:0,fontWeight:500 }}>Sign in with your registered email and password</p>
            </div>

            <form onSubmit={handleLogin} style={{ display:'flex',flexDirection:'column',gap:16 }}>

              {/* Email */}
              <div>
                <label style={sls.label}>Email Address</label>
                <div style={{ position:'relative' }}>
                  <User size={16} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'#94a3b8' }} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    style={{ ...sls.input, paddingLeft:40 }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={sls.label}>Password</label>
                <div style={{ position:'relative' }}>
                  <LogOut size={16} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%) rotate(180deg)',color:'#94a3b8' }} />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    style={{ ...sls.input, paddingLeft:40, paddingRight:44 }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
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

              {/* Login btn */}
              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  width:'100%', padding:'13px 0', borderRadius:10, border:'none',
                  cursor: isLoggingIn ? 'not-allowed':'pointer',
                  background:'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  color:'#fff', fontSize:13, fontWeight:800,
                  boxShadow:'0 4px 16px rgba(99,102,241,0.4)',
                  opacity: isLoggingIn ? 0.7 : 1,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'opacity 0.2s',
                }}
              >
                {isLoggingIn
                  ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTop:'2px solid #fff',borderRadius:'50%',animation:'studentspin 0.8s linear infinite' }} />Signing in…</>
                  : <><LogOut size={16} style={{ transform:'rotate(180deg)' }} />Sign In</>
                }
              </button>

              {/* Divider */}
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ flex:1,height:1,background:'#e2e8f0' }} />
                <span style={{ fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.15em' }}>or</span>
                <div style={{ flex:1,height:1,background:'#e2e8f0' }} />
              </div>

              {/* Register btn */}
              <button
                type="button"
                onClick={() => navigate("/student/register")}
                style={{
                  width:'100%', padding:'12px 0', borderRadius:10, cursor:'pointer',
                  background:'#fff', borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#e0e7ff', color:'#4f46e5',
                  fontSize:13, fontWeight:700,
                  display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                  transition:'border-color 0.18s, background 0.18s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.borderColor='#6366f1'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor='#e0e7ff'; }}
              >
                <UserPlus size={15} /> Create New Account
              </button>
            </form>

            {/* Footer */}
            <div style={{ marginTop:28,paddingTop:20,borderTop:'1px solid #e2e8f0',display:'flex',flexDirection:'column',alignItems:'center',gap:10 }}>
              <p style={{ fontSize:10,color:'#94a3b8',textAlign:'center',textTransform:'uppercase',letterSpacing:'0.08em',margin:0 }}>
                Use the email and password you registered with. Contact your school admin for help.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{ display:'flex',alignItems:'center',gap:6,background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:600,color:'#64748b' }}
              >
                <ArrowLeft size={14} /> Back to Home
              </button>
            </div>

            <style>{`@keyframes studentspin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 mb-8">
              <h2 className="text-3xl font-black mb-2">Welcome back, {currentUser?.firstName || 'Student'}!</h2>
              <p className="text-indigo-100 opacity-80">You have {exams.length} available exams and {myResults.length} published results.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div 
                style={{ background: '#FAFBFF', border: '0.5px solid #E8EAF0', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', flexDirection: 'column', gap: 0 }} 
                onClick={() => setActiveTab('exams')}
                className="group"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4361EE' }}>
                    <BookOpen size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E', textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0, lineHeight: 1.2 }}>Available Exams</h3>
                    <p style={{ fontSize: 11, color: '#8B8FA8', margin: '2px 0 0' }}>Data grouped by examination type</p>
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid #E8EAF0' }}>
                   <div style={{ width: '100%', textAlign: 'center', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#4361EE', letterSpacing: '0.07em' }}>Open Registration</div>
                </div>
              </div>

              <div 
                style={{ background: '#FAFBFF', border: '0.5px solid #E8EAF0', borderRadius: 12, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.15s ease', display: 'flex', flexDirection: 'column', gap: 0 }} 
                onClick={() => setActiveTab('results_view')}
                className="group"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EBFBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F9E44' }}>
                    <Award size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1A1D2E', textTransform: 'uppercase', letterSpacing: '0.03em', margin: 0, lineHeight: 1.2 }}>My Results</h3>
                    <p style={{ fontSize: 11, color: '#8B8FA8', margin: '2px 0 0' }}>Performance marks and circulars</p>
                  </div>
                </div>
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid #E8EAF0' }}>
                   <div style={{ width: '100%', textAlign: 'center', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#2F9E44', letterSpacing: '0.07em' }}>Check Performance</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "profile":
        return (
          <StudentProfileSection
            student={currentUser}
            prefetchedProfile={studentProfile}
            onProfileUpdated={handleProfileUpdated}
          />
        );
      case "exams":
        return <ExamList exams={exams} openApplyModal={openApplyModal} />;
      case "notices":
        return (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-xl shadow-black/5 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600 mx-auto mb-8 rotate-3 shadow-inner">
              <Bell size={48} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">No Active Notices</h2>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              When the MRB Board publishes official notifications, dates, or circulars, they will appear right here for your convenience.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Last checked: {new Date().toLocaleTimeString()}
            </div>
          </div>
        );
      case "hall_ticket":
        {
          const generatedApplications = myApplications.filter(app => app.isHallTicketGenerated);

          if (isLoadingApplications) {
            return (
              <div className="flex flex-col items-center justify-center p-20 animate-pulse">
                <div className="w-16 h-16 bg-gray-100 rounded-full mb-4" />
                <div className="h-4 w-48 bg-gray-100 rounded" />
              </div>
            );
          }

          if (generatedApplications.length === 0) {
            return (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-xl shadow-black/5 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-8 -rotate-3 shadow-inner">
                  <Download size={48} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Hall Ticket Pending</h2>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Your hall tickets are generated after application verification. Please check back 10-15 days before the examination date.
                </p>
                <button
                  onClick={fetchMyApplications}
                  className="mt-8 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-colors"
                >
                  Refresh Status
                </button>
              </div>
            );
          }

          return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {generatedApplications.map((app) => (
                <HallTicket
                  key={app.applicationId}
                  application={app}
                  student={currentUser}
                  profile={studentProfile}
                  exam={exams.find(e => e.examNo === app.examNo) || null}
                  school={schools.find(s => s.schoolName === (app.schoolName || currentUser?.schoolName)) || null}
                  regions={regions}
                  centres={centres}
                  schools={schools}
                />
              ))}
            </div>
          );
        }
      case "certificates":
        return (
          <MyCertificates myResults={myResults} applications={myApplications} exams={exams} student={currentUser} />
        );
      case "results_view":
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-gray-900 border-l-4 border-green-600 pl-5 py-1 flex items-center gap-3 tracking-tight uppercase text-sm">
              <FileCheck size={20} className="text-green-600" /> Results & Marksheets
            </h2>
            <MyResults myResults={myResults} student={currentUser} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <StudentLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentUser={currentUser}
      onLogout={() => { authLogout(); setCurrentUser(null); }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}

        <AnimatePresence>
          {selectedExam && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                  <h3 className="font-bold text-lg uppercase tracking-tight">
                    Apply for {selectedExam.exam_name}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedExam(null)}
                    className="hover:bg-white/20 p-2 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
                <div className="p-8">
                  <ApplyModal
                    exam={selectedExam}
                    student={currentUser}
                    school={schools.find(s => s.schoolName === currentUser?.schoolName) || null}
                    onClose={() => setSelectedExam(null)}
                    onSuccess={fetchMyResults}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </StudentLayout>
  );
};

/* ── Student Login panel styles ── */
const sls = {
  label: {
    display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.08em', color: '#64748b', marginBottom: 6,
  },
  input: {
    width: '100%', padding: '11px 14px', fontSize: 13, fontWeight: 500,
    color: '#0f172a', background: '#fff',
    borderWidth: '1.5px', borderStyle: 'solid', borderColor: '#e2e8f0',
    borderRadius: 9, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.18s',
    fontFamily: "'DM Sans','Segoe UI',sans-serif",
  },
};

export default StudentDashboard;
