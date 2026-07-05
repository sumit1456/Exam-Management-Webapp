import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4361EE', '#2F9E44', '#F59F00', '#E03131', '#AE3EC9', '#E67700', '#0CA678', '#1971C2'];

export default function ModernAdminDashboard({
    stats = {},
    applicationTrends = [],
    regionData = [],
    topSchools = [],
    recentApplications = [],
    recentResults = [],
    onViewAllApplications,
    onViewAllResults,
    onReviewApplication,
    onViewResult,
}) {
    const { totalStudents = 0, totalExams = 0, activeApplications = 0, totalResults = 0 } = stats;

    const kpis = [
        { label: 'Total Students', value: totalStudents, accent: '#4361EE' },
        { label: 'Exam Centres', value: totalExams, accent: '#F59F00' },
        { label: 'Total Schools', value: activeApplications, accent: '#2F9E44' },
        { label: 'Total Regions', value: totalResults, accent: '#AE3EC9' },
    ];

    const schoolData = topSchools.slice(0, 8).map(s => ({
        name: s.schoolName?.length > 16 ? s.schoolName.slice(0, 16) + '...' : s.schoolName,
        fullName: s.schoolName,
        students: s.studentCount,
    }));

    return (
        <div style={s.page}>

            {/* KPI ROW */}
            <div style={s.kpiStrip}>
                {kpis.map((k, i) => (
                    <div key={i} style={{ ...s.kpiCard, borderLeftColor: k.accent }}>
                        <span style={s.kpiLabel}>{k.label}</span>
                        <span style={s.kpiValue}>{k.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>

            {/* CHARTS ROW 1 */}
            <div style={s.chartRow}>

                {/* Application Trends - Bar Chart */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <div>
                            <p style={s.cardTitle}>Application Trends</p>
                            <p style={s.cardSub}>Daily applications · last 7 days</p>
                        </div>
                        <span style={s.badge}>7 DAYS</span>
                    </div>
                    {applicationTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={applicationTrends} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F1F7" />
                                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#8B8FA8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#8B8FA8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    cursor={{ fill: 'rgba(67,97,238,0.06)' }}
                                />
                                <Bar dataKey="value" fill="#4361EE" radius={[4, 4, 0, 0]} maxBarSize={36} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Region Distribution - Pie Chart */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <div>
                            <p style={s.cardTitle}>Students by Region</p>
                            <p style={s.cardSub}>Distribution across regions</p>
                        </div>
                        <span style={s.badge}>REGIONS</span>
                    </div>
                    {regionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={regionData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {regionData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    formatter={(val, name) => [`${val} students`, name]}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>

                {/* Top Schools - Horizontal Bar */}
                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <div>
                            <p style={s.cardTitle}>Top Schools</p>
                            <p style={s.cardSub}>By student count</p>
                        </div>
                        <span style={s.badge}>TOP {schoolData.length}</span>
                    </div>
                    {schoolData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={schoolData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F0F1F7" />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#8B8FA8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 10, fill: '#3D405B' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                                    formatter={(val, name, props) => [`${val} students`, props.payload.fullName]}
                                    cursor={{ fill: 'rgba(67,97,238,0.06)' }}
                                />
                                <Bar dataKey="students" radius={[0, 4, 4, 0]} maxBarSize={20}>
                                    {schoolData.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>

            {/* BOTTOM ROW - Recent Tables */}
            <div style={s.bottomRow}>

                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <p style={s.cardTitle}>Recent Applications</p>
                        {onViewAllApplications && (
                            <button style={s.viewAll} onClick={onViewAllApplications}>View All</button>
                        )}
                    </div>
                    {recentApplications.length === 0 ? (
                        <EmptyState label="No applications found" />
                    ) : (
                        recentApplications.map((a, i) => (
                            <div key={i} style={{ ...s.listRow, cursor: onReviewApplication ? 'pointer' : 'default' }} onClick={() => onReviewApplication?.(a.original)}>
                                <div style={s.avatar}>{a.initials || initials(a.name)}</div>
                                <div style={{ flex: 1 }}>
                                    <p style={s.listName}>{a.name}</p>
                                    <p style={s.listMeta}>{a.meta}</p>
                                </div>
                                <StatusPill status={a.status} />
                            </div>
                        ))
                    )}
                </div>

                <div style={s.card}>
                    <div style={s.cardHeader}>
                        <p style={s.cardTitle}>Recent Results</p>
                        {onViewAllResults && (
                            <button style={s.viewAll} onClick={onViewAllResults}>View All</button>
                        )}
                    </div>
                    {recentResults.length === 0 ? (
                        <EmptyState label="No results found" />
                    ) : (
                        recentResults.map((r, i) => (
                            <div key={i} style={{ ...s.listRow, cursor: onViewResult ? 'pointer' : 'default' }} onClick={() => onViewResult?.(r.original)}>
                                <div style={{ flex: 1 }}>
                                    <p style={s.listName}>{r.exam}</p>
                                    <p style={s.listMeta}>{r.date}</p>
                                </div>
                                <span style={{ ...s.resultScore, color: r.score >= 80 ? '#2F9E44' : '#E67700' }}>
                                    {r.score}%
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyState({ label = 'No data available' }) {
    return (
        <div style={s.empty}>
            <span style={s.emptyText}>{label}</span>
        </div>
    );
}

function StatusPill({ status }) {
    const map = {
        Pending: { bg: '#EEF3FF', color: '#3451D1' },
        Approved: { bg: '#EBFBEE', color: '#2F9E44' },
        Review: { bg: '#FFF9DB', color: '#E67700' },
    };
    const t = map[status] || map.Pending;
    return (
        <span style={{ ...s.pill, background: t.bg, color: t.color }}>{status}</span>
    );
}

function initials(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const s = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    },
    kpiStrip: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
    },
    kpiCard: {
        background: '#fff',
        borderRadius: 12,
        padding: '18px 20px',
        border: '0.5px solid #E8EAF0',
        borderLeft: '3px solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    kpiLabel: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color: '#8B8FA8',
    },
    kpiValue: {
        fontSize: 26,
        fontWeight: 700,
        color: '#1A1D2E',
        lineHeight: 1,
    },
    chartRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 14,
    },
    bottomRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
    },
    card: {
        background: '#fff',
        borderRadius: 14,
        padding: '20px 22px',
        border: '0.5px solid #E8EAF0',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
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
    badge: {
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 8px',
        borderRadius: 6,
        background: '#EEF3FF',
        color: '#3451D1',
        letterSpacing: '0.04em',
    },
    listRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderBottom: '0.5px solid #F0F1F7',
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: '50%',
        background: '#EEF3FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        fontWeight: 700,
        color: '#3451D1',
        flexShrink: 0,
    },
    listName: { fontSize: 13, fontWeight: 500, color: '#1A1D2E', margin: 0 },
    listMeta: { fontSize: 11, color: '#8B8FA8', margin: '2px 0 0' },
    pill: {
        fontSize: 10,
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 20,
        whiteSpace: 'nowrap',
    },
    resultScore: {
        fontSize: 15,
        fontWeight: 800,
    },
    empty: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '28px 0',
    },
    emptyText: {
        fontSize: 13,
        color: '#B0B3C6',
        fontStyle: 'italic',
    },
    viewAll: {
        fontSize: 11,
        fontWeight: 600,
        color: '#4361EE',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
};
