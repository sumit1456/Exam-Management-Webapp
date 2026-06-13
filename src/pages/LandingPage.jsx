import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, GraduationCap, Info, X } from 'lucide-react';

const LandingPage = () => {
  const [showAdminInfo, setShowAdminInfo] = useState(false);
  const [showStudentInfo, setShowStudentInfo] = useState(false);

  return (
    <div className="flex h-screen items-center justify-center bg-[#f8f9fe] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl w-full p-6 relative z-10">

        {/* Admin Card */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05, translateY: -10 }}
            onClick={() => setShowAdminInfo(true)}
            className="bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center cursor-pointer h-72 justify-center transition-all duration-300 hover:border-blue-200"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck size={48} className="text-[#4c84ff]" />
            </div>
            <h2 className="text-2xl font-black text-[#1b223c] tracking-tight uppercase">Admin Portal</h2>
            <p className="text-gray-400 mt-3 text-center text-sm font-medium px-4">Manage exams, students, and publish results.</p>
          </motion.div>

          <AnimatePresence>
            {showAdminInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-blue-50 border border-blue-200 rounded-xl p-5 z-20 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Authentication is disabled for demo.</p>
                      <p className="text-xs text-blue-700 mt-1">You can access the admin panel directly without login.</p>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setShowAdminInfo(false); }} className="text-blue-400 hover:text-blue-600 shrink-0">
                    <X size={16} />
                  </button>
                </div>
                <Link to="/admin" className="block mt-4 text-center bg-[#4c84ff] hover:bg-blue-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
                  Go to Admin Portal
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Student Card */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05, translateY: -10 }}
            onClick={() => setShowStudentInfo(true)}
            className="bg-white p-10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center cursor-pointer h-72 justify-center transition-all duration-300 hover:border-blue-200"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <GraduationCap size={48} className="text-[#4c84ff]" />
            </div>
            <h2 className="text-2xl font-black text-[#1b223c] tracking-tight uppercase">Student Portal</h2>
            <p className="text-gray-400 mt-3 text-center text-sm font-medium px-4">View exams, apply, and check your results.</p>
          </motion.div>

          <AnimatePresence>
            {showStudentInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-3 bg-indigo-50 border border-indigo-200 rounded-xl p-5 z-20 shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-indigo-900">Use these demo credentials to login:</p>
                      <div className="mt-2 bg-white rounded-lg p-3 border border-indigo-100 font-mono text-xs">
                        <p className="text-indigo-800"><span className="font-bold text-indigo-600">Email:</span> demo@gmail.com</p>
                        <p className="text-indigo-800 mt-1"><span className="font-bold text-indigo-600">Password:</span> student123</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setShowStudentInfo(false); }} className="text-indigo-400 hover:text-indigo-600 shrink-0">
                    <X size={16} />
                  </button>
                </div>
                <Link to="/student" className="block mt-4 text-center bg-[#4c84ff] hover:bg-blue-600 text-white text-sm font-bold py-2.5 rounded-lg transition-colors">
                  Go to Student Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default LandingPage;