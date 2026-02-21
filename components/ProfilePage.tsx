
import React, { useState, useEffect } from 'react';
import { Transaction, UserProfile, CurrencyCode, CURRENCY_CONFIG } from '../types';
import { supabase } from '../services/supabaseClient';
import GlassCard from './GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AnimatedNumber from './AnimatedNumber';

interface ProfilePageProps {
  user: UserProfile;
  transactions: Transaction[];
  onClearData: () => Promise<void>;
  selectedCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onUpdateName?: (newName: string) => void;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  transactions,
  onClearData,
  selectedCurrency,
  onCurrencyChange,
  onUpdateName,
  onToast
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingProfile, setIsDeletingProfile] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEmptyLedgerModal, setShowEmptyLedgerModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name || '');
  const [saveLoading, setSaveLoading] = useState(false);
  const config = CURRENCY_CONFIG[selectedCurrency];
  const [showResetSuccessModal, setShowResetSuccessModal] = useState(false);

  // New state variables for password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + (t.amount * config.rate), 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + (t.amount * config.rate), 0);

  const maxExpense = transactions.length > 0
    ? Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount * config.rate), 0)
    : 0;

  useEffect(() => {
    if (showResetSuccessModal) {
      const timer = setTimeout(() => {
        setShowResetSuccessModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showResetSuccessModal]);

  const handleUpdateName = async () => {
    if (!tempName.trim()) return;
    setSaveLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: tempName, name: tempName }
      });
      if (error) throw error;
      if (onUpdateName) onUpdateName(tempName);
      setIsEditingName(false);
      onToast("Display name updated successfully", "success");
    } catch (err: any) {
      onToast(err.message, "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      onToast("Password must be at least 6 characters.", "error");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      onToast("Password updated successfully", "success");
      setShowPasswordModal(false);
      setNewPassword('');
    } catch (error: any) {
      onToast(error.message, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const executeClearData = async () => {
    setIsDeleting(true);
    await onClearData();
    setIsDeleting(false);
    setShowResetModal(false);
    setShowResetSuccessModal(true); // ✅ alert ki jagah ye
  };

  const executeDeleteProfile = async () => {
    setIsDeletingProfile(true);
    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      setShowDeleteModal(false);
      setShowDeleteSuccessModal(true);
    } catch (err: any) {
      onToast(err.message, "error");
    } finally {
      setIsDeletingProfile(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Profile Header */}
      <motion.div variants={item}>
        <GlassCard className="bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-3xl blur opacity-30"></div>
              <div className="relative w-32 h-32 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center text-5xl font-black text-indigo-400 italic overflow-hidden">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <AnimatePresence mode="wait">
                {isEditingName ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col md:flex-row items-center gap-3 mb-2"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-black italic tracking-tighter focus:outline-none focus:border-indigo-500/50 w-full md:w-auto"
                      placeholder="Operator Name"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateName}
                        disabled={saveLoading}
                        className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors"
                      >
                        {saveLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        )}
                      </button>
                      <button
                        onClick={() => { setIsEditingName(false); setTempName(user.name || ''); }}
                        className="p-2 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="display"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center justify-center md:justify-start gap-4 mb-1"
                  >
                    <h2 className="text-3xl font-black text-white tracking-tighter">{user.name || user.email.split('@')[0]}</h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 bg-white/5 text-slate-500 hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 mb-4">
                <p className="text-slate-400 font-semibold">{user.email}</p>
                {user.phone && (
                  <>
                    <span className="hidden md:inline text-slate-600">•</span>
                    <p className="text-slate-400 font-semibold">{user.phone}</p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-400">Verified Identity</span>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest text-indigo-400">Premium Tier</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <GlassCard title="Lifetime Volume" className="h-full">
            <div className="mt-2">
              <AnimatedNumber value={totalSpent + totalIncome} prefix={config.symbol} className="text-3xl font-black text-white tracking-tighter" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Movement in {config.symbol}</p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={item}>
          <GlassCard title="Transaction Count" className="h-full">
            <div className="mt-2">
              <AnimatedNumber value={transactions.length} className="text-3xl font-black text-white tracking-tighter" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Logged entries</p>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div variants={item}>
          <GlassCard title="Peak Expenditure" className="h-full">
            <div className="mt-2">
              <AnimatedNumber value={maxExpense} prefix={config.symbol} className="text-3xl font-black text-rose-400 tracking-tighter" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Single highest outbound</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="space-y-6">
          <GlassCard title="Preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group">
                <span className="text-sm font-bold text-slate-300">Base Currency</span>
                <span className="text-xs font-black text-indigo-400 uppercase">{config.label} ({config.symbol})</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-slate-300">Biometric Sync</span>
                <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                  <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm font-bold text-slate-300">Push Notifications</span>
                <div className="w-10 h-5 bg-white/10 rounded-full flex items-center px-1">
                  <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Security">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between group"
            >
              <div>
                <p className="text-sm font-bold text-white">Update Password</p>
              </div>
              <svg className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </GlassCard>
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <GlassCard title="Danger Zone" className="border-rose-500/20 bg-rose-500/5">
            <p className="text-sm text-slate-400 mb-6 font-medium">These actions are destructive and involve permanent data removal from the matrix.</p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  if (transactions.length === 0) {
                    setShowEmptyLedgerModal(true);
                  } else {
                    setShowResetModal(true);
                  }
                }}
                disabled={isDeleting}
                className="w-full py-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                {isDeleting ? "WIPING DATA..." : "Reset Financial Ledger"}
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeletingProfile}
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-rose-500/40 border border-white/5 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
              >
                {isDeletingProfile ? "TERMINATING..." : "Delete User Profile"}
              </button>
            </div>
          </GlassCard>

          <div className="p-8 text-center">
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em]">System Version 2.5.0-F</p>
            <p className="text-[10px] text-indigo-500/40 font-black uppercase tracking-[0.2em] mt-1">Last Synced: {new Date().toLocaleTimeString()}</p>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-rose-500/20"
            >
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">Critical Warning</h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Are you absolutely sure you want to permanently delete your entire account? This action cannot be undone and will wipe all your data from the matrix.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletingProfile}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel Action
                </button>
                <button
                  onClick={executeDeleteProfile}
                  disabled={isDeletingProfile}
                  className="flex-1 px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-sm transition-colors shadow-lg shadow-rose-500/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {isDeletingProfile ? "Terminating..." : "Confirm Deletion"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Ledger Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-amber-500/20"
            >
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">Clear Ledger Data</h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Are you sure you want to permanently delete all your financial transaction history? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors disabled:opacity-50"
                >
                  Cancel Action
                </button>
                <button
                  onClick={executeClearData}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50 flex justify-center items-center"
                >
                  {isDeleting ? "Wiping Data..." : "Confirm Reset"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty Ledger Information Modal */}
      <AnimatePresence>
        {showEmptyLedgerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
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

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">Ledger is Empty</h3>
              <p className="text-slate-400 text-sm text-center mb-8">
                Your financial ledger is currently completely empty. There are no transactions to wipe.
              </p>

              <button
                onClick={() => setShowEmptyLedgerModal(false)}
                className="w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors"
              >
                Acknowledge
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Delete Success Modal */}
      <AnimatePresence>
        {showDeleteSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-emerald-500/20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Erased Successfully</h3>
              <p className="text-slate-400 text-sm mb-8 px-4">
                Your profile, transactions, and all associated footprint have been permanently removed from the system.
              </p>

              <button
                onClick={async () => {
                  try {
                    await supabase.auth.signOut();
                  } catch (e) {
                    console.error("Error signing out after deletion", e);
                  }
                  navigate('/');
                }}
                className="w-full px-6 py-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 text-white font-black uppercase tracking-widest text-xs transition-all"
              >
                Return to Landing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ledger Reset Success Modal */}
      <AnimatePresence>
        {showResetSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-emerald-500/20 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">
                Ledger Cleared
              </h3>

              <p className="text-slate-400 text-sm mb-8 px-4">
                All financial transactions have been permanently wiped from your ledger.
              </p>

              <button
                onClick={() => setShowResetSuccessModal(false)}
                className="w-full px-6 py-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 text-white font-black uppercase tracking-widest text-xs transition-all"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl shadow-indigo-500/20"
            >
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-xl font-black text-white text-center uppercase tracking-widest mb-2">
                Update Password
              </h3>

              <p className="text-slate-400 text-sm text-center mb-6">
                Enter a new secure password to protect your financial matrix.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                <div className="space-y-4 mb-8">
                  <div className="group">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-indigo-400">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setNewPassword('');
                    }}
                    disabled={isUpdatingPassword}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPassword || !newPassword}
                    className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex justify-center items-center"
                  >
                    {isUpdatingPassword ? "Updating..." : "Confirm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ProfilePage;
