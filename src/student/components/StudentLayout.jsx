import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import { Menu, LayoutDashboard, LogOut } from 'lucide-react';

const StudentLayout = ({ children, activeTab, setActiveTab, currentUser, onLogout }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-x-hidden" style={{ fontFamily: 'DM Sans, Segoe UI, sans-serif' }}>
            {/* Mobile Drawer Backdrop Overlay */}
            {mobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            <StudentSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                currentUser={currentUser} 
                onLogout={onLogout}
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
                                <LayoutDashboard size={15} className="text-[#4c84ff]" />
                            </div>
                            <span className="font-black text-sm tracking-wide text-white">Student Portal</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold text-gray-300">
                            <span className="truncate max-w-[90px]">{currentUser?.firstName || 'Student'}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                            title="Sign Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8 flex-1">
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
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

export default StudentLayout;
