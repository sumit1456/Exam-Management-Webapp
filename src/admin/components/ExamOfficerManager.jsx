import React, { useState } from 'react';
import {
    UserCog, Plus, Pencil, Trash2, Eye, EyeOff, X,
    Search, RefreshCw, Shield, CheckCircle, AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getExamOfficers,
    createExamOfficer,
    updateExamOfficer,
    deleteExamOfficer,
} from '../../api/exam-officer-api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const EMPTY_FORM = { name: '', username: '', password: '' };

const Avatar = ({ name, username }) => {
    const initials = name
        ? name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
        : (username?.[0] || 'E').toUpperCase();
    return (
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-indigo-600 font-bold text-sm">{initials}</span>
        </div>
    );
};

// ─── Modal ─────────────────────────────────────────────────────────────────────
const OfficerModal = ({ isOpen, onClose, onSubmit, form, setForm, isEditing, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.username.trim()) e.username = 'Username is required';
        if (!isEditing && !form.password.trim()) e.password = 'Password is required';
        return e;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setErrors({});
        onSubmit();
    };

    const field = (label, key, type = 'text', placeholder = '') => (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                {label} {key !== 'name' && !isEditing && <span className="text-red-500">*</span>}
                {key === 'password' && isEditing && (
                    <span className="normal-case font-normal text-gray-400 ml-1">(leave blank to keep unchanged)</span>
                )}
            </label>
            <div className="relative">
                <input
                    type={key === 'password' ? (showPassword ? 'text' : 'password') : type}
                    value={form[key]}
                    onChange={(e) => { setForm(prev => ({ ...prev, [key]: e.target.value })); setErrors(prev => ({ ...prev, [key]: '' })); }}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}`}
                    className={`w-full px-4 py-3 rounded-xl border-2 bg-gray-50 outline-none font-medium text-gray-700 transition-all duration-200 focus:bg-white ${errors[key] ? 'border-red-300 focus:border-red-400' : 'border-transparent focus:border-blue-500'}`}
                />
                {key === 'password' && (
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {errors[key] && <p className="text-xs text-red-500 mt-1 ml-1">{errors[key]}</p>}
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 z-10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <UserCog size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-[#1b223c] text-lg">
                                {isEditing ? 'Edit Exam Officer' : 'Add Exam Officer'}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {isEditing ? 'Update officer details' : 'Create a new staff account'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {field('Full Name', 'name', 'text', 'e.g. Ramesh Kumar')}
                    {field('Username', 'username', 'text', 'e.g. ramesh_k')}
                    {field('Password', 'password', 'password')}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CheckCircle size={16} />
                            )}
                            {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Officer')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const ExamOfficerManager = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // holds officer id to confirm delete

    const { data: officers = [], isLoading, refetch } = useQuery({
        queryKey: ['examOfficers'],
        queryFn: getExamOfficers,
    });

    const createMutation = useMutation({
        mutationFn: (data) => createExamOfficer(data),
        onSuccess: () => {
            toast.success('Exam Officer created successfully!');
            queryClient.invalidateQueries({ queryKey: ['examOfficers'] });
            closeModal();
        },
        onError: (err) => {
            const msg = err.response?.data?.message || err.response?.data || 'Failed to create officer';
            toast.error(typeof msg === 'string' ? msg : 'Failed to create officer');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateExamOfficer(id, data),
        onSuccess: () => {
            toast.success('Exam Officer updated!');
            queryClient.invalidateQueries({ queryKey: ['examOfficers'] });
            closeModal();
        },
        onError: (err) => {
            const msg = err.response?.data?.message || err.response?.data || 'Failed to update officer';
            toast.error(typeof msg === 'string' ? msg : 'Failed to update officer');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteExamOfficer(id),
        onSuccess: () => {
            toast.success('Exam Officer deleted.');
            queryClient.invalidateQueries({ queryKey: ['examOfficers'] });
            setDeleteConfirm(null);
        },
        onError: () => toast.error('Failed to delete officer'),
    });

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setIsEditing(false);
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEdit = (officer) => {
        setForm({ name: officer.name || '', username: officer.username || '', password: '' });
        setIsEditing(true);
        setEditingId(officer.examOfficerId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setForm(EMPTY_FORM);
        setEditingId(null);
    };

    const handleSubmit = () => {
        const payload = { ...form };
        // On edit, omit password if blank (keep unchanged)
        if (isEditing && !payload.password.trim()) delete payload.password;
        if (isEditing) {
            updateMutation.mutate({ id: editingId, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const filtered = officers.filter((o) => {
        const q = search.toLowerCase();
        return (
            (o.name || '').toLowerCase().includes(q) ||
            (o.username || '').toLowerCase().includes(q)
        );
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-[#1b223c]">Exam Officers</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Manage staff accounts with exam officer access
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => refetch()}
                        className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-md shadow-indigo-200"
                    >
                        <Plus size={16} />
                        Add Officer
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or username..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 outline-none text-sm text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <UserCog size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#1b223c]">{officers.length}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Officers</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <Shield size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-[#1b223c]">{filtered.length}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                            {search ? 'Matching Results' : 'Active Accounts'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <UserCog size={40} className="text-gray-200 mb-3" />
                        <p className="text-gray-500 font-bold">
                            {search ? 'No officers match your search' : 'No exam officers yet'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            {search ? 'Try a different search term' : 'Click "Add Officer" to create the first one'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Table Head */}
                        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <div className="col-span-5">Officer</div>
                            <div className="col-span-4">Username</div>
                            <div className="col-span-2">ID</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>

                        {/* Rows */}
                        {filtered.map((officer) => (
                            <div
                                key={officer.examOfficerId}
                                className="grid grid-cols-12 gap-4 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group"
                            >
                                {/* Officer name + avatar */}
                                <div className="col-span-5 flex items-center gap-3">
                                    <Avatar name={officer.name} username={officer.username} />
                                    <div>
                                        <p className="font-bold text-[#1b223c] text-sm">
                                            {officer.name || <span className="text-gray-400 font-normal italic">No name set</span>}
                                        </p>
                                        <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                            <Shield size={9} /> Exam Officer
                                        </span>
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="col-span-4">
                                    <p className="text-sm font-mono text-gray-600">{officer.username}</p>
                                </div>

                                {/* ID */}
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-400 font-mono">#{officer.examOfficerId}</p>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEdit(officer)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(officer.examOfficerId)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 z-10 p-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 mx-auto mb-4">
                            <AlertCircle size={28} className="text-red-500" />
                        </div>
                        <h3 className="text-center font-bold text-[#1b223c] text-lg mb-1">Delete Officer?</h3>
                        <p className="text-center text-gray-400 text-sm mb-6">
                            This will permanently delete the officer account. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteMutation.mutate(deleteConfirm)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {deleteMutation.isPending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Trash2 size={14} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            <OfficerModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handleSubmit}
                form={form}
                setForm={setForm}
                isEditing={isEditing}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default ExamOfficerManager;
