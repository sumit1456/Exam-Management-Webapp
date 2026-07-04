import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Shield, Clock, LogOut } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, role, token, loading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8f9fe] relative overflow-hidden">
      {/* Decorative background elements for glassmorphism */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pl-64 flex flex-col min-h-screen transition-all duration-300 relative z-10">
        {/* Auth Status Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {token ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-green-600">Session Active</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-medium text-red-600">No Session</span>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Shield size={12} />
              <span>{role || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock size={12} />
            <span>{new Date().toLocaleTimeString()}</span>
            <div className="h-4 w-px bg-gray-200 ml-2" />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
              title="Logout and clear session"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <main className="p-8 pt-6 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>

  );
};

export default DashboardLayout;
