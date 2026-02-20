import React, { useState, useMemo } from 'react';
import { Transaction, CurrencyCode, CURRENCY_CONFIG, UserProfile } from '../types';
import GlassCard from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TransactionListProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  user?: UserProfile | null;
  onSelectTransaction?: (tx: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, currency, user, onSelectTransaction }) => {
  const config = CURRENCY_CONFIG[currency];
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showEmptyExportModal, setShowEmptyExportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = useMemo(() => {
    const startYear = 2023;
    const currentYear = new Date().getFullYear();
    const arr = [];
    for (let y = currentYear; y >= startYear; y--) arr.push(y);
    return arr;
  }, []);

  const groupedTransactions = useMemo(() => {
    const filtered = transactions.filter(t => {
      const d = new Date(t.date);
      const matchesDate = d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesSearch;
    });

    // Group by date
    const groups: Record<string, Transaction[]> = {};
    filtered.forEach(t => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });

    // Sort dates descending
    return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map(date => ({
      date,
      items: groups[date]
    }));
  }, [transactions, selectedMonth, selectedYear, searchTerm]);

  const handleExportClick = () => {
    const toExport = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    if (toExport.length === 0) {
      setShowEmptyExportModal(true);
    } else {
      setShowExportModal(true);
    }
  };

  const executeExportPDF = async () => {
    const toExport = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    setShowExportModal(false);
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const bgColor: [number, number, number] = [2, 6, 23];
      const indigoMain: [number, number, number] = [99, 102, 241];
      const slate400: [number, number, number] = [148, 163, 184];
      const emeraldGreen: [number, number, number] = [52, 211, 153];
      const rosePink: [number, number, number] = [251, 113, 133];

      const formatAmount = (num: number) => num.toLocaleString('en-IN', { minimumFractionDigits: 2 });

      const totalSpent = toExport.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      const totalReceived = toExport.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(0, 0, 210, 297, 'F');

      doc.setFillColor(indigoMain[0], indigoMain[1], indigoMain[2]);
      doc.roundedRect(14, 14, 10, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('SmartSpend', 28, 22);

      if (user) {
        doc.setFontSize(7);
        doc.setTextColor(slate400[0], slate400[1], slate400[2]);
        doc.text('ACCOUNT HOLDER', 196, 17, { align: 'right' });
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text((user.name || user.email.split('@')[0]).toUpperCase(), 196, 22, { align: 'right' });

        if (user.phone) {
          doc.setTextColor(slate400[0], slate400[1], slate400[2]);
          doc.setFontSize(7);
          doc.text(user.phone, 196, 26, { align: 'right' });
        }
      }

      const boxW = 58;
      const boxH = 32;
      const boxY = 32;

      const drawStatBox = (x: number, label: string, amount: string, color: [number, number, number], sub: string) => {
        const cX = x + (boxW / 2);
        doc.setFillColor(15, 23, 42);
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, boxY, boxW, boxH, 3, 3, 'FD');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(label.toUpperCase(), cX, boxY + 10, { align: 'center' });
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(12);
        doc.text(amount, cX, boxY + 20, { align: 'center' });
        doc.setTextColor(slate400[0], slate400[1], slate400[2]);
        doc.setFontSize(6);
        doc.text(sub.toUpperCase(), cX, boxY + 26, { align: 'center' });
      };

      drawStatBox(14, 'Statement Period', `${months[selectedMonth]} ${selectedYear}`, [255, 255, 255], 'FULL MONTH REPORT');
      drawStatBox(14 + boxW + 4, 'Total Outflow', `- Rs. ${formatAmount(totalSpent)}`, rosePink, `${toExport.filter(t => t.type === 'expense').length} Events`);
      drawStatBox(14 + (boxW + 4) * 2, 'Total Inflow', `+ Rs. ${formatAmount(totalReceived)}`, emeraldGreen, `${toExport.filter(t => t.type === 'income').length} Events`);

      autoTable(doc, {
        startY: boxY + boxH + 20,
        head: [['TIMESTAMP', 'DESCRIPTION', 'TAGS', 'AMOUNT (INR)']],
        body: toExport.map(t => {
          const dbTime = new Date(t.created_at);
          return [
            `${dbTime.getDate()} ${months[dbTime.getMonth()].substring(0, 3)}\n${dbTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`,
            t.description.toUpperCase(),
            `# ${t.category.toUpperCase()}`,
            `${t.type === 'income' ? '+ ' : '- '}Rs. ${formatAmount(t.amount * config.rate)}`
          ];
        }),
        theme: 'plain',
        headStyles: { fillColor: indigoMain, textColor: [255, 255, 255], fontSize: 8.5 },
        bodyStyles: { fillColor: bgColor, textColor: [248, 250, 252], fontSize: 7.5 },
        columnStyles: { 3: { halign: 'right', fontStyle: 'bold' } },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 3) {
            data.cell.styles.textColor = data.cell.text[0].includes('+') ? emeraldGreen : rosePink;
          }
        }
      });

      doc.save(`SmartSpend_${months[selectedMonth]}_${selectedYear}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Dining':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-8h14V7H7v2zM3 21h18v-2H3v2zM3 5h18V3H3v2z" />
          </svg>
        );
      case 'Shopping':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'Housing':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'Entertainment':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        );
      case 'Transportation':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.312-8.438L12 8m0 0l-.312-.438M12 8V7m-4.788 1.116L12 8m0 0l4.788-1.116" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
          >
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-slate-900/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-10 pr-10 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
          />
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          onClick={handleExportClick}
          disabled={isExporting}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-2 text-xs font-black uppercase tracking-widest italic transition-all disabled:opacity-50"
        >
          {isExporting ? 'Generating...' : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">
        {groupedTransactions.length === 0 ? (
          <GlassCard className="p-12 text-center border-white/5">
            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
              <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-400">Empty Ledger</h3>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2">No transaction data detected in this sector</p>
          </GlassCard>
        ) : (
          groupedTransactions.map(group => (
            <div key={group.date} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">
                  {new Date(group.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {group.items.map(t => (
                  <motion.div
                    key={t.id}
                    layoutId={t.id}
                    onClick={() => onSelectTransaction?.(t)}
                    whileHover={{ x: 4 }}
                    className="group cursor-pointer"
                  >
                    <GlassCard className="p-3 md:p-4 border-white/5 group-hover:border-indigo-500/30 transition-all bg-slate-900/40">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                            <div className="scale-75 md:scale-100">
                              {getCategoryIcon(t.category)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-xs md:text-base text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight italic line-clamp-1">
                              {t.description}
                            </h4>
                            <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                              {t.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right pl-2">
                          <div className={`text-sm md:text-lg font-black italic tracking-tighter ${t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                            }`}>
                            {t.type === 'income' ? '+' : '-'} {config.symbol}{t.amount.toLocaleString(config.locale, { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-600">
                            {new Date(t.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Empty Export Modal */}
      <AnimatePresence>
        {showEmptyExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">No Records Found</h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                There are no financial transactions recorded for {months[selectedMonth]} {selectedYear}. Cannot generate an empty document.
              </p>

              <button
                onClick={() => setShowEmptyExportModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Confirmation Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-indigo-500/20"
            >
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">Generate PDF Report</h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Compile and securely download the financial report for {months[selectedMonth]} {selectedYear}.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
                >
                  Cancel Action
                </button>
                <button
                  onClick={executeExportPDF}
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20 flex justify-center items-center"
                >
                  Initialize Export
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TransactionList;