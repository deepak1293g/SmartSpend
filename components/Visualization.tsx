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

  // Calculate 5 days: 2 days before today, today, and 2 days after
  const dynamicData = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 2 + i); // Start from 2 days before today
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
      isToday: i === 2 // Mark today's column for reference
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <GlassCard title={`Distribution (${config.symbol})`} className="flex flex-col">
        <div className="w-full grow h-[250px] md:h-[300px]">
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
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
        <div className="w-full grow h-[300px] md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicData} margin={{ top: 10, right: 10, left: -25, bottom: 60 }}>
              <defs>
                <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="label" 
                stroke="#475569" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                height={60}
                tick={({ x, y, payload }) => {
                  const isToday = payload.value === dynamicData[2].label;
                  return (
                    <text x={x} y={Number(y) + 35} fill={isToday ? "#6366f1" : "#475569"} fontSize={10} fontWeight={isToday ? "bold" : "normal"} textAnchor="middle">
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
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              <Area 
                name="In" type="monotone" dataKey="income" 
                stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorInbound)" 
              />
              <Area 
                name="Out" type="monotone" dataKey="expense" 
                stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorOutbound)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};

export default Visualization;