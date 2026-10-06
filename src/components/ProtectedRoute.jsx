import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, profile, updateLocalProfile, loading } = useAuth();
  const location = useLocation();

  const [adminPassword, setAdminPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-base text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route requires Admin and current user is NOT admin yet -> Render inline Admin Password Portal
  if (requireAdmin && user?.role !== 'ADMIN') {
    const handleAdminAuth = async (e) => {
      e.preventDefault();
      setAuthError('');
      setIsVerifying(true);

      try {
        const res = await api.post('/auth/make-admin', {
          email: user.email,
          adminSecret: adminPassword,
        });

        if (res.success) {
          updateLocalProfile(profile, { ...user, role: 'ADMIN' });
        }
      } catch (err) {
        setAuthError(err.message || 'Invalid Admin Password. Access denied.');
      } finally {
        setIsVerifying(false);
      }
    };

    return (
      <div className="min-h-screen bg-dark-base flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-card border border-dark-border/80 rounded-3xl p-6 sm:p-8 shadow-glass text-center space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Admin Security Access</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Please enter the administrator password to access moderation controls.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left">
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter Admin Password..."
                required
                className="w-full px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <a
                href="/home"
                className="flex-1 py-3 px-4 bg-dark-surface/60 hover:bg-dark-surface text-slate-300 font-semibold rounded-xl text-xs flex items-center justify-center border border-dark-border"
              >
                Return Home
              </a>

              <button
                type="submit"
                disabled={isVerifying || !adminPassword}
                className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center shadow-glow disabled:opacity-50"
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Authenticate</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
