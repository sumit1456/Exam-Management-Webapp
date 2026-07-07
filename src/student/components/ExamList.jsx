import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, IndianRupee, CheckCircle, Clock, XCircle } from 'lucide-react';

const STATUS_STYLES = {
    APPROVED: { bg: '#ECFDF5', color: '#059669', icon: <CheckCircle size={10} /> },
    PENDING: { bg: '#FFFBEB', color: '#D97706', icon: <Clock size={10} /> },
    REJECTED: { bg: '#FEF2F2', color: '#DC2626', icon: <XCircle size={10} /> },
    RESULT_PUBLISHED: { bg: '#EEF2FF', color: '#4361EE', icon: <CheckCircle size={10} /> },
    SUBMITTED: { bg: '#EEF3FF', color: '#4361EE', icon: <Clock size={10} /> },
};

const ExamList = ({ exams, openApplyModal, myApplications = [] }) => {
    const [viewMode, setViewMode] = useState('available');

    const appliedExamNos = useMemo(() => {
        const map = new Map();
        myApplications.forEach(app => {
            map.set(app.examNo, app);
        });
        return map;
    }, [myApplications]);

    const availableExams = useMemo(
        () => exams.filter(exam => !appliedExamNos.has(exam.examNo)),
        [exams, appliedExamNos]
    );

    const appliedExams = useMemo(
        () => exams.filter(exam => appliedExamNos.has(exam.examNo)),
        [exams, appliedExamNos]
    );

    const displayedExams = viewMode === 'available' ? availableExams : appliedExams;

    return (
        <div style={s.container}>
            {/* Header + Toggle */}
            <div style={s.header}>
                <div>
                    <p style={s.cardTitle}>Examinations</p>
                    <p style={s.cardSub}>
                        {viewMode === 'available'
                            ? `${availableExams.length} exam(s) open for application`
                            : `${appliedExams.length} exam(s) you've applied for`}
                    </p>
                </div>
                <div style={s.toggleBar}>
                    <button
                        onClick={() => setViewMode('available')}
                        style={{ ...s.toggleBtn, ...(viewMode === 'available' ? s.toggleActive : {}) }}
                    >
                        Available ({availableExams.length})
                    </button>
                    <button
                        onClick={() => setViewMode('applied')}
                        style={{ ...s.toggleBtn, ...(viewMode === 'applied' ? s.toggleActive : {}) }}
                    >
                        Applied ({appliedExams.length})
                    </button>
                </div>
            </div>

            {displayedExams.length === 0 ? (
                <div style={s.emptyWrap}>
                    <BookOpen size={30} style={{ color: '#D1D5E8', marginBottom: 8 }} />
                    <span style={s.emptyText}>
                        {viewMode === 'available'
                            ? "No new exams available \u2014 you've applied for all"
                            : "No applications yet \u2014 go to Available tab to apply"}
                    </span>
                </div>
            ) : (
                <div style={s.regionGrid}>
                    {displayedExams.map((exam) => {
                        const application = appliedExamNos.get(exam.examNo);
                        const isApplied = !!application;
                        const statusStyle = isApplied ? (STATUS_STYLES[application.status] || STATUS_STYLES.PENDING) : null;

                        return (
                            <motion.div
                                key={exam.examNo}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={s.regionCard}
                            >
                                <div style={s.regionCardTop}>
                                    <div style={s.regionAvatar}>
                                        {exam.exam_name?.charAt(0).toUpperCase() || 'E'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={s.regionName}>{exam.exam_name}</p>
                                        <p style={s.regionId}>Exam ID: #{exam.examNo}</p>
                                    </div>
                                    {isApplied && (
                                        <span style={{ ...s.statusBadge, background: statusStyle.bg, color: statusStyle.color }}>
                                            {statusStyle.icon} {application.status?.replace(/_/g, ' ')}
                                        </span>
                                    )}
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <p style={s.centreLabel}>Structure & Fees</p>
                                    <div style={s.centreTagWrap}>
                                        <span style={s.centreTag}><FileText size={10} /> {exam.no_of_papers} Papers</span>
                                        <span style={{ ...s.centreTag, background: '#EEF3FF', color: '#4361EE' }}><IndianRupee size={10} /> ₹{exam.exam_fees} Fee</span>
                                    </div>
                                </div>

                                {isApplied && application.status && (
                                    <div style={s.appliedMeta}>
                                        <span>Application #{application.applicationId}</span>
                                        <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                                    </div>
                                )}

                                <div style={s.regionCardFooter}>
                                    {isApplied ? (
                                        <div style={s.appliedBtn}>
                                            <CheckCircle size={12} /> Application Submitted
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => openApplyModal(exam)}
                                            style={s.manageBtn}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#4361EE';
                                                e.currentTarget.style.color = '#fff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#fff';
                                                e.currentTarget.style.color = '#4361EE';
                                            }}
                                        >
                                            START APPLICATION
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const s = {
    container: {
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12,
    },
    cardTitle: {
        fontSize: 13,
        fontWeight: 700,
        color: '#1A1D2E',
        margin: 0,
    },
    cardSub: {
        fontSize: 11,
        color: '#8B8FA8',
        margin: '3px 0 0',
    },
    toggleBar: {
        display: 'flex',
        background: '#F1F3F9',
        borderRadius: 8,
        padding: 3,
        gap: 2,
    },
    toggleBtn: {
        padding: '6px 14px',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: 'none',
        borderRadius: 6,
        cursor: 'pointer',
        background: 'transparent',
        color: '#8B8FA8',
        transition: 'all 0.15s ease',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
    toggleActive: {
        background: '#fff',
        color: '#4361EE',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    },
    emptyWrap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px 0',
        background: '#fff',
        borderRadius: 14,
        border: '0.5px solid #E8EAF0',
    },
    emptyText: {
        fontSize: 12,
        color: '#B0B3C6',
        fontStyle: 'italic',
    },
    regionGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
    },
    regionCard: {
        border: '0.5px solid #E8EAF0',
        borderRadius: 12,
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        background: '#FAFBFF',
        transition: 'all 0.15s ease',
    },
    regionCardTop: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    regionAvatar: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: '#EEF3FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: 800,
        color: '#4361EE',
        flexShrink: 0,
    },
    regionName: {
        fontSize: 13,
        fontWeight: 700,
        color: '#1A1D2E',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        lineHeight: 1.2,
    },
    regionId: {
        fontSize: 10,
        color: '#8B8FA8',
        fontWeight: 600,
        margin: '2px 0 0',
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 6,
        fontSize: 9,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        whiteSpace: 'nowrap',
        flexShrink: 0,
    },
    centreLabel: {
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: '#8B8FA8',
        margin: '0 0 6px',
    },
    centreTagWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 5,
    },
    centreTag: {
        fontSize: 10,
        fontWeight: 700,
        padding: '2px 8px',
        background: '#EEF3FF',
        color: '#4361EE',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
    },
    appliedMeta: {
        marginTop: 10,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 9,
        fontWeight: 600,
        color: '#8B8FA8',
    },
    regionCardFooter: {
        marginTop: 14,
        paddingTop: 12,
        borderTop: '0.5px solid #E8EAF0',
    },
    manageBtn: {
        width: '100%',
        padding: '7px 0',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        background: '#fff',
        color: '#4361EE',
        border: '0.5px solid #C5D0FF',
        borderRadius: 8,
        cursor: 'pointer',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        transition: 'all 0.15s ease',
    },
    appliedBtn: {
        width: '100%',
        padding: '7px 0',
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        background: '#ECFDF5',
        color: '#059669',
        border: '1px solid #A7F3D0',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
};

export default ExamList;
