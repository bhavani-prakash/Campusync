import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { Heart, MessageSquare, Sparkles, X } from 'lucide-react';

const MatchModal = ({ isOpen, onClose, currentProfile, matchedProfile }) => {
  const navigate = useNavigate();

  if (!isOpen || !matchedProfile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-dark-card border border-brand-500/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-glow relative overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-dark-surface/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mutual Connection!</span>
        </div>

        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-rose-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
          It's a Match!
        </h2>

        {/* Dual Avatars */}
        <div className="flex items-center justify-center -space-x-4 my-4">
          <div className="ring-4 ring-dark-card rounded-2xl">
            <Avatar avatarId={currentProfile?.avatar} size="lg" />
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center z-10 shadow-lg">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="ring-4 ring-dark-card rounded-2xl">
            <Avatar avatarId={matchedProfile?.avatar} size="lg" />
          </div>
        </div>

        <p className="text-slate-300 text-xs">
          You and <span className="font-mono text-brand-300 font-bold">{matchedProfile?.anonymousName}</span> both liked each other!
        </p>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              navigate('/messages');
            }}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-glow transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Start Conversation</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-dark-surface/60 hover:bg-dark-surface border border-dark-border text-slate-300 font-semibold rounded-xl text-xs transition-colors"
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;
