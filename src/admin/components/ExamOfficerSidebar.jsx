import React from 'react';
import {
    Users,
    BookOpen,
    FileText,
    Send,
    Award,
    LogOut,
    ClipboardList,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ExamOfficerSidebar = ({ activeTab, setActiveTab }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: ClipboardList },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'exams', label: 'Exams', icon: BookOpen },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'publish', label: 'Publish Results', icon: Send },
        { id: 'results', label: 'View Results', icon: Award },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div 
            className="w-64 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 overflow-hidden border-r border-white/10"
            style={{
                background: 'linear-gradient(145deg, #090d16 0%, #0d1629 50%, #15223e 100%)',
            }}
        >

            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

            {/* Content Container */}
            <div className="flex-1 flex flex-col relative z-10 h-full">
                {/* Brand Header */}
                <div className="h-16 flex items-center px-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justify: 'center',
                        marginRight: 12
                    }}>
                        <ClipboardList size={18} className="text-emerald-400" />
                    </div>
                    <span className="font-bold text-base tracking-wide text-white/95">MRB Staff</span>
                </div>

                {/* User Info Card */}
                <div className="px-4 mt-5">
                    <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                            <span className="text-emerald-400 font-bold text-sm uppercase">
                                {user?.username?.charAt(0) || 'E'}
                            </span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-white text-sm font-bold truncate">{user?.username || 'Exam Officer'}</p>
                            <p className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase mt-0.5">Exam Officer</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group border ${
                                    activeTab === item.id
                                        ? 'bg-emerald-600/15 text-emerald-400 border-emerald-500/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border-transparent'
                                }`}
                            >
                                <item.icon
                                    size={18}
                                    className={activeTab === item.id ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}
                                />
                                <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                            </button>
                        </div>
                    ))}
                </nav>

                {/* Logout Footer */}
                <div className="px-4 pb-6">
                    <div className="h-px bg-white/10 mb-4" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/25 transition-colors group"
                    >
                        <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
                        <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamOfficerSidebar;
