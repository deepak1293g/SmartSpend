import React from 'react';
import { Transaction, CurrencyCode, CURRENCY_CONFIG } from '../types';
import GlassCard from './GlassCard';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface VisualizationProps {
  transactions: Transaction[];
  currency: CurrencyCode;
}

const Visualization: React.FC<VisualizationProps> = ({ transactions, currency }) => {
  const config = CURRENCY_CONFIG[currency];
  const [daysRange, setDaysRange] = React.useState<5 | 'forecast'>('forecast');

  const expenseData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += (t.amount * config.rate);
      } else {
        acc.push({ name: t.category, value: (t.amount * config.rate) });
      }
      return acc;
    }, []);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

  // Dynamic Range: either Forecast (5 days) or Last 5 Days
  const rangeLength = 5;
  const dynamicData = Array.from({ length: rangeLength }, (_, i) => {
    const d = new Date();
    if (daysRange === 'forecast') {
      d.setDate(d.getDate() - 2 + i); // Forecast: Start from 2 days before today
    } else {
      d.setDate(d.getDate() - 4 + i); // Last 5 Days: Start from 4 days ago
    }

    const dateStr = d.toISOString().split('T')[0];
    const income = transactions
      .filter(t => t.date === dateStr && t.type === 'income')
      .reduce((sum, t) => sum + (t.amount * config.rate), 0);

    const expense = transactions
      .filter(t => t.date === dateStr && t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount * config.rate), 0);

    return {
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      date: dateStr,
      income,
      expense,
      isToday: (daysRange === 'forecast' && i === 2) || (daysRange === 5 && i === 4)
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <GlassCard title={`Distribution (${config.symbol})`} className="flex flex-col">
        {/* ... pie chart remains same ... */}
        <div className="w-full grow h-[250px] md:h-[300px]">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${config.symbol}${value.toLocaleString()}`, 'Spent']}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-medium italic text-sm">
              No outbound data detected
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard title={`Dynamics (${config.symbol})`} className="flex flex-col">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 bg-slate-950/50 p-1 rounded-xl border border-white/5 w-fit mb-4">
            {[
              { id: 'forecast', label: 'Forecast' },
              { id: 5, label: 'Last 5 Days' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setDaysRange(range.id as any)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${daysRange === range.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="w-full grow h-[300px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicData} margin={{ top: 10, right: 30, left: 30, bottom: 15 }}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  stroke="#475569"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  height={20}
                  interval={0}
                  tick={({ x, y, payload }) => {
                    const dayData = dynamicData.find(d => d.label === payload.value);
                    const isToday = dayData?.isToday;
                    return (
                      <text
                        x={x} y={Number(y) + 12}
                        fill={isToday ? "#6366f1" : "#475569"}
                        fontSize={9}
                        fontWeight={isToday ? "bold" : "normal"}
                        textAnchor="middle"
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />
                <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${config.symbol}${value.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '10px'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  name="In" type="monotone" dataKey="income"
                  stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInbound)"
                  dot={{ r: 4.5, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Area
                  name="Out" type="monotone" dataKey="expense"
                  stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorOutbound)"
                  dot={{ r: 4.5, fill: '#f43f5e', strokeWidth: 2, stroke: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Visualization;