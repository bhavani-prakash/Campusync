import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';
import { ShieldCheck, Compass, Heart, MessageSquare, Bell, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/home', icon: ShieldCheck },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 bg-dark-base/80 backdrop-blur-md border-b border-dark-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/40 text-brand-400 flex items-center justify-center shadow-glow">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-300 via-indigo-200 to-white bg-clip-text text-transparent">
            CampusSync
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-glow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-dark-surface/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  isActive
                    ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30 shadow-glow'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                }`
              }
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-dark-card border border-dark-border/80 hover:border-brand-500/40 transition-all group"
          >
            <Avatar avatarId={profile?.avatar} size="sm" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-200 group-hover:text-brand-300 transition-colors font-mono">
              {profile?.anonymousName || 'Profile'}
            </span>
          </Link>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
