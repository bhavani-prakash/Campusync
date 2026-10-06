import React from 'react';
import { Compass, RefreshCw } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Compass,
  title = 'No profiles found',
  description = 'Keep exploring — your next connection may be waiting.',
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-dark-card border border-dark-border/80 rounded-2xl shadow-glass space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-1">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{description}</p>

      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 py-2.5 px-5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-glow"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionText || 'Reset Filters'}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
