import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Avatar from '../components/Avatar';
import { AVATARS, DEPARTMENTS, ACADEMIC_YEARS, INTEREST_TAGS, LOOKING_FOR_TAGS } from '../utils/constants';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Tag, BookOpen } from 'lucide-react';

const Onboarding = () => {
  const { profile, updateLocalProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'avatar_preset_1');
  const [anonymousName, setAnonymousName] = useState(profile?.anonymousName || '');
  const [department, setDepartment] = useState(profile?.department || DEPARTMENTS[0]);
  const [year, setYear] = useState(profile?.year || ACADEMIC_YEARS[0]);
  const [selectedInterests, setSelectedInterests] = useState(profile?.interests || []);
  const [selectedLookingFor, setSelectedLookingFor] = useState(profile?.lookingFor || []);
  const [bio, setBio] = useState(profile?.bio || '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== tag));
    } else {
      if (selectedInterests.length < 8) {
        setSelectedInterests([...selectedInterests, tag]);
      }
    }
  };

  const toggleLookingFor = (tag) => {
    if (selectedLookingFor.includes(tag)) {
      setSelectedLookingFor(selectedLookingFor.filter((l) => l !== tag));
    } else {
      setSelectedLookingFor([...selectedLookingFor, tag]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.put('/profile', {
        anonymousName: anonymousName.trim(),
        avatar: selectedAvatar,
        department,
        year,
        interests: selectedInterests,
        lookingFor: selectedLookingFor,
        bio,
      });

      if (res.success) {
        updateLocalProfile(res.data);
        navigate('/home', { replace: true });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete profile setup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Step Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-600/20 text-brand-400 text-xs font-semibold border border-brand-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {step} of 3 — Profile Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Customize Your Identity
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Build your campus persona without revealing your private name
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 sm:p-8 shadow-glass backdrop-blur-md">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
              {errorMsg}
            </div>
          )}

          {/* STEP 1: Avatar & Handle */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                  Choose Your Avatar Preset
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                        selectedAvatar === av.id
                          ? 'bg-brand-600/20 border-brand-500 shadow-glow ring-2 ring-brand-500'
                          : 'bg-dark-surface/40 border-dark-border hover:border-slate-600'
                      }`}
                    >
                      <Avatar avatarId={av.id} size="md" />
                      <span className="text-[11px] font-medium text-slate-300 text-center truncate w-full">
                        {av.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Anonymous Handle
                </label>
                <input
                  type="text"
                  value={anonymousName}
                  onChange={(e) => setAnonymousName(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 font-mono text-brand-300 focus:outline-none focus:border-brand-500 text-sm"
                  placeholder="e.g. BluePhoenix42"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all flex items-center space-x-2 text-sm"
                >
                  <span>Next: Academics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Department & Year & Bio */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Department / Branch
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-500 text-sm"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-dark-card text-slate-200">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-500 text-sm"
                >
                  {ACADEMIC_YEARS.map((y) => (
                    <option key={y} value={y} className="bg-dark-card text-slate-200">
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Bio / Intro (Optional)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Share a short intro about your campus interests, favorite spots, or hobbies..."
                  className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 focus:outline-none focus:border-brand-500 text-sm resize-none"
                />
                <div className="text-right text-[11px] text-slate-500">{bio.length}/500</div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-5 border border-dark-border text-slate-300 hover:bg-dark-surface/60 rounded-xl transition-all flex items-center space-x-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="py-3 px-6 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all flex items-center space-x-2 text-sm"
                >
                  <span>Next: Interests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Interests & Looking For */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Interests (up to 8)
                </label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {INTEREST_TAGS.map((tag) => {
                    const isSelected = selectedInterests.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-brand-600 border-brand-500 text-white shadow-glow'
                            : 'bg-dark-surface/40 border-dark-border text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  What are you looking for on CampusSync?
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_TAGS.map((tag) => {
                    const isSelected = selectedLookingFor.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleLookingFor(tag)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-glow'
                            : 'bg-dark-surface/40 border-dark-border text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="py-3 px-5 border border-dark-border text-slate-300 hover:bg-dark-surface/60 rounded-xl transition-all flex items-center space-x-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinish}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center space-x-2 text-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Setup</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
