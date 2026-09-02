import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Shield, Clock, LogOut, Menu, X } from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const { user, role, token, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f9fe] relative overflow-x-hidden">
      {/* Decorative background elements for glassmorphism */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop fixed + Mobile slide-over) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300 relative z-10">
        {/* Mobile Header Bar (visible on < lg) */}
        <header className="lg:hidden bg-[#090d16] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                <Shield size={15} className="text-blue-400" />
              </div>
              <span className="font-black text-sm tracking-wide text-white">MRB Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-300 uppercase">
              <div className={`w-1.5 h-1.5 rounded-full ${token ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{role || 'Admin'}</span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Desktop Auth Status Bar (visible on >= lg) */}
        <div className="hidden lg:flex bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 py-2 items-center justify-between">
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium cursor-pointer"
              title="Logout and clear session"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
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
