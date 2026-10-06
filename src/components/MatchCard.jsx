import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { Heart, MessageSquare, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

const MatchCard = ({ match, onOpenIcebreaker }) => {
  const navigate = useNavigate();

  if (!match || !match.partner) return null;

  const { partner, isSecretCrushMatch, matchedAt } = match;

  return (
    <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-5 shadow-glass space-y-4 hover:border-brand-500/40 transition-all flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-brand-300 bg-brand-600/20 border border-brand-500/30 px-2.5 py-0.5 rounded-full">
            {partner.compatibilityScore || 80}% Compatible
          </span>

          {isSecretCrushMatch && (
            <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-rose-400" />
              <span>Secret Crush ❤️</span>
            </span>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar avatarId={partner.avatar} size="md" />
          <div>
            <h3 className="font-bold text-base font-mono text-white">{partner.anonymousName}</h3>
            <p className="text-slate-400 text-xs flex items-center space-x-2 mt-0.5">
              <span>{partner.department}</span>
              <span>•</span>
              <span>{partner.year}</span>
            </p>
          </div>
        </div>

        {/* Bio if exists */}
        {partner.bio && (
          <p className="text-slate-300 text-xs mt-3 italic line-clamp-2 bg-dark-surface/40 p-2.5 rounded-xl border border-dark-border/40">
            "{partner.bio}"
          </p>
        )}

        {/* Interests */}
        <div className="mt-3 flex flex-wrap gap-1">
          {partner.interests?.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-600/10 text-brand-300 text-[10px] font-medium border border-brand-500/20">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-dark-border/60 flex items-center space-x-2">
        <button
          onClick={() => onOpenIcebreaker(partner.userId, partner.anonymousName)}
          className="p-2.5 rounded-xl bg-dark-surface/60 hover:bg-dark-surface border border-dark-border text-slate-300 text-xs font-semibold transition-colors flex items-center space-x-1"
          title="Get Icebreaker Prompts"
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="hidden sm:inline">Icebreakers</span>
        </button>

        <button
          onClick={() => navigate('/messages')}
          className="flex-1 py-2.5 px-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-glow"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat Now</span>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;
