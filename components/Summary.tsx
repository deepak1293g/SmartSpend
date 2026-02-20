
import React from 'react';
import { Transaction, CURRENCY_CONFIG, CurrencyCode } from '../types';
import GlassCard from './GlassCard';
import AnimatedNumber from './AnimatedNumber';
import { motion } from 'framer-motion';

interface SummaryProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

const Summary: React.FC<SummaryProps> = ({ transactions, currency }) => {
  const config = CURRENCY_CONFIG[currency];

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + (t.amount * config.rate), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount * config.rate), 0);

  const balance = totalIncome - totalExpense;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      <motion.div variants={item}>
        <GlassCard className="border-l-4 border-l-indigo-500 group p-4 md:p-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider font-bold">Total Balance</p>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <AnimatedNumber value={balance} prefix={config.symbol} className="text-2xl md:text-3xl font-black text-white" />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item}>
        <GlassCard className="border-l-4 border-l-emerald-500 group p-4 md:p-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider font-bold">Total Income</p>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <AnimatedNumber value={totalIncome} prefix={config.symbol} className="text-2xl md:text-3xl font-black text-emerald-400" />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div variants={item}>
        <GlassCard className="border-l-4 border-l-rose-500 group p-4 md:p-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            <p className="text-xs md:text-sm text-slate-400 uppercase tracking-wider font-bold">Total Expenses</p>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <AnimatedNumber value={totalExpense} prefix={config.symbol} className="text-2xl md:text-3xl font-black text-rose-400" />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default Summary;
