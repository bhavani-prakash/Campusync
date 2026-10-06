import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, Heart, MessageSquare, Bell, User } from 'lucide-react';

const BottomNav = () => {
  const items = [
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Matches', path: '/matches', icon: Heart },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    { label: 'Alerts', path: '/notifications', icon: Bell },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-card/90 backdrop-blur-lg border-t border-dark-border/80 px-2 py-2">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-brand-400 font-bold scale-105'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
