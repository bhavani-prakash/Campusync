import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, MessageSquare, X, Copy, Check } from 'lucide-react';

const IcebreakerModal = ({ isOpen, onClose, targetUserId, partnerName, onSelectIcebreaker }) => {
  const [icebreakers, setIcebreakers] = useState([]);
  const [sharedInterests, setSharedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (isOpen && targetUserId) {
      setLoading(true);
      api.get(`/matches/icebreakers/${targetUserId}`)
        .then((res) => {
          if (res.success) {
            setIcebreakers(res.data.icebreakers || []);
            setSharedInterests(res.data.sharedInterests || []);
          }
        })
        .catch((err) => console.error('Icebreakers error:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, targetUserId]);

  if (!isOpen) return null;

  const handleCopy = (question, index) => {
    navigator.clipboard.writeText(question);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    if (onSelectIcebreaker) {
      onSelectIcebreaker(question);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 max-w-md w-full shadow-glass relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-dark-surface/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-brand-600/20 text-brand-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Icebreaker Questions</h3>
            <p className="text-slate-400 text-xs">For chatting with <span className="font-mono text-brand-300 font-bold">{partnerName}</span></p>
          </div>
        </div>

        {sharedInterests.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 bg-dark-surface/40 p-2.5 rounded-xl border border-dark-border/40">
            <span className="font-semibold text-slate-300">Shared Interests:</span>
            {sharedInterests.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 text-[10px] font-medium">
                {t}
              </span>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Generating icebreakers...</span>
          </div>
        ) : (
          <div className="space-y-2.5">
            {icebreakers.map((question, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-dark-surface/50 border border-dark-border/70 hover:border-brand-500/40 flex items-center justify-between group transition-all"
              >
                <p className="text-slate-200 text-xs sm:text-sm font-medium pr-3 leading-relaxed">
                  "{question}"
                </p>
                <button
                  onClick={() => handleCopy(question, idx)}
                  className="p-2 rounded-xl bg-brand-600/20 text-brand-400 hover:bg-brand-600 hover:text-white transition-all shrink-0"
                  title="Copy question"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IcebreakerModal;
