import React, { useState } from 'react';
import Avatar from './Avatar';
import { Heart, X, Sparkles, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';

const ProfileCard = ({ profile, onLike, onPass, isActionLoading = false }) => {
  const [isSecretCrush, setIsSecretCrush] = useState(false);

  if (!profile) return null;

  const {
    anonymousName,
    avatar,
    department,
    year,
    interests = [],
    lookingFor = [],
    bio,
    compatibilityScore = 75,
    showDepartment = true,
    showYear = true,
  } = profile;

  return (
    <div className="bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-8 shadow-glass relative overflow-hidden flex flex-col justify-between max-w-lg w-full mx-auto">
      {/* Top Bar: Compatibility Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>{compatibilityScore}% Interest Compatibility</span>
        </div>

        <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anonymous Student</span>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar avatarId={avatar} size="lg" />
          <div>
            <h2 className="text-xl font-bold font-mono text-white">{anonymousName}</h2>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              {showDepartment && (
                <span className="flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>{department}</span>
                </span>
              )}
              {showYear && (
                <span className="flex items-center space-x-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
                  <span>{year}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {bio ? (
          <p className="text-slate-300 text-xs sm:text-sm bg-dark-surface/40 p-4 rounded-2xl border border-dark-border/50 leading-relaxed italic">
            "{bio}"
          </p>
        ) : (
          <p className="text-slate-500 text-xs italic">No bio provided</p>
        )}

        {/* Interests */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Interests
          </span>
          <div className="flex flex-wrap gap-1.5">
            {interests.length > 0 ? (
              interests.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-brand-600/20 border border-brand-500/30 text-brand-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No interests listed</span>
            )}
          </div>
        </div>

        {/* Looking For */}
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Looking For
          </span>
          <div className="flex flex-wrap gap-1.5">
            {lookingFor.length > 0 ? (
              lookingFor.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">General Connections</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-6 mt-6 border-t border-dark-border/60 flex items-center justify-between">
        {/* Pass Button */}
        <button
          onClick={() => onPass(profile.userId)}
          disabled={isActionLoading}
          className="flex-1 py-3 px-4 bg-dark-surface/60 hover:bg-rose-500/10 hover:border-rose-500/30 border border-dark-border text-slate-300 hover:text-rose-400 font-semibold rounded-2xl transition-all flex items-center justify-center space-x-2 text-sm mr-2 disabled:opacity-50"
        >
          <X className="w-5 h-5" />
          <span>Pass</span>
        </button>

        {/* Secret Crush Toggle */}
        <button
          type="button"
          onClick={() => setIsSecretCrush(!isSecretCrush)}
          title="Mark as Secret Crush (Only notified if mutual)"
          className={`p-3 rounded-2xl border transition-all mr-2 ${
            isSecretCrush
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-glow'
              : 'bg-dark-surface/60 border-dark-border text-slate-400 hover:text-amber-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => onLike(profile.userId, isSecretCrush)}
          disabled={isActionLoading}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
        >
          <Heart className="w-5 h-5 fill-current" />
          <span>{isSecretCrush ? 'Secret Crush ❤️' : 'Like'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
