import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MatchCard from '../components/MatchCard';
import ProfileCard from '../components/ProfileCard';
import EmptyState from '../components/EmptyState';
import IcebreakerModal from '../components/IcebreakerModal';
import { Heart, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

const Matches = () => {
  const [activeTab, setActiveTab] = useState('mutual'); // 'mutual' | 'mystery' | 'crush'

  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  // Mystery match state
  const [mysteryMatch, setMysteryMatch] = useState(null);
  const [loadingMystery, setLoadingMystery] = useState(false);
  const [mysteryActionDone, setMysteryActionDone] = useState(false);

  // Icebreaker modal state
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  // Secret Crush input state
  const [crushHandle, setCrushHandle] = useState('');
  const [crushMsg, setCrushMsg] = useState('');
  const [crushError, setCrushError] = useState('');
  const [isSubmittingCrush, setIsSubmittingCrush] = useState(false);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await api.get('/matches');
      if (res.success) {
        setMatches(res.data || []);
      }
    } catch (err) {
      console.error('Fetch matches error:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchMysteryMatch = async () => {
    setLoadingMystery(true);
    try {
      const res = await api.get('/matches/mystery');
      if (res.success) {
        setMysteryMatch(res.data);
      }
    } catch (err) {
      console.error('Mystery match error:', err);
    } finally {
      setLoadingMystery(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (activeTab === 'mystery' && !mysteryMatch && !mysteryActionDone) {
      fetchMysteryMatch();
    }
  }, [activeTab]);

  const handleOpenIcebreaker = (targetUserId, name) => {
    setSelectedPartner({ targetUserId, name });
    setShowIcebreaker(true);
  };

  const handleMysteryLike = async (targetUserId, isSecretCrush) => {
    try {
      await api.post('/likes', { targetUserId, isSecretCrush });
      setMysteryActionDone(true);
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMysteryPass = async (targetUserId) => {
    try {
      await api.post('/passes', { targetUserId });
      setMysteryActionDone(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSecretCrushSubmit = async (e) => {
    e.preventDefault();
    setCrushMsg('');
    setCrushError('');

    if (!crushHandle.trim()) {
      setCrushError('Please enter an anonymous handle.');
      return;
    }

    setIsSubmittingCrush(true);

    try {
      // Find candidate by handle via discover query or direct
      const res = await api.get(`/discover?limit=50`);
      const matchedCard = res.data?.find(
        (p) => p.anonymousName.toLowerCase() === crushHandle.trim().toLowerCase()
      );

      if (!matchedCard) {
        setCrushError('No matching student handle found in discovery feed.');
        return;
      }

      const crushRes = await api.post('/crush', { targetUserId: matchedCard.userId });
      if (crushRes.success) {
        if (crushRes.data.isMutualSecretMatch) {
          setCrushMsg("It's a Match! You both secretly liked each other ❤️");
          fetchMatches();
        } else {
          setCrushMsg('Secret crush saved quietly! If they crush back, a mutual match will form.');
        }
        setCrushHandle('');
      }
    } catch (err) {
      setCrushError(err.message || 'Failed to submit secret crush.');
    } finally {
      setIsSubmittingCrush(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <span>Your Connections & Matches</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          View mutual matches, secret crushes, and your daily mystery match
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-dark-border/80 space-x-2 sm:space-x-4">
        <button
          onClick={() => setActiveTab('mutual')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'mutual'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Mutual Matches ({matches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mystery')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'mystery'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Daily Mystery Match</span>
        </button>

        <button
          onClick={() => setActiveTab('crush')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 ${
            activeTab === 'crush'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Secret Crush</span>
        </button>
      </div>

      {/* TAB 1: Mutual Matches */}
      {activeTab === 'mutual' && (
        <div>
          {loadingMatches ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-dark-card rounded-2xl border border-dark-border animate-pulse"></div>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((m) => (
                <MatchCard key={m.matchId} match={m} onOpenIcebreaker={handleOpenIcebreaker} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No matches yet"
              description="Keep exploring in Discovery — when another student likes your profile back, your match will appear here!"
            />
          )}
        </div>
      )}

      {/* TAB 2: Daily Mystery Match */}
      {activeTab === 'mystery' && (
        <div className="flex justify-center">
          {loadingMystery ? (
            <div className="w-full max-w-lg h-64 bg-dark-card rounded-3xl border border-dark-border animate-pulse"></div>
          ) : mysteryActionDone || !mysteryMatch ? (
            <EmptyState
              icon={Sparkles}
              title="Mystery Match completed"
              description="You have reviewed today's Mystery Match candidate! Check back tomorrow for your next daily match."
            />
          ) : (
            <div className="w-full max-w-lg space-y-3">
              <div className="text-center">
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Today's Handpicked Mystery Match</span>
                </span>
              </div>
              <ProfileCard
                profile={mysteryMatch}
                onLike={handleMysteryLike}
                onPass={handleMysteryPass}
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Secret Crush */}
      {activeTab === 'crush' && (
        <div className="max-w-lg mx-auto bg-dark-card border border-dark-border rounded-2xl p-6 shadow-glass space-y-5">
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-rose-500/20 text-rose-400 mb-1">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Send a Secret Crush</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Secretly mark an anonymous handle. The target user will <span className="text-white font-semibold">NEVER</span> be notified unless they secretly crush on you too!
            </p>
          </div>

          {crushMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              {crushMsg}
            </div>
          )}

          {crushError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              {crushError}
            </div>
          )}

          <form onSubmit={handleSecretCrushSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Student's Anonymous Handle
              </label>
              <input
                type="text"
                value={crushHandle}
                onChange={(e) => setCrushHandle(e.target.value)}
                placeholder="e.g. BluePhoenix42"
                required
                className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 font-mono text-brand-300 focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingCrush}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
            >
              {isSubmittingCrush ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Register Secret Crush</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Icebreaker Modal */}
      <IcebreakerModal
        isOpen={showIcebreaker}
        onClose={() => setShowIcebreaker(false)}
        targetUserId={selectedPartner?.targetUserId}
        partnerName={selectedPartner?.name}
      />
    </div>
  );
};

export default Matches;
