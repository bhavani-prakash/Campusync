import React from 'react';
import { Check, CheckCheck, Trash2 } from 'lucide-react';

const ChatMessage = ({ message, isOwn, onDelete }) => {
  if (!message) return null;

  const { content, isRead, isDeleted, createdAt, _id } = message;

  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex flex-col mb-3 group ${isOwn ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-[75%] sm:max-w-[65%] px-4 py-3 rounded-2xl relative text-xs sm:text-sm leading-relaxed ${
          isOwn
            ? 'bg-brand-600 text-white rounded-br-none shadow-glow'
            : 'bg-dark-surface/80 border border-dark-border text-slate-100 rounded-bl-none'
        } ${isDeleted ? 'opacity-60 italic' : ''}`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>

        <div
          className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${
            isOwn ? 'text-brand-200' : 'text-slate-400'
          }`}
        >
          <span>{formattedTime}</span>
          {isOwn && !isDeleted && (
            <span>
              {isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-emerald-300 inline" />
              ) : (
                <Check className="w-3.5 h-3.5 text-brand-200 inline" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Delete button for own non-deleted messages */}
      {isOwn && !isDeleted && onDelete && (
        <button
          onClick={() => onDelete(_id)}
          className="opacity-0 group-hover:opacity-100 text-[10px] text-rose-400 hover:text-rose-300 mt-1 flex items-center space-x-1 transition-opacity pr-1"
          title="Delete message"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
};

export default ChatMessage;
