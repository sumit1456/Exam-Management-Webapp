import React from 'react';
import {
    LayoutDashboard,
    MapPin,
    Building2,
    School,
    Users,
    BookOpen,
    FileText,
    Send,
    Award,
    ChevronDown,
    Search,
    UserCog,
    LogOut,
    Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { user, role, logout } = useAuth();
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'regions', label: 'Regions', icon: MapPin },
        { id: 'exam_centres', label: 'Exam Centres', icon: Building2 },
        { id: 'schools', label: 'Schools', icon: School },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'exam_officers', label: 'Exam Officers', icon: UserCog },
        { id: 'exams', label: 'Exams', icon: BookOpen },
        { id: 'applications', label: 'Applications', icon: FileText },
        { id: 'publish', label: 'Publish Results', icon: Send },
        { id: 'results', label: 'View Results', icon: Award },
    ];

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
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginRight: 12
                    }}>
                        <Shield size={18} color="#93c5fd" />
                    </div>
                    <span className="font-bold text-base tracking-wide text-white/95">MRB Admin</span>
                </div>

                {/* Search Hint */}
                <div className="px-4 mt-6">
                    <button
                        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                        className="w-full flex items-center gap-3 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm hover:bg-white/10 transition-all duration-200 group"
                    >
                        <Search size={15} className="group-hover:text-white transition-colors" />
                        <span className="flex-1 text-left text-xs font-semibold">Search...</span>
                        <kbd className="text-[9px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-400">CTRL K</kbd>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-5 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group border ${
                                    activeTab === item.id
                                        ? 'bg-blue-600/15 text-blue-400 border-blue-500/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} className={activeTab === item.id ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                                </div>
                            </button>
                        </div>
                    ))}
                </nav>

                {/* User Info Section */}
                <div className="px-4 pb-5 mt-auto">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                <Shield size={18} className="text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                    {user?.name || user?.username || 'Admin'}
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                    {role || 'ADMIN'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Online</span>
                            </div>
                            <button
                                onClick={logout}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={12} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
