import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { AVATARS, DEPARTMENTS, ACADEMIC_YEARS, INTEREST_TAGS, LOOKING_FOR_TAGS } from '../utils/constants';
import { UserCheck, Sparkles, Edit3, Save, Shield, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, profile, updateLocalProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [anonymousName, setAnonymousName] = useState(profile?.anonymousName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'avatar_preset_1');
  const [department, setDepartment] = useState(profile?.department || DEPARTMENTS[0]);
  const [year, setYear] = useState(profile?.year || ACADEMIC_YEARS[0]);
  const [interests, setInterests] = useState(profile?.interests || []);
  const [lookingFor, setLookingFor] = useState(profile?.lookingFor || []);
  const [bio, setBio] = useState(profile?.bio || '');

  // Visibility toggles
  const [profileVisibility, setProfileVisibility] = useState(profile?.profileVisibility ?? true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(profile?.showOnlineStatus ?? true);
  const [allowDiscovery, setAllowDiscovery] = useState(profile?.allowDiscovery ?? true);
  const [showDepartment, setShowDepartment] = useState(profile?.showDepartment ?? true);
  const [showYear, setShowYear] = useState(profile?.showYear ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      if (interests.length < 8) {
        setInterests([...interests, tag]);
      }
    }
  };

  const toggleLookingFor = (tag) => {
    if (lookingFor.includes(tag)) {
      setLookingFor(lookingFor.filter((l) => l !== tag));
    } else {
      setLookingFor([...lookingFor, tag]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/profile', {
        anonymousName: anonymousName.trim(),
        avatar: selectedAvatar,
        department,
        year,
        interests,
        lookingFor,
        bio,
        profileVisibility,
        showOnlineStatus,
        allowDiscovery,
        showDepartment,
        showYear,
      });

      if (res.success) {
        updateLocalProfile(res.data);
        setSuccessMsg('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Anonymous Profile</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage how your campus persona appears to other students
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
            isEditing
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              : 'bg-brand-600 text-white hover:bg-brand-500 shadow-glow'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Public Identity Card Preview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 shadow-glass text-center relative overflow-hidden">
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Verified Student</span>
            </div>

            <div className="mt-4 flex justify-center mb-4">
              <Avatar avatarId={selectedAvatar} size="xl" />
            </div>

            <h2 className="text-xl font-bold font-mono text-brand-300">{anonymousName}</h2>
            
            <p className="text-slate-400 text-xs mt-1">
              {showDepartment ? department : 'Department Hidden'} • {showYear ? year : 'Year Hidden'}
            </p>

            {bio && (
              <p className="text-slate-300 text-xs mt-4 italic bg-dark-surface/40 p-3 rounded-xl border border-dark-border/50 text-left">
                "{bio}"
              </p>
            )}

            {/* Interests Pills */}
            <div className="mt-4 pt-4 border-t border-dark-border/60 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {interests.length > 0 ? (
                  interests.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No interests selected yet</span>
                )}
              </div>
            </div>

            {/* Looking For */}
            <div className="mt-3 text-left">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Looking For
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lookingFor.length > 0 ? (
                  lookingFor.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">None specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Account Privacy Disclaimer Box */}
          <div className="p-4 rounded-xl bg-dark-surface/40 border border-dark-border/60 text-xs text-slate-400 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
              <Shield className="w-4 h-4 text-brand-400" />
              <span>Identity Protection Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Your real account email (<span className="text-slate-300">{user?.email}</span>) and internal account ID are stored securely on the backend for moderation and recovery. They are never rendered in API payloads to other students.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Controls / Details */}
        <div className="lg:col-span-2">
          <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 shadow-glass space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Profile Details & Settings</span>
            </h3>

            {isEditing ? (
              <div className="space-y-5">
                {/* Avatar Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Avatar Preset
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition-all ${
                          selectedAvatar === av.id
                            ? 'bg-brand-600/20 border-brand-500 shadow-glow ring-1 ring-brand-500'
                            : 'bg-dark-surface/40 border-dark-border hover:border-slate-600'
                        }`}
                      >
                        <Avatar avatarId={av.id} size="sm" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous Handle */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Anonymous Handle
                  </label>
                  <input
                    type="text"
                    value={anonymousName}
                    onChange={(e) => setAnonymousName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 font-mono text-brand-300 focus:outline-none focus:border-brand-500 text-sm"
                  />
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Department
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 text-xs"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d} className="bg-dark-card">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Academic Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 text-xs"
                    >
                      {ACADEMIC_YEARS.map((y) => (
                        <option key={y} value={y} className="bg-dark-card">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 text-xs resize-none"
                  />
                </div>

                {/* Interests Tags */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Interests (Select up to 8)
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {INTEREST_TAGS.map((tag) => {
                      const isSelected = interests.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleInterest(tag)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                            isSelected
                              ? 'bg-brand-600 border-brand-500 text-white'
                              : 'bg-dark-surface/40 border-dark-border text-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Looking For */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    Looking For
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {LOOKING_FOR_TAGS.map((tag) => {
                      const isSelected = lookingFor.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleLookingFor(tag)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-500 text-white'
                              : 'bg-dark-surface/40 border-dark-border text-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visibility Toggles */}
                <div className="pt-4 border-t border-dark-border/60 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                    Privacy Controls
                  </span>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Allow Profile Discovery</span>
                    <button
                      type="button"
                      onClick={() => setAllowDiscovery(!allowDiscovery)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        allowDiscovery ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {allowDiscovery ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Show Department on Card</span>
                    <button
                      type="button"
                      onClick={() => setShowDepartment(!showDepartment)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        showDepartment ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {showDepartment ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300">Show Year on Card</span>
                    <button
                      type="button"
                      onClick={() => setShowYear(!showYear)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        showYear ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {showYear ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSave}
                    className="py-3 px-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-glow transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Readonly Overview */
              <div className="space-y-4 text-xs text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/50">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Department</span>
                    <span className="font-semibold text-slate-200">{department}</span>
                  </div>
                  <div className="p-3.5 bg-dark-surface/40 rounded-xl border border-dark-border/50">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">Academic Year</span>
                    <span className="font-semibold text-slate-200">{year}</span>
                  </div>
                </div>

                <div className="p-4 bg-dark-surface/40 rounded-xl border border-dark-border/50 space-y-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Privacy Settings Status</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>Profile Discovery: <span className={allowDiscovery ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>{allowDiscovery ? 'Active' : 'Paused'}</span></div>
                    <div>Show Department: <span className={showDepartment ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{showDepartment ? 'Yes' : 'No'}</span></div>
                    <div>Show Year: <span className={showYear ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{showYear ? 'Yes' : 'No'}</span></div>
                    <div>Online Status: <span className={showOnlineStatus ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{showOnlineStatus ? 'Visible' : 'Hidden'}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
