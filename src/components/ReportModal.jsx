import React, { useState } from 'react';
import api from '../services/api';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

const REPORT_REASONS = [
  'Harassment',
  'Spam',
  'Impersonation',
  'Bullying',
  'Threatening behavior',
  'Inappropriate content',
  'Other',
];

const ReportModal = ({ isOpen, onClose, targetUserId, partnerName }) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.post('/reports', {
        reportedUserId: targetUserId,
        reason,
        description,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-dark-card border border-dark-border rounded-3xl p-6 max-w-md w-full shadow-glass relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-dark-surface/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Report Student</h3>
            <p className="text-slate-400 text-xs">Flagging <span className="font-mono text-brand-300 font-bold">{partnerName}</span> to moderation</p>
          </div>
        </div>

        {success ? (
          <div className="py-8 text-center text-emerald-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <p className="text-sm font-semibold">Report submitted to moderation team</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r} className="bg-dark-card text-slate-200">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Additional Context (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Describe what occurred to help our moderation team investigate..."
                className="w-full px-3.5 py-2.5 bg-dark-surface/60 border border-dark-border rounded-xl text-slate-100 text-xs focus:outline-none focus:border-brand-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-dark-surface/60 hover:bg-dark-surface border border-dark-border text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-xs transition-all shadow-glow flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
