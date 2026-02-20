
import React, { useState } from 'react';
import { CATEGORIES, TransactionType } from '../types';
import GlassCard from './GlassCard';
import { motion } from 'framer-motion';

interface TransactionFormProps {
  onAdd: (data: any) => Promise<void>;
  loading: boolean;
  onClose?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, loading, onClose }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    await onAdd({
      amount: parseFloat(amount),
      type,
      category,
      description,
      date
    });

    setAmount('');
    setDescription('');
    if (onClose) onClose();
  };

  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-2 text-slate-500 hover:text-white transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">New Transaction</h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Record manual entry</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'expense' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            Outbound
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === 'income' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            Inbound
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1 transition-colors">Amount (₹)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold text-lg"
              placeholder="0.00"
              required
            />
          </div>



          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Classification</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 px-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-semibold placeholder:text-slate-600"
              placeholder="Details of movement..."
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-widest italic"
        >
          {loading ? 'Processing...' : 'Deploy Transaction'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
