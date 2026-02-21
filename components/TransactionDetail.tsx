import React, { useState } from 'react';
import { Transaction, CurrencyCode, CURRENCY_CONFIG } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
  currency: CurrencyCode;
  onEdit?: (t: Transaction) => void;
  onDelete?: (id: string) => void;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onClose, currency, onEdit, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const config = CURRENCY_CONFIG[currency];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (createdAt: string) => {
    return new Date(createdAt).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const toTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const isIncome = transaction.type === 'income';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg overflow-hidden"
      >
        <div className={`absolute -inset-1 bg-gradient-to-br ${isIncome ? 'from-emerald-500/30 to-transparent' : 'from-rose-500/30 to-transparent'} blur-3xl opacity-50`}></div>

        <GlassCard className="p-0 border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10 w-full">
          <div className="p-5 md:p-8">
            <div className="flex justify-between items-start mb-6 md:mb-8">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] flex items-center justify-center shadow-2xl ${isIncome ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'}`}>
                {isIncome ? (
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                ) : (
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                )}
              </div>
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(transaction);
                    }}
                    className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-colors text-slate-400 hover:text-indigo-400"
                    title="Edit Transaction"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-colors text-slate-400 hover:text-rose-400"
                    title="Delete Transaction"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-lg md:rounded-xl transition-colors text-slate-400 hover:text-white"
                  title="Close Context"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="mb-6 md:mb-10">
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1 md:mb-2">Operation Value</p>
              <h1 className={`text-4xl md:text-6xl font-black italic tracking-tighter ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isIncome ? '+' : '-'}{config.symbol}{(transaction.amount * config.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                  <p className={`text-[10px] md:text-xs font-bold uppercase italic flex items-center gap-1.5 md:gap-2 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse ${isIncome ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {isIncome ? 'Settled Inbound' : 'Authorized Outbound'}
                  </p>
                </div>
                <div className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Classification</p>
                  <p className="text-[10px] md:text-xs font-bold uppercase italic text-white truncate">{transaction.category}</p>
                </div>
              </div>

              <div className="p-4 md:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Description</p>
                <p className="text-xs md:text-sm font-bold text-white leading-relaxed line-clamp-2">{toTitleCase(transaction.description)}</p>
              </div>

              <div className="p-4 md:p-5 bg-slate-950/50 rounded-xl md:rounded-2xl border border-white/5 space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Calendar Date</p>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-200">{formatDate(transaction.date)}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Precision Time</p>
                  </div>
                  <p className="text-[10px] md:text-xs font-bold text-slate-200 font-mono tracking-tighter">{formatTime(transaction.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-10 pt-4 md:pt-8 border-t border-white/5 flex items-center justify-end">
              <button onClick={onClose} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Return to Dashboard</button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl shadow-rose-500/20"
            >
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">Purge Entry?</h3>
              <p className="text-slate-400 text-[10px] md:text-xs text-center mb-8 uppercase tracking-widest font-bold">
                This transaction record will be permanently wiped from the secure ledger. This action cannot be undone.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (onDelete) onDelete(transaction.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full px-6 py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-rose-500/20"
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs transition-colors"
                >
                  Cancel Action
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionDetail;