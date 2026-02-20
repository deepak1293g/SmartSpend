import React, { useMemo } from 'react';
import { Transaction, CurrencyCode, CURRENCY_CONFIG } from '../types';
import GlassCard from './GlassCard';
import AnimatedNumber from './AnimatedNumber';
import { motion } from 'framer-motion';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
  PieChart,
  Pie
} from 'recharts';

interface AnalyticsPageProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ transactions, currency }) => {
  const config = CURRENCY_CONFIG[currency];

  const BUDGET_LIMITS: Record<string, number> = {
    'Food & Dining': 5000,
    'Shopping': 10000,
    'Housing': 20000,
    'Transportation': 3000,
    'Entertainment': 5000,
    'Health': 5000,
    'Investment': 10000,
    'Other': 2000
  };

  const stats = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    const totalExp = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalInc = income.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalInc - totalExp;

    // Daily breakdown centering around today (starts 2 days ago)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 2 + i); // Start from 2 days before today
      const dateStr = d.toISOString().split('T')[0];
      const dayInc = income.filter(t => t.date === dateStr).reduce((s, t) => s + t.amount, 0);
      const dayExp = expenses.filter(t => t.date === dateStr).reduce((s, t) => s + t.amount, 0);
      return {
        label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        income: dayInc * config.rate,
        expense: dayExp * config.rate,
        net: (dayInc - dayExp) * config.rate
      };
    });

    const categoryStats = Object.keys(BUDGET_LIMITS).map(cat => {
      const spent = expenses.filter(t => t.category === cat).reduce((s, t) => s + t.amount, 0);
      const limit = BUDGET_LIMITS[cat];
      return {
        full: cat,
        spent: spent * config.rate,
        limit: limit * config.rate,
        percent: Math.min((spent / limit) * 100, 100),
        status: spent > limit ? 'CRITICAL' : spent > limit * 0.8 ? 'WARNING' : 'STABLE'
      };
    }).filter(item => item.spent > 0).sort((a, b) => b.spent - a.spent);

    return { totalExp, totalInc, balance, last7Days, categoryStats };
  }, [transactions, config.rate]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-32 px-1"
    >
      {/* Hero Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Liquidity Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard className="h-full relative overflow-hidden bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/30">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 flex flex-col h-full justify-center py-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Operational Liquidity</p>
              </div>
              <AnimatedNumber
                value={stats.balance * config.rate}
                prefix={config.symbol}
                className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-white"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Secondary Metric Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <GlassCard className="border-l-4 border-l-emerald-500 bg-emerald-500/5 flex flex-col justify-center p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Inflow</p>
            </div>
            <AnimatedNumber
              value={stats.totalInc * config.rate}
              prefix={config.symbol}
              className="text-2xl md:text-3xl font-black text-emerald-400"
            />
          </GlassCard>
          <GlassCard className="border-l-4 border-l-rose-500 bg-rose-500/5 flex flex-col justify-center p-4 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Outflow</p>
            </div>
            <AnimatedNumber
              value={stats.totalExp * config.rate}
              prefix={config.symbol}
              className="text-2xl md:text-3xl font-black text-rose-400"
            />
          </GlassCard>
        </motion.div>
      </div>

      {/* Mid Section - Cash Flow & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <GlassCard title="Financial Dynamics Ledger" className="h-full">
            <div className="h-[350px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={stats.last7Days}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                    itemStyle={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', color: '#fff' }}
                    labelStyle={{ fontSize: '10px', color: '#6366f1', marginBottom: '4px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="net" fill="url(#areaGrad)" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} />
                  <Bar dataKey="income" barSize={8} fill="#10b981" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="expense" barSize={8} fill="#f43f5e" radius={[10, 10, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard title="Budget Health Index" className="h-full">
            <div className="space-y-4 mt-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {stats.categoryStats.length > 0 ? stats.categoryStats.map((item) => (
                <div key={item.full} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors">{item.full}</h4>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-sm font-black text-white">{config.symbol}{item.spent.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-slate-600">/ {config.symbol}{item.limit.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      className={`h-full rounded-full ${item.percent > 90 ? 'bg-gradient-to-r from-rose-600 to-rose-400' :
                        item.percent > 75 ? 'bg-gradient-to-r from-amber-500 to-amber-300' :
                          'bg-gradient-to-r from-indigo-600 to-indigo-400'
                        }`}
                    />
                  </div>
                </div>
              )) : (
                <p className="text-center text-slate-500 italic py-10 text-sm">No categorical data to monitor.</p>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Bottom Distribution Row */}
      <div className="grid grid-cols-1 gap-8">
        <motion.div variants={itemVariants}>
          <GlassCard title="Categorical Concentration">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
              <div className="h-[300px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
                      </filter>
                    </defs>
                    <Pie
                      data={stats.categoryStats}
                      innerRadius={0}
                      outerRadius={115}
                      paddingAngle={6}
                      cornerRadius={8}
                      dataKey="spent"
                      nameKey="full"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth={2}
                    >
                      {stats.categoryStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'url(#pieShadow)' }} />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)', padding: '12px 20px' }}
                      itemStyle={{ color: '#fff', fontWeight: '900', fontSize: '14px', letterSpacing: '0.05em' }}
                      formatter={(value: number, name: string) => [`${config.symbol}${value.toLocaleString()}`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Spending List Breakdown */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-end mb-4 px-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Category Wise Breakdown</h4>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Aggregate</p>
                    <p className="text-lg leading-none font-black text-white italic tracking-tighter">{config.symbol}{(stats.totalExp * config.rate).toLocaleString()}</p>
                  </div>
                </div>
                {stats.categoryStats.map((item, index) => (
                  <div key={item.full} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">{item.full}</span>
                    </div>
                    <span className="text-xs font-black text-white italic">{config.symbol}{item.spent.toLocaleString()}</span>
                  </div>
                ))}
                {stats.categoryStats.length === 0 && (
                  <p className="text-slate-500 italic text-center text-xs py-10">No spending data logged.</p>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;