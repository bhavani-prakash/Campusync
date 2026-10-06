import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ProfileCard from '../components/ProfileCard';
import EmptyState from '../components/EmptyState';
import MatchModal from '../components/MatchModal';
import { DEPARTMENTS, ACADEMIC_YEARS, INTEREST_TAGS } from '../utils/constants';
import { Compass, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';

const Discover = () => {
  const { profile: currentProfile } = useAuth();

  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterInterest, setFilterInterest] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  // Match Modal state
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (filterDepartment) params.department = filterDepartment;
      if (filterYear) params.year = filterYear;
      if (filterInterest) params.interest = filterInterest;

      const res = await api.get('/discover', { params });
      if (res.success) {
        setCandidates(res.data || []);
        setCurrentIndex(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to load discovery feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [filterDepartment, filterYear, filterInterest]);

  const handleLike = async (targetUserId, isSecretCrush) => {
    setActionLoading(true);
    try {
      const res = await api.post('/likes', { targetUserId, isSecretCrush });
      if (res.success) {
        if (res.data.isMatch) {
          setMatchedProfile(res.data.targetProfile);
          setShowMatchModal(true);
        }
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Like error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePass = async (targetUserId) => {
    setActionLoading(true);
    try {
      await api.post('/passes', { targetUserId });
      setCurrentIndex((prev) => {
        const next = prev + 1;
        return next >= candidates.length ? 0 : next;
      });
    } catch (err) {
      console.error('Pass error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const currentCandidate = candidates[currentIndex];
  const hasMore = currentIndex < candidates.length;

  const resetFilters = () => {
    setFilterDepartment('');
    setFilterYear('');
    setFilterInterest('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
            <Compass className="w-7 h-7 text-brand-400" />
            <span>Discover Students</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Connect anonymously with verified MITS students
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`py-2 px-3.5 rounded-xl font-semibold text-xs flex items-center space-x-2 border transition-all ${
            showFilters || filterDepartment || filterYear || filterInterest
              ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-glow'
              : 'bg-dark-card border-dark-border text-slate-300 hover:border-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters {(filterDepartment || filterYear || filterInterest) ? '• Active' : ''}</span>
        </button>
      </div>

      {/* Filter Drawer / Bar */}
      {showFilters && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 shadow-glass space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-dark-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Filter Discovery Feed
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-brand-400 hover:text-brand-300 flex items-center space-x-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-dark-surface/60 border border-dark-border rounded-xl text-xs text-slate-200"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-dark-card">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                Academic Year
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-3 py-2 bg-dark-surface/60 border border-dark-border rounded-xl text-xs text-slate-200"
              >
                <option value="">All Years</option>
                {ACADEMIC_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-dark-card">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                Interest
              </label>
              <select
                value={filterInterest}
                onChange={(e) => setFilterInterest(e.target.value)}
                className="w-full px-3 py-2 bg-dark-surface/60 border border-dark-border rounded-xl text-xs text-slate-200"
              >
                <option value="">All Interests</option>
                {INTEREST_TAGS.map((t) => (
                  <option key={t} value={t} className="bg-dark-card">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Feed Container */}
      <div className="flex justify-center pt-2">
        {loading ? (
          /* Loading Skeleton */
          <div className="max-w-lg w-full bg-dark-card border border-dark-border rounded-3xl p-8 space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-40 h-6 bg-dark-surface/80 rounded-full"></div>
              <div className="w-24 h-4 bg-dark-surface/80 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-surface/80"></div>
              <div className="space-y-2 flex-1">
                <div className="w-32 h-5 bg-dark-surface/80 rounded"></div>
                <div className="w-24 h-3 bg-dark-surface/80 rounded"></div>
              </div>
            </div>
            <div className="w-full h-20 bg-dark-surface/60 rounded-2xl"></div>
            <div className="flex space-x-2 pt-4">
              <div className="flex-1 h-12 bg-dark-surface/80 rounded-2xl"></div>
              <div className="flex-1 h-12 bg-dark-surface/80 rounded-2xl"></div>
            </div>
          </div>
        ) : error ? (
          <EmptyState
            title="Error loading discovery feed"
            description={error}
            actionText="Retry"
            onAction={fetchCandidates}
          />
        ) : hasMore ? (
          /* Card View */
          <ProfileCard
            profile={currentCandidate}
            onLike={handleLike}
            onPass={handlePass}
            isActionLoading={actionLoading}
          />
        ) : (
          /* Zero Cards Left */
          <EmptyState
            icon={Compass}
            title="No more profiles left to discover"
            description={
              filterDepartment || filterYear || filterInterest
                ? "No profiles matched your active filters. Try broadening your filter criteria."
                : "You've reviewed all active profiles in your campus discovery feed for now! Check back soon for new students."
            }
            actionText="Reset Filters"
            onAction={resetFilters}
          />
        )}
      </div>

      {/* Match Modal Celebration */}
      <MatchModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        currentProfile={currentProfile}
        matchedProfile={matchedProfile}
      />
    </div>
  );
};

export default Discover;
