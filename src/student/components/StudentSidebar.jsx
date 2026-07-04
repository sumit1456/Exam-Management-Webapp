import React, { useState, memo } from 'react';
import {
    LayoutDashboard,
    User,
    BookOpen,
    Bell,
    Download,
    Award,
    FileCheck,
    ChevronDown,
    ChevronRight,
    LogOut
} from 'lucide-react';

const StudentSidebar = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
    const [openMenus, setOpenMenus] = useState(['exams']);

    const toggleMenu = (id) => {
        setOpenMenus(prev => 
            prev.includes(id) 
                ? prev.filter(m => m !== id) 
                : [...prev, id]
        );
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile', icon: User },
        { 
            id: 'exams', 
            label: 'Exam Services', 
            icon: BookOpen,
            children: [
                { id: 'notices', label: 'Exam Notices', icon: Bell },
                { id: 'hall_ticket', label: 'Hall Ticket', icon: Download },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'results_view', label: 'Results & Marksheets', icon: FileCheck },
            ]
        },
    ];

    const renderMenuItem = (item, isSub = false) => {
        const isActive = activeTab === item.id;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openMenus.includes(item.id);

        return (
            <div key={item.id} className="w-full">
                <button
                    onClick={() => {
                        if (hasChildren) {
                            toggleMenu(item.id);
                        } else {
                            setActiveTab(item.id);
                        }
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 group border ${
                        isActive 
                            ? 'bg-[#4c84ff]/15 text-[#4c84ff] border-[#4c84ff]/25' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon size={isSub ? 16 : 18} className={isActive ? 'text-[#4c84ff]' : 'text-gray-400 group-hover:text-white'} />
                        <span className={`${isSub ? 'text-xs' : 'text-xs'} font-bold ${isSub ? 'capitalize tracking-wide' : 'uppercase tracking-wider'}`}>
                            {item.label}
                        </span>
                    </div>
                    {hasChildren && (
                        isOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />
                    )}
                </button>

                {hasChildren && isOpen && (
                    <div className="mt-1 ml-4 pl-3.5 border-l border-white/10 space-y-1">
                        {item.children.map(child => renderMenuItem(child, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div 
            className="w-64 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 overflow-hidden border-r border-white/10"
            style={{
                background: 'linear-gradient(145deg, #090d16 0%, #0d1629 50%, #15223e 100%)',
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >

            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

            {/* Content Container */}
            <div className="flex-1 flex flex-col relative z-10 h-full">
                {/* Brand Header */}
                <div className="h-20 flex items-center px-8 border-b border-white/5 bg-white/5 backdrop-blur-md">
                    <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justify: 'center',
                        marginRight: 14
                    }}>
                        <LayoutDashboard size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-sm tracking-wide leading-none text-white/95">STUDENT</span>
                        <span className="text-[9px] font-bold opacity-60 tracking-[0.2em] mt-1 uppercase text-blue-400">Portal</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-10 mt-8">
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.25em] px-4 mb-4">
                        Main Menu
                    </div>
                    {menuItems.map(item => renderMenuItem(item))}
                </div>

                {/* User Profile & Logout */}
                <div className="p-5 border-t border-white/5 bg-black/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#4c84ff]/20 border border-[#4c84ff]/30 flex items-center justify-center font-bold text-sm text-[#93c5fd]">
                            {currentUser?.firstName?.charAt(0) || 'S'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold truncate text-white">{currentUser?.firstName || 'Student'}</span>
                            <span className="text-[9px] text-gray-400 font-bold truncate tracking-wider uppercase opacity-75">ID: #{currentUser?.studentId || 'N/A'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 text-gray-300 text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white border border-white/10 transition-all duration-300"
                    >
                        <LogOut size={12} /> Sign Out
                    </button>
                </div>

                {/* Bottom Credits */}
                <div className="p-5 border-t border-white/5">
                    <div className="py-2.5 bg-[#4c84ff]/10 rounded-xl border border-[#4c84ff]/20">
                        <p className="text-[9px] text-[#93c5fd] font-bold uppercase tracking-wider text-center margin-0">
                            MRB Examination System
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(StudentSidebar);
