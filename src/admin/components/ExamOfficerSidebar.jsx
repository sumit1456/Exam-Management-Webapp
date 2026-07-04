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
        <div className="w-64 bg-[#1b223c] text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 bg-emerald-600">
                <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center mr-3">
                    <ClipboardList size={20} className="text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">MRB Staff</span>
            </div>

            {/* User Info */}
            <div className="px-4 mt-5">
                <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <span className="text-emerald-400 font-bold text-sm uppercase">
                            {user?.username?.charAt(0) || 'E'}
                        </span>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white text-sm font-bold truncate">{user?.username || 'Exam Officer'}</p>
                        <p className="text-emerald-400 text-xs font-medium tracking-wider uppercase">Exam Officer</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar pb-6">
                {menuItems.map((item) => (
                    <div key={item.id}>
                        <button
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group ${
                                activeTab === item.id
                                    ? 'bg-emerald-600/15 text-emerald-400'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon
                                size={20}
                                className={activeTab === item.id ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}
                            />
                            <span className="text-sm font-medium uppercase tracking-wider">{item.label}</span>
                        </button>

                        {activeTab === item.id && (
                            <div className="h-0.5 bg-emerald-500 rounded-full mx-3 mt-1 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}
                    </div>
                ))}
            </nav>

            {/* Logout Footer */}
            <div className="px-4 pb-6">
                <div className="h-px bg-white/10 mb-4" />
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
                >
                    <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
                    <span className="text-sm font-medium uppercase tracking-wider">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ExamOfficerSidebar;
