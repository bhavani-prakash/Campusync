import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Profile from './pages/Profile';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import PrivacySettings from './pages/PrivacySettings';
import AdminDashboard from './pages/AdminDashboard';
import { ShieldCheck, Compass, Heart, MessageSquare } from 'lucide-react';

function HomeDashboard() {
  const { user, profile } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-brand-900/60 via-dark-card to-dark-card border border-brand-500/20 rounded-2xl p-6 sm:p-8 shadow-glass relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CampusSync Student Community</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-brand-300 font-mono">{profile?.anonymousName}</span>!
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Discover verified students across departments, find study partners, gaming mates, and meaningful campus connections anonymously.
            </p>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/discover"
            className="p-5 rounded-2xl bg-dark-card border border-dark-border/80 hover:border-brand-500/40 shadow-glass transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Discover Students</h3>
            <p className="text-slate-400 text-xs mt-1">Browse anonymous student cards based on shared interests & department.</p>
          </a>

          <a
            href="/matches"
            className="p-5 rounded-2xl bg-dark-card border border-dark-border/80 hover:border-rose-500/40 shadow-glass transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Your Matches</h3>
            <p className="text-slate-400 text-xs mt-1">View mutual connections, mystery matches, and secret crush statuses.</p>
          </a>

          <a
            href="/messages"
            className="p-5 rounded-2xl bg-dark-card border border-dark-border/80 hover:border-emerald-500/40 shadow-glass transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Chat</h3>
            <p className="text-slate-400 text-xs mt-1">Chat securely with your verified mutual matches with full privacy.</p>
          </a>
        </div>
      </div>
    </AppLayout>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Onboarding route */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Application Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            {user && !user.isOnboarded ? <Navigate to="/onboarding" replace /> : <HomeDashboard />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/discover"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Discover />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/matches"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Matches />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Messages />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Notifications />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/privacy"
        element={
          <ProtectedRoute>
            <AppLayout>
              <PrivacySettings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppRoutes />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
