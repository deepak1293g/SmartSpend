
import React, { useState } from 'react';
import { Transaction } from '../types';
import { analyzeExpenses } from '../services/geminiService';
import GlassCard from './GlassCard';

interface AIInsightsProps {
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeExpenses(transactions);
    setInsight(result);
    setLoading(false);
  };

  return (
    <GlassCard className="mt-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            Gemini AI Advisor
          </h3>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || transactions.length === 0}
          className="text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-medium transition-all"
        >
          {loading ? 'Analyzing...' : 'Refresh Insights'}
        </button>
      </div>

      <div className="min-h-[60px] flex items-center justify-center">
        {loading ? (
          <div className="text-indigo-300 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
            Processing financial data...
          </div>
        ) : insight ? (
          <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-line">
            {insight}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">Unlock personalized financial wisdom based on your spending patterns.</p>
            <button
              onClick={handleAnalyze}
              disabled={transactions.length === 0}
              className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/30 text-sm disabled:opacity-50"
            >
              Generate First Insight
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default AIInsights;
