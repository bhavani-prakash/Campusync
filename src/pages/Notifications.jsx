import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmptyState from '../components/EmptyState';
import { Bell, Heart, MessageSquare, Sparkles, AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Mark all read error:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MATCH':
        return <Heart className="w-5 h-5 text-rose-400 fill-current" />;
      case 'MESSAGE':
        return <MessageSquare className="w-5 h-5 text-brand-400" />;
      case 'LIKE':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'REPORT_STATUS':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SYSTEM_WARNING':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-brand-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-2">
            <Bell className="w-7 h-7 text-brand-400" />
            <span>Notifications</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            CampusSync activity alerts and community updates
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="py-2 px-3.5 rounded-xl bg-dark-card border border-dark-border text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Main List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-dark-card rounded-2xl border border-dark-border animate-pulse"></div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item._id}
              onClick={() => !item.isRead && handleMarkAsRead(item._id)}
              className={`p-4 rounded-2xl border transition-all flex items-start space-x-4 cursor-pointer ${
                !item.isRead
                  ? 'bg-brand-600/10 border-brand-500/30 shadow-glow'
                  : 'bg-dark-card border-dark-border/80 hover:border-slate-600'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-dark-surface/60 shrink-0">
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center space-x-2">
                    <span>{item.title}</span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-500 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-slate-300 text-xs mt-1 leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="When you get mutual matches, messages, or community updates, they will show up here!"
        />
      )}
    </div>
  );
};

export default Notifications;
