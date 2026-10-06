import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import {
  ShieldAlert,
  Users,
  Heart,
  MessageSquare,
  AlertTriangle,
  UserX,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'stats'
  const [actionMsg, setActionMsg] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setActionMsg('');
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/reports'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (reportsRes.success) setReports(reportsRes.data || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, { status });
      if (res.success) {
        setReports((prev) =>
          prev.map((r) => (r._id === reportId ? { ...r, status } : r))
        );
        setActionMsg(`Report marked as ${status}`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Report update error:', err);
    }
  };

  const handleBanUser = async (userId, anonymousName) => {
    if (!window.confirm(`Are you sure you want to ban user ${anonymousName}?`)) return;

    try {
      const res = await api.put(`/admin/users/${userId}/ban`, {
        banReason: 'Moderation review violation',
      });
      if (res.success) {
        setActionMsg(`User ${anonymousName} banned successfully.`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Ban user error:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">CampusSync Moderation</h1>
        </div>

        <button
          onClick={fetchDashboardData}
          className="py-2.5 px-4 bg-dark-card border border-dark-border hover:border-slate-600 text-slate-300 font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-glass"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Users className="w-3.5 h-3.5 text-brand-400" />
            <span>Total Students</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalUsers ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Students</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{stats?.activeUsers ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>Total Matches</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalMatches ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Messages</span>
          </div>
          <div className="text-2xl font-extrabold text-white">{stats?.totalMessages ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pending Reports</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{stats?.pendingReports ?? 0}</div>
        </div>

        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border/80 shadow-glass space-y-1">
          <div className="text-slate-400 text-[10px] uppercase font-semibold flex items-center space-x-1">
            <UserX className="w-3.5 h-3.5 text-rose-500" />
            <span>Banned Users</span>
          </div>
          <div className="text-2xl font-extrabold text-rose-400">{stats?.bannedUsers ?? 0}</div>
        </div>
      </div>

      {/* Moderation Queue Section */}
      <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 shadow-glass space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <span>Moderation Reports Queue</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading moderation queue...</div>
        ) : reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report._id}
                className="p-5 rounded-2xl bg-dark-surface/40 border border-dark-border/60 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-dark-border/40 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      Reason: {report.reason}
                    </span>
                    <span className="text-xs text-slate-400">
                      Filed: {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      report.status === 'PENDING'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : report.status === 'RESOLVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    Status: {report.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block uppercase font-semibold text-[10px]">Reporter</span>
                    <span className="text-slate-200 font-mono font-semibold">
                      {report.reporter?.anonymousName || 'Anonymous Student'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block uppercase font-semibold text-[10px]">Reported Student</span>
                    <span className="text-rose-400 font-mono font-semibold">
                      {report.reportedStudent?.profile?.anonymousName || 'Target Student'}
                    </span>
                  </div>
                </div>

                {report.description && (
                  <p className="text-slate-300 text-xs italic bg-dark-card p-3 rounded-xl border border-dark-border/50">
                    "{report.description}"
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    onClick={() => handleUpdateReportStatus(report._id, 'RESOLVED')}
                    className="py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
                  >
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => handleUpdateReportStatus(report._id, 'DISMISSED')}
                    className="py-1.5 px-3 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-slate-300 text-xs font-semibold transition-all"
                  >
                    Dismiss Report
                  </button>

                  {report.reportedStudent?.user?._id && (
                    <button
                      onClick={() =>
                        handleBanUser(
                          report.reportedStudent.user._id,
                          report.reportedStudent?.profile?.anonymousName || 'User'
                        )
                      }
                      className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-glow flex items-center space-x-1"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Ban Account</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CheckCircle2}
            title="Moderation queue clear"
            description="There are currently no pending student reports requiring moderation review."
          />
        )}
      </div>

      {/* Security Protection Footnote */}
      <div className="p-4 rounded-xl bg-dark-surface/40 border border-dark-border/60 text-xs text-slate-400 flex items-start space-x-3">
        <Lock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-200 block">Strict Data Privacy & Security Enforced</span>
          <p className="text-[11px] leading-relaxed mt-0.5">
            Passwords and private JWT keys are non-retrievable and excluded from all administrative endpoints. Moderation decisions adhere strictly to student safety guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
