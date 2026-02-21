import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Transaction, UserProfile, CurrencyCode } from './types';
import Summary from './components/Summary';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import TransactionDetail from './components/TransactionDetail';
import Visualization from './components/Visualization';
import GlassCard from './components/GlassCard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import AnalyticsPage from './components/AnalyticsPage';
import ContactPage from './components/ContactPage';
import MainLayout from './components/MainLayout';
import Dashboard from './components/Dashboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>('INR');

  const navigate = useNavigate();
  const location = useLocation();

  // Reset scroll to top when changing locations
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    const handleSetUser = (sessionUser: any) => {
      if (sessionUser) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email!,
          name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'User',
          phone: sessionUser.user_metadata?.phone || ''
        });
      } else {
        setUser(null);
      }
    };

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error && error.message !== 'Auth session missing!') {
          console.warn("Auth initialization notice:", error.message);
        }
        handleSetUser(session?.user);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Auth session missing!') {
          console.warn("Auth exception on load:", err);
        }
        handleSetUser(null);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSetUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Database error:", error);
      setError(error.message);
    } else {
      setTransactions(data || []);
      setError(null);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setToast({ message: "Sign Out successfully", type: 'success' });
  };

  const handleTransactionSubmit = async (txData: any, id?: string) => {
    setFormLoading(true);
    try {
      if (id) {
        const { data, error } = await supabase.from('expenses').update(txData).eq('id', id).select();
        if (error) throw error;

        if (!data || data.length === 0) {
          // Fallback: If UPDATE policy is missing in Supabase, we delete and re-insert the row
          if (editingTransaction) {
            const { error: delErr } = await supabase.from('expenses').delete().eq('id', id);
            if (delErr) throw new Error(`Delete fallback failed: ${delErr.message}`);

            const { error: insErr } = await supabase.from('expenses').insert([{
              ...editingTransaction, // preserve id, created_at, user_id, etc.
              ...txData
            }]);
            if (insErr) throw new Error(`Insert fallback failed: ${insErr.message}`);
          } else {
            throw new Error('Transaction was not updated. Permission denied.');
          }
        }

        setToast({ message: "Transaction updated.", type: 'success' });
      } else {
        const { error } = await supabase.from('expenses').insert([{
          ...txData,
          user_id: user?.id
        }]);
        if (error) throw error;
        setToast({ message: "Transaction added.", type: 'success' });
      }
      await fetchTransactions();
      setIsAddTransactionModalOpen(false);
      setEditingTransaction(null);
    } catch (err: any) {
      setToast({ message: `SYNC ERROR: ${err.message}`, type: 'error' });
    } finally {
      setFormLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setTransactions(transactions.filter(t => t.id !== id));
      setSelectedTransaction(null);
      setToast({ message: "Transaction deleted.", type: 'success' });
    } catch (err: any) {
      setToast({ message: `${err.message}`, type: 'error' });
    }
  };

  const clearAllTransactions = async () => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('user_id', user?.id);
      if (error) throw error;
      setTransactions([]);
      setToast({ message: "Transaction History cleared.", type: 'success' });
    } catch (err: any) {
      setToast({ message: `${err.message}`, type: 'error' });
    }
  };

  const handleUpdateNameInApp = (newName: string) => {
    if (user) {
      setUser({ ...user, name: newName });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-2xl flex items-center justify-center"
          >
            <div className="w-8 h-8 bg-slate-950 rounded-lg"></div>
          </motion.div>
          <div className="animate-pulse text-indigo-400 font-extrabold text-3xl tracking-tighter italic uppercase">SMARTSPEND</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 50 }}
            className="fixed bottom-10 right-6 z-[200] w-auto max-w-[90vw] md:max-w-md"
          >
            <div className={`glass p-4 rounded-2xl border ${toast.type === 'error' ? 'border-rose-500/30' : 'border-emerald-500/30'} flex items-center gap-4 shadow-2xl backdrop-blur-3xl bg-slate-900/60`}>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {toast.type === 'error' ? (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                ) : (
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                )}
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest italic whitespace-nowrap overflow-hidden text-ellipsis">{toast.message}</p>
              <button onClick={() => setToast(null)} className="ml-auto p-1 text-slate-500 hover:text-white transition-colors shrink-0">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTransaction && (
          <TransactionDetail
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            currency={currency}
            onEdit={(t) => {
              setSelectedTransaction(null);
              setEditingTransaction(t);
              setIsAddTransactionModalOpen(true);
            }}
            onDelete={deleteTransaction}
          />
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <LandingPage />
        } />

        <Route path="/login" element={
          user ? <Navigate to="/dashboard" replace /> : <AuthPage onToast={(msg, type) => setToast({ message: msg, type })} />
        } />

        <Route element={user ? <MainLayout user={user} onSignOut={handleSignOut} setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} /> : <Navigate to="/" replace />}>
          <Route path="/dashboard" element={
            <Dashboard
              transactions={transactions}
              currency={currency}
              user={user}
              setSelectedTransaction={setSelectedTransaction}
            />
          } />

          <Route path="/analytics" element={
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Deep Analysis</h2>
              </header>
              <AnalyticsPage transactions={transactions} currency={currency} />
            </motion.div>
          } />

          <Route path="/transactions" element={
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Transactions History</h2>
              </header>
              <div className="max-w-6xl mx-auto">
                <TransactionList transactions={transactions} currency={currency} user={user} onSelectTransaction={setSelectedTransaction} />
              </div>
            </motion.div>
          } />

          <Route path="/profile" element={
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Profile</h2>
              </header>
              <ProfilePage
                user={user}
                transactions={transactions}
                onClearData={clearAllTransactions}
                selectedCurrency={currency}
                onCurrencyChange={setCurrency}
                onUpdateName={handleUpdateNameInApp}
                onToast={(msg, type) => setToast({ message: msg, type })}
              />
            </motion.div>
          } />

          <Route path="/contact" element={
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <header className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">HQ Communications</h2>
              </header>
              <ContactPage />
            </motion.div>
          } />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>

      <AnimatePresence>
        {isAddTransactionModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddTransactionModalOpen(false);
                setEditingTransaction(null);
              }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg z-10"
            >
              <GlassCard className="p-6 md:p-8 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-slate-900/40">
                <TransactionForm
                  onSubmit={handleTransactionSubmit}
                  loading={formLoading}
                  onClose={() => {
                    setIsAddTransactionModalOpen(false);
                    setEditingTransaction(null);
                  }}
                  initialData={editingTransaction || undefined}
                />
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );

};

export default App;