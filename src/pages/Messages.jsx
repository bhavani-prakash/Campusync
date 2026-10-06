import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';
import Avatar from '../components/Avatar';
import ChatMessage from '../components/ChatMessage';
import IcebreakerModal from '../components/IcebreakerModal';
import EmptyState from '../components/EmptyState';
import { Send, Sparkles, MessageSquare, ArrowLeft, Circle, CheckCheck, Trash2, ShieldAlert } from 'lucide-react';

const Messages = () => {
  const { user, profile } = useAuth();
  const { socket, isUserOnline } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);

  // Icebreaker Modal
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations');
      if (res.success) {
        setConversations(res.data || []);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (activeConversation) {
      setLoadingMessages(true);
      setPartnerTyping(false);

      api.get(`/conversations/${activeConversation._id}/messages`)
        .then((res) => {
          if (res.success) {
            setMessages(res.data || []);
          }
        })
        .catch((err) => console.error('Fetch messages error:', err))
        .finally(() => setLoadingMessages(false));

      // Join socket room
      if (socket) {
        socket.emit('join_conversation', { conversationId: activeConversation._id });
        socket.emit('mark_read', { conversationId: activeConversation._id });
      }
    }
  }, [activeConversation?._id, socket]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMsg) => {
      if (activeConversation && newMsg.conversationId === activeConversation._id) {
        setMessages((prev) => [...prev, newMsg]);
        socket.emit('mark_read', { conversationId: activeConversation._id });
      }
      fetchConversations();
    };

    const handleUserTyping = ({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setPartnerTyping(true);
      }
    };

    const handleUserStopTyping = ({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setPartnerTyping(false);
      }
    };

    const handleMessagesRead = ({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setMessages((prev) =>
          prev.map((m) => ({ ...m, isRead: true }))
        );
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, activeConversation?._id]);

  // Typing event emission
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);

    if (socket && activeConversation) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('typing', { conversationId: activeConversation._id });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit('stop_typing', { conversationId: activeConversation._id });
      }, 1500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation || !socket) return;

    const content = inputMessage.trim();
    const receiverId = activeConversation.partner.userId;

    socket.emit('send_message', {
      conversationId: activeConversation._id,
      receiverId,
      content,
    });

    setInputMessage('');
    setIsTyping(false);
    socket.emit('stop_typing', { conversationId: activeConversation._id });
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await api.delete(`/messages/${messageId}`);
      if (res.success) {
        setMessages((prev) =>
          prev.map((m) => (m._id === messageId ? { ...m, content: 'This message was deleted', isDeleted: true } : m))
        );
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  return (
    <div className="bg-dark-card border border-dark-border/80 rounded-3xl shadow-glass overflow-hidden h-[calc(100vh-140px)] flex">
      {/* SIDEBAR: Conversations List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-dark-border/80 flex flex-col ${
          activeConversation ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-dark-border/60">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-brand-400" />
            <span>Messages</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Real-time chats with verified matches</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingConversations ? (
            <div className="p-4 text-center text-slate-400 text-xs">Loading conversations...</div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => {
              const isSelected = activeConversation?._id === conv._id;
              const online = isUserOnline(conv.partner.userId);

              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full p-3 rounded-2xl flex items-center space-x-3 transition-all text-left ${
                    isSelected
                      ? 'bg-brand-600/20 border border-brand-500/40'
                      : 'hover:bg-dark-surface/50 border border-transparent'
                  }`}
                >
                  <div className="relative">
                    <Avatar avatarId={conv.partner.avatar} size="md" />
                    {online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-dark-card rounded-full"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-100 font-mono truncate">
                        {conv.partner.anonymousName}
                      </span>
                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-slate-500">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-400 truncate pr-2">
                        {conv.lastMessage || 'Connected! Say hi 👋'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-600 text-white text-[10px] font-bold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs space-y-2">
              <p>No active conversations yet.</p>
              <p className="text-slate-500 text-[11px]">Match with students in Discovery to start chatting!</p>
            </div>
          )}
        </div>
      </div>

      {/* MAIN THREAD: Active Conversation */}
      <div
        className={`flex-1 flex flex-col bg-dark-base/40 ${
          activeConversation ? 'flex' : 'hidden md:flex'
        }`}
      >
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-dark-border/80 flex items-center justify-between bg-dark-card/60">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveConversation(null)}
                  className="md:hidden p-1.5 rounded-xl text-slate-400 hover:text-white bg-dark-surface/60"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                  <Avatar avatarId={activeConversation.partner.avatar} size="md" />
                  {isUserOnline(activeConversation.partner.userId) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-dark-card rounded-full"></span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base font-mono text-white">
                    {activeConversation.partner.anonymousName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isUserOnline(activeConversation.partner.userId) ? (
                      <span className="text-emerald-400 font-semibold">Online now</span>
                    ) : (
                      <span>{activeConversation.partner.department}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Icebreakers CTA */}
              <button
                onClick={() => setShowIcebreaker(true)}
                className="py-2 px-3 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Icebreakers</span>
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
              {loadingMessages ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading messages...</span>
                </div>
              ) : messages.length > 0 ? (
                messages.map((m) => (
                  <ChatMessage
                    key={m._id}
                    message={m}
                    isOwn={m.senderId.toString() === user.id.toString()}
                    onDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-brand-600/20 text-brand-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Start the conversation!</h4>
                  <p className="text-slate-400 text-xs max-w-xs mx-auto">
                    You matched with <span className="font-mono text-brand-300 font-bold">{activeConversation.partner.anonymousName}</span>. Send a friendly message or use icebreaker prompts!
                  </p>
                </div>
              )}

              {/* Typing indicator */}
              {partnerTyping && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs italic pl-2 py-1">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce delay-200"></span>
                  <span>{activeConversation.partner.anonymousName} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-dark-border/80 bg-dark-card/80">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder={`Message ${activeConversation.partner.anonymousName}...`}
                  maxLength={2000}
                  className="flex-1 px-4 py-3 bg-dark-surface/60 border border-dark-border rounded-2xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="py-3 px-5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-2xl shadow-glow transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Icebreaker Modal */}
            <IcebreakerModal
              isOpen={showIcebreaker}
              onClose={() => setShowIcebreaker(false)}
              targetUserId={activeConversation.partner.userId}
              partnerName={activeConversation.partner.anonymousName}
              onSelectIcebreaker={(question) => setInputMessage(question)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <EmptyState
              icon={MessageSquare}
              title="Select a Conversation"
              description="Choose a matched student from the sidebar to open real-time chat."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
