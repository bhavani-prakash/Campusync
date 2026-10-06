import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, UserCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

const ADJECTIVES = ['Silent', 'Blue', 'Mystery', 'Crypto', 'Quantum', 'Cosmic', 'Shadow', 'Neon', 'Velvet', 'Lunar', 'Cyber', 'Prism', 'Radiant'];
const NOUNS = ['Phoenix', 'Moon', 'Coder', 'Voyager', 'Falcon', 'Scholar', 'Orion', 'Spark', 'Knight', 'Comet', 'Raven', 'Pulse', 'Drifter'];

const getRandomHandle = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 89);
  return `${adj}${noun}${num}`;
};

const Register = () => {
  const [email, setEmail] = useState('');
  const [anonymousName, setAnonymousName] = useState(getRandomHandle());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleGenerateNewName = () => {
    setAnonymousName(getRandomHandle());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        confirmPassword,
        anonymousName: anonymousName.trim()
      });
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 text-brand-400 mb-3 shadow-glow">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-300 via-indigo-200 to-white bg-clip-text text-transparent">
            Join CampusSync
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create your private anonymous identity
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-6 sm:p-8 shadow-glass backdrop-blur-md">
          {formError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@mits.ac.in"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Used strictly for secure auth & recovery. Never shown publicly.
              </p>
            </div>

            {/* Anonymous Handle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Public Anonymous Handle
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewName}
                  className="inline-flex items-center text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Randomize</span>
                </button>
              </div>
              <input
                type="text"
                value={anonymousName}
                onChange={(e) => setAnonymousName(e.target.value)}
                placeholder="e.g. BluePhoenix42"
                required
                className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 font-mono text-brand-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                This is how other students will identify your public profile.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password (min 8 chars)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-semibold rounded-xl shadow-lg shadow-brand-600/30 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Create Anonymous Profile</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-dark-border/60 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 font-medium hover:text-brand-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center mt-6 text-xs text-slate-500 space-y-1">
          <p>🛡️ Anonymous to other users ≠ Anonymous to backend moderation.</p>
          <p>Independent student project. Not affiliated with any college.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
