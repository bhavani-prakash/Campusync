import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { Shield, ShieldAlert, Eye, EyeOff, UserX, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const PrivacySettings = () => {
  const { profile, updateLocalProfile, logout } = useAuth();

  const [allowDiscovery, setAllowDiscovery] = useState(profile?.allowDiscovery ?? true);
  const [showDepartment, setShowDepartment] = useState(profile?.showDepartment ?? true);
  const [showYear, setShowYear] = useState(profile?.showYear ?? true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(profile?.showOnlineStatus ?? true);

  const [blockedList, setBlockedList] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchBlockedUsers = async () => {
    setLoadingBlocks(true);
    try {
      const res = await api.get('/blocks');
      if (res.success) {
        setBlockedList(res.data || []);
      }
    } catch (err) {
      console.error('Fetch blocks error:', err);
    } finally {
      setLoadingBlocks(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleTogglePrivacy = async (field, currentValue) => {
    const newValue = !currentValue;
    try {
      const res = await api.put('/profile', { [field]: newValue });
      if (res.success) {
        updateLocalProfile(res.data);
        if (field === 'allowDiscovery') setAllowDiscovery(newValue);
        if (field === 'showDepartment') setShowDepartment(newValue);
        if (field === 'showYear') setShowYear(newValue);
        if (field === 'showOnlineStatus') setShowOnlineStatus(newValue);
      }
    } catch (err) {
      console.error('Privacy update error:', err);
    }
  };

  const handleUnblock = async (blockId) => {
    try {
      const res = await api.delete(`/blocks/${blockId}`);
      if (res.success) {
        setBlockedList((prev) => prev.filter((b) => b.blockId !== blockId));
        setMsg('User unblocked successfully.');
      }
    } catch (err) {
      console.error('Unblock error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete('/profile/account');
      if (res.success) {
        await logout();
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Delete account error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Shield className="w-7 h-7 text-brand-400" />
          <span>Privacy & Safety Controls</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Manage your anonymous visibility, blocked users, and account deletion
        </p>
      </div>

      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* SECTION 1: Profile Visibility Toggles */}
      <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 shadow-glass space-y-5">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Eye className="w-5 h-5 text-brand-400" />
          <span>Profile Visibility & Controls</span>
        </h3>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/40">
            <div>
              <span className="font-semibold text-slate-200 block">Allow Discovery</span>
              <span className="text-slate-400 text-[11px]">Show your profile card to other verified students in Discovery</span>
            </div>
            <button
              onClick={() => handleTogglePrivacy('allowDiscovery', allowDiscovery)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                allowDiscovery
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {allowDiscovery ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/40">
            <div>
              <span className="font-semibold text-slate-200 block">Show Online Status</span>
              <span className="text-slate-400 text-[11px]">Display green online dot on chat threads</span>
            </div>
            <button
              onClick={() => handleTogglePrivacy('showOnlineStatus', showOnlineStatus)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                showOnlineStatus
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {showOnlineStatus ? 'Visible' : 'Hidden'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/40">
            <div>
              <span className="font-semibold text-slate-200 block">Show Department on Card</span>
              <span className="text-slate-400 text-[11px]">Display department name on public discovery cards</span>
            </div>
            <button
              onClick={() => handleTogglePrivacy('showDepartment', showDepartment)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                showDepartment
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {showDepartment ? 'Visible' : 'Hidden'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/40">
            <div>
              <span className="font-semibold text-slate-200 block">Show Academic Year</span>
              <span className="text-slate-400 text-[11px]">Display academic year badge on discovery card</span>
            </div>
            <button
              onClick={() => handleTogglePrivacy('showYear', showYear)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all ${
                showYear
                  ? 'bg-emerald-600/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              {showYear ? 'Visible' : 'Hidden'}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: Blocked Users List */}
      <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 shadow-glass space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <UserX className="w-5 h-5 text-rose-400" />
          <span>Blocked Student List</span>
        </h3>

        {loadingBlocks ? (
          <div className="p-4 text-slate-400 text-xs">Loading blocked list...</div>
        ) : blockedList.length > 0 ? (
          <div className="space-y-2">
            {blockedList.map((item) => (
              <div
                key={item.blockId}
                className="p-3.5 rounded-xl bg-dark-surface/40 border border-dark-border/40 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar avatarId={item.profile?.avatar} size="sm" />
                  <div>
                    <span className="font-bold text-sm text-slate-200 font-mono">
                      {item.profile?.anonymousName || 'Blocked User'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Blocked on {new Date(item.blockedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleUnblock(item.blockId)}
                  className="py-1.5 px-3 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No blocked users.</p>
        )}
      </div>

      {/* SECTION 3: Danger Zone / Delete Account */}
      <div className="bg-dark-card border border-rose-500/30 rounded-2xl p-6 shadow-glass space-y-4">
        <h3 className="text-base font-bold text-rose-400 flex items-center space-x-2">
          <Trash2 className="w-5 h-5" />
          <span>Danger Zone: Account Deletion</span>
        </h3>

        <p className="text-slate-400 text-xs leading-relaxed">
          Deleting your account permanently purges your private account credentials, public anonymous profile, mutual matches, chat messages, and likes. This action cannot be undone.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-semibold rounded-xl text-xs transition-all flex items-center space-x-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete Account Permanently</span>
        </button>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-dark-card border border-rose-500/40 rounded-3xl p-6 max-w-md w-full shadow-glass space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">Are you absolutely sure?</h3>

            <p className="text-slate-400 text-xs leading-relaxed">
              This will permanently delete your account, anonymous profile, mutual matches, and messages.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-5 bg-dark-surface/60 hover:bg-dark-surface border border-dark-border text-slate-300 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="py-2.5 px-5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs shadow-glow disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
