import React from 'react';
import { AVATARS } from '../utils/constants';

const Avatar = ({ avatarId, size = 'md', className = '' }) => {
  const avatarObj = AVATARS.find((a) => a.id === avatarId) || AVATARS[0];

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  }[size] || 'w-12 h-12 text-xl';

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${avatarObj.gradient} shadow-lg shrink-0 ${sizeClasses} ${className}`}
    >
      <span>{avatarObj.icon}</span>
    </div>
  );
};

export default Avatar;
