import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
    onToast: (message: string, type: 'success' | 'error') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onToast }) => {
    const [signinEmail, setSigninEmail] = useState('');
    const [signinPassword, setSigninPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authCountryCode, setAuthCountryCode] = useState('+91');
    const [authPhoneNumber, setAuthPhoneNumber] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');

    const navigate = useNavigate();

    const handleAuth = async () => {
        if (authView === 'signin' && (!signinEmail || !signinPassword)) {
            setError("Email and Access Key are required for sign in.");
            return;
        }
        if (authView === 'signup' && (!signupEmail || !signupPassword)) {
            setError("Email and Access Key are required for registry.");
            return;
        }

        setAuthLoading(true);
        setError(null);

        try {
            if (authView === 'signup') {
                if (!authPhoneNumber || authPhoneNumber.length < 10) {
                    throw new Error("10-digit Phone Protocol is mandatory for registry.");
                }

                const fullPhone = `${authCountryCode}${authPhoneNumber}`;

                // Chck if phone already exists
                const { data: phoneExists, error: phoneCheckError } = await supabase.rpc('check_phone_exists', {
                    phone_number: fullPhone
                });

                if (phoneCheckError) {
                    console.error("Phone check error:", phoneCheckError);
                    // allow to proceed if RPC is missing, else they can't signup at all if they didn't run the SQL
                } else if (phoneExists) {
                    onToast("This phone number is already registered.", 'error');
                    throw new Error("Phone number already registered.");
                }

                const { error, data } = await supabase.auth.signUp({
                    email: signupEmail,
                    password: signupPassword,
                    options: {
                        data: {
                            phone: fullPhone,
                            full_name: signupName.trim() || signupEmail.split('@')[0]
                        }
                    }
                });

                if (error) {
                    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('exists')) {
                        onToast("Email is already registered.", 'error');
                        throw new Error("Email is already registered.");
                    }
                    throw error;
                }

                if (data.session) {
                    onToast("System access granted.", 'success');
                    // Session is created, App.tsx's onAuthStateChange will handle navigation via its /login redirect
                } else {
                    onToast("Please verify your email to activate link.", 'success');
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: signinEmail,
                    password: signinPassword
                });
                if (error) throw error;
                onToast("Authorization complete.", 'success');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden auth-grid selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="absolute top-0 -left-10 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[140px] opacity-10 animate-pulse"></div>
            <div className="absolute top-40 -right-10 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[140px] opacity-10 animate-pulse delay-700"></div>
            <div className="scan-line"></div>

            <button
                onClick={() => navigate(-1)}
                className="absolute top-6 left-6 md:top-8 md:left-8 p-3 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl text-slate-500 hover:text-white z-20 transition-all hover:bg-white/5"
            >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="glass rounded-[2rem] md:rounded-[3rem] p-1 shadow-[0_0_80px_rgba(79,70,229,0.15)] border-white/10 overflow-hidden">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[1.9rem] md:rounded-[2.9rem] p-6 md:p-14">
                        <div className="text-center mb-8 md:mb-10">
                            <motion.div
                                key="icon-auth"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-16 h-16 md:w-20 md:h-20 bg-slate-950 border border-indigo-500/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-inner"
                            >
                                <svg className="w-8 h-8 md:w-10 md:h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-2 italic uppercase">
                                System <span className="text-indigo-500">{authView === 'signin' ? 'Access' : 'Registry'}</span>
                            </h1>
                            <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] bg-white/5 py-1 px-4 rounded-full inline-block">
                                {authView === 'signin' ? 'Verify Credentials' : 'Create Identity'}
                            </p>
                        </div>

                        <div className="flex bg-slate-950/50 p-1.5 rounded-2xl md:rounded-3xl mb-8 md:mb-10 border border-white/5 relative">
                            <AnimatePresence>
                                <motion.div
                                    className="absolute bg-indigo-500/20 border border-indigo-500/30 rounded-[1rem] md:rounded-[1.25rem] h-[calc(100%-12px)] top-1.5 bottom-1.5 w-[calc(50%-6px)] pointer-events-none"
                                    initial={false}
                                    animate={{ left: authView === 'signin' ? '6px' : 'calc(50%)' }}
                                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                                />
                            </AnimatePresence>
                            <button
                                onClick={() => { setAuthView('signin'); setError(null); }}
                                className={`flex-1 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest relative z-10 py-2.5 md:py-4 transition-colors duration-300 ${authView === 'signin' ? 'text-white' : 'text-slate-500'}`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setAuthView('signup'); setError(null); }}
                                className={`flex-1 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest relative z-10 py-2.5 md:py-4 transition-colors duration-300 ${authView === 'signup' ? 'text-white' : 'text-slate-500'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-5 md:space-y-6">
                            {authView === 'signin' ? (
                                <>
                                    <div className="group">
                                        <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-indigo-400">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={signinEmail}
                                            onChange={(e) => setSigninEmail(e.target.value)}
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                            placeholder="operator@matrix.net"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-indigo-400">Password </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={signinPassword}
                                                onChange={(e) => setSigninPassword(e.target.value)}
                                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 pr-10 md:pr-14 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.077 10.077 0 011.559-3.235m3.193-3.033A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3m9 8a3 3 0 103 3M9.758 9.758L12 12" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="group">
                                        <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-indigo-400">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={signupEmail}
                                            onChange={(e) => setSignupEmail(e.target.value)}
                                            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                            placeholder="operator@matrix.net"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-indigo-400">Password </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 pr-10 md:pr-14 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-600 hover:text-indigo-400 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.077 10.077 0 011.559-3.235m3.193-3.033A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-2.101-2.101L3 3m9 8a3 3 0 103 3M9.758 9.758L12 12" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <AnimatePresence>
                                {authView === 'signup' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-5 md:space-y-6 overflow-hidden"
                                    >
                                        <div className="group">
                                            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-emerald-400">Name</label>
                                            <input
                                                type="text"
                                                required={authView === 'signup'}
                                                value={signupName}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setSignupName(val.charAt(0).toUpperCase() + val.slice(1));
                                                }}
                                                className="w-full bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="group">
                                            <label className="block text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-emerald-400">Phone Number</label>
                                            <div className="flex gap-2">
                                                <div className="w-20 md:w-24 bg-slate-950/40 border border-white/5 rounded-2xl flex items-center justify-center font-bold text-xs md:text-sm text-white">{authCountryCode}</div>
                                                <input
                                                    type="tel"
                                                    required={authView === 'signup'}
                                                    maxLength={10}
                                                    value={authPhoneNumber}
                                                    onChange={(e) => setAuthPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                                    className="flex-1 bg-slate-950/40 border border-white/5 rounded-2xl px-4 md:px-6 py-2.5 md:py-4 text-xs md:text-base text-white focus:border-indigo-500/50 focus:outline-none transition-all placeholder:text-slate-800"
                                                    placeholder="9876543210"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center italic"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-black py-3.5 md:py-5 rounded-2xl md:rounded-[1.5rem] transition-all shadow-2xl shadow-indigo-600/30 uppercase tracking-[0.2em] text-[10px] md:text-sm italic"
                            >
                                {authLoading ? 'Verifying...' : authView === 'signin' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>
                    </div>
                </div >
            </motion.div >
        </div >
    );
};

export default AuthPage;
