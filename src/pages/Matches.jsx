import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Avatar from '../components/Avatar';
import MatchCard from '../components/MatchCard';
import EmptyState from '../components/EmptyState';
import IcebreakerModal from '../components/IcebreakerModal';
import { Heart, Send, Inbox, ShieldCheck, CheckCircle2, XCircle, MessageSquare, Clock, Sparkles, Search, X, UserPlus } from 'lucide-react';

const Matches = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent' | 'mutual' | 'crush'

  const [receivedLikes, setReceivedLikes] = useState([]);
  const [sentLikes, setSentLikes] = useState([]);
  const [matches, setMatches] = useState([]);

  const [loadingReceived, setLoadingReceived] = useState(true);
  const [loadingSent, setLoadingSent] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Icebreaker modal state
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  // Secret Crush input state
  const [crushHandle, setCrushHandle] = useState('');
  const [crushMsg, setCrushMsg] = useState('');
  const [crushError, setCrushError] = useState('');
  const [isSubmittingCrush, setIsSubmittingCrush] = useState(false);

  const fetchReceivedLikes = async () => {
    setLoadingReceived(true);
    try {
      const res = await api.get('/matches/received-likes');
      if (res.success) {
        setReceivedLikes(res.data || []);
      }
    } catch (err) {
      console.error('Fetch received likes error:', err);
    } finally {
      setLoadingReceived(false);
    }
  };

  const fetchSentLikes = async () => {
    setLoadingSent(true);
    try {
      const res = await api.get('/matches/sent-likes');
      if (res.success) {
        setSentLikes(res.data || []);
      }
    } catch (err) {
      console.error('Fetch sent likes error:', err);
    } finally {
      setLoadingSent(false);
    }
  };

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

  useEffect(() => {
    fetchReceivedLikes();
    fetchSentLikes();
    fetchMatches();
  }, []);

  // Global Campus Account Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get('/discover', {
          params: { search: searchQuery.trim(), limit: 12 },
        });
        if (res.success) {
          setSearchResults(res.data || []);
        }
      } catch (err) {
        console.error('Account search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAcceptLike = async (targetUserId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/matches/accept', { targetUserId });
      if (res.success) {
        fetchReceivedLikes();
        fetchSentLikes();
        fetchMatches();
      }
    } catch (err) {
      console.error('Accept error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeclineLike = async (targetUserId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/matches/decline', { targetUserId });
      if (res.success) {
        fetchReceivedLikes();
      }
    } catch (err) {
      console.error('Decline error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendLikeFromSearch = async (targetUserId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/likes', { targetUserId });
      if (res.success) {
        fetchSentLikes();
        fetchMatches();
      }
    } catch (err) {
      console.error('Send like error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenIcebreaker = (targetUserId, name) => {
    setSelectedPartner({ targetUserId, name });
    setShowIcebreaker(true);
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

  // Filtered Tab Lists
  const filteredReceived = receivedLikes.filter((r) =>
    r.senderProfile?.anonymousName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.senderProfile?.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSent = sentLikes.filter((s) =>
    s.targetProfile?.anonymousName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.targetProfile?.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMatches = matches.filter((m) =>
    m.partner?.anonymousName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.partner?.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <span>Student Connections & Requests</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
          Search student accounts, manage connection requests, and chat with mutual matches
        </p>
      </div>

      {/* Account Search Input Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          <Search className="w-5 h-5 text-brand-400" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student accounts by anonymous handle or department..."
          className="w-full pl-11 pr-10 py-3.5 bg-dark-card border border-dark-border/80 focus:border-brand-500 rounded-2xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 shadow-glass transition-all"
        />

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Global Campus Account Search Results Panel */}
      {searchQuery.trim() !== '' && (
        <div className="bg-dark-card border border-brand-500/30 rounded-2xl p-5 shadow-glass space-y-4">
          <div className="flex items-center justify-between border-b border-dark-border/60 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Search className="w-4 h-4 text-brand-400" />
              <span>Campus Account Results for "{searchQuery}"</span>
            </h3>
            {isSearching && (
              <div className="flex items-center space-x-1.5 text-xs text-brand-400">
                <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            )}
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((profileCard) => {
                const isAlreadyLiked = sentLikes.some((s) => s.targetProfile?.userId === profileCard.userId);
                const isIncomingRequest = receivedLikes.some((r) => r.senderProfile?.userId === profileCard.userId);
                const isMatched = matches.some((m) => m.partner?.userId === profileCard.userId);

                return (
                  <div
                    key={profileCard._id}
                    className="p-4 rounded-xl bg-dark-surface/40 border border-dark-border/60 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar avatarId={profileCard.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-100 font-mono text-sm truncate">
                          {profileCard.anonymousName}
                        </h4>
                        <p className="text-slate-400 text-xs truncate">
                          {profileCard.department} • {profileCard.year}
                        </p>
                      </div>
                    </div>

                    {profileCard.bio && (
                      <p className="text-slate-300 text-xs italic line-clamp-2">
                        "{profileCard.bio}"
                      </p>
                    )}

                    {/* Action button based on state */}
                    <div className="pt-2 border-t border-dark-border/40">
                      {isMatched ? (
                        <Link
                          to="/messages"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat Now</span>
                        </Link>
                      ) : isIncomingRequest ? (
                        <button
                          onClick={() => handleAcceptLike(profileCard.userId)}
                          disabled={actionLoading}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      ) : isAlreadyLiked ? (
                        <div className="w-full py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold rounded-xl text-center flex items-center justify-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Pending Approval</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSendLikeFromSearch(profileCard.userId)}
                          disabled={actionLoading}
                          className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-glow disabled:opacity-50"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Send Like Request</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isSearching ? (
            <div className="p-6 text-center text-slate-400 text-xs italic">
              No matching student accounts found for "{searchQuery}".
            </div>
          ) : null}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-dark-border/80 space-x-2 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('received')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'received'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4 text-emerald-400" />
          <span>Requests for Me ({filteredReceived.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'sent'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4 text-brand-400" />
          <span>Likes I Sent ({filteredSent.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mutual')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'mutual'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          <span>Mutual Matches ({filteredMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('crush')}
          className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center space-x-2 whitespace-nowrap ${
            activeTab === 'crush'
              ? 'border-brand-500 text-brand-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-pink-400" />
          <span>Secret Crush</span>
        </button>
      </div>

      {/* TAB 1: Requests for Me (Inbound Likes Received) */}
      {activeTab === 'received' && (
        <div>
          {loadingReceived ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 bg-dark-card rounded-2xl border border-dark-border animate-pulse"></div>
              ))}
            </div>
          ) : filteredReceived.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReceived.map((req) => (
                <div
                  key={req.likeId}
                  className="bg-dark-card border border-dark-border/80 hover:border-brand-500/40 rounded-2xl p-5 shadow-glass flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar avatarId={req.senderProfile?.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-100 font-mono text-base truncate">
                          {req.senderProfile?.anonymousName || 'Anonymous Student'}
                        </h3>
                        <p className="text-slate-400 text-xs truncate">
                          {req.senderProfile?.department} • {req.senderProfile?.year}
                        </p>
                      </div>
                    </div>

                    {req.senderProfile?.bio && (
                      <p className="text-slate-300 text-xs italic bg-dark-surface/40 p-2.5 rounded-xl border border-dark-border/50 line-clamp-2">
                        "{req.senderProfile.bio}"
                      </p>
                    )}

                    {/* Interests tags preview */}
                    <div className="flex flex-wrap gap-1">
                      {req.senderProfile?.interests?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 text-[10px] font-medium border border-brand-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Accept or Decline */}
                  <div className="pt-3 border-t border-dark-border/60 flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptLike(req.senderProfile.userId)}
                      disabled={actionLoading}
                      className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-glow transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept & Match</span>
                    </button>

                    <button
                      onClick={() => handleDeclineLike(req.senderProfile.userId)}
                      disabled={actionLoading}
                      className="py-2.5 px-3 bg-dark-surface hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-dark-border transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="No pending requests"
              description="When other students like your anonymous profile in Discovery, their requests will appear here for you to accept!"
            />
          )}
        </div>
      )}

      {/* TAB 2: Likes I Sent (Outbound Request Statuses) */}
      {activeTab === 'sent' && (
        <div>
          {loadingSent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-dark-card rounded-2xl border border-dark-border animate-pulse"></div>
              ))}
            </div>
          ) : filteredSent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSent.map((item) => (
                <div
                  key={item.likeId}
                  className="bg-dark-card border border-dark-border/80 rounded-2xl p-5 shadow-glass flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar avatarId={item.targetProfile?.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-100 font-mono text-base truncate">
                          {item.targetProfile?.anonymousName || 'Anonymous Student'}
                        </h3>
                        <p className="text-slate-400 text-xs truncate">
                          {item.targetProfile?.department} • {item.targetProfile?.year}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="pt-2">
                      {item.isMatched ? (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Mutual Match!</span>
                          </span>
                          <Link
                            to="/messages"
                            className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg transition-all"
                          >
                            Chat
                          </Link>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5">
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Pending Approval (Waiting for response)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Send}
              title="No sent requests yet"
              description="When you like student profiles in Discovery, their approval status will be tracked right here."
            />
          )}
        </div>
      )}

      {/* TAB 3: Mutual Matches */}
      {activeTab === 'mutual' && (
        <div>
          {loadingMatches ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-dark-card rounded-2xl border border-dark-border animate-pulse"></div>
              ))}
            </div>
          ) : filteredMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((m) => (
                <MatchCard key={m.matchId} match={m} onOpenIcebreaker={handleOpenIcebreaker} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title="No active matches yet"
              description="Keep exploring in Discovery or check your Requests for Me tab to form matches!"
            />
          )}
        </div>
      )}

      {/* TAB 4: Secret Crush */}
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
