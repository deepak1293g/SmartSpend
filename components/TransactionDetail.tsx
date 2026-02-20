import React from 'react';
import { Transaction, CurrencyCode, CURRENCY_CONFIG } from '../types';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

interface TransactionDetailProps {
  transaction: Transaction;
  onClose: () => void;
  currency: CurrencyCode;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction, onClose, currency }) => {
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

        <GlassCard className="p-0 border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative z-10">
          <div className="p-8">
            <div className="flex justify-between items-start mb-8">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl ${isIncome ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border border-rose-500/20'}`}>
                {isIncome ? (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">Operation Value</p>
              <h1 className={`text-6xl font-black italic tracking-tighter ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isIncome ? '+' : '-'}{config.symbol}{(transaction.amount * config.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h1>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                  <p className={`text-xs font-bold uppercase italic flex items-center gap-2 ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isIncome ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    {isIncome ? 'Settled Inbound' : 'Authorized Outbound'}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Classification</p>
                  <p className="text-xs font-bold uppercase italic text-white">{transaction.category}</p>
                </div>
              </div>

              <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Description</p>
                <p className="text-sm font-bold text-white leading-relaxed">{toTitleCase(transaction.description)}</p>
              </div>

              <div className="p-5 bg-slate-950/50 rounded-2xl border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calendar Date</p>
                  </div>
                  <p className="text-xs font-bold text-slate-200">{formatDate(transaction.date)}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Precision Time</p>
                  </div>
                  <p className="text-xs font-bold text-slate-200 font-mono tracking-tighter">{formatTime(transaction.created_at)}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-end">
              <button onClick={onClose} className="text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Return to Dashboard</button>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default TransactionDetail;