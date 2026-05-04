
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import TypewriterBrand from './TypewriterBrand';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${scrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-white/10 py-3 shadow-2xl shadow-indigo-500/5' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <TypewriterBrand animate={false} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Metrics'].map(item => (
              <button key={item} onClick={() => scrollToSection(item.toLowerCase().replace(/ /g, '-'))} className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">{item}</button>
            ))}
          </div>
          <button onClick={() => navigate('/login')} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 md:pt-48 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute top-20 left-1/3 w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[250px] opacity-[0.04]" />
        <div className="absolute bottom-10 right-1/3 w-[300px] h-[300px] bg-emerald-500 rounded-full blur-[200px] opacity-[0.03]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }} className="text-[10px] md:text-xs font-medium uppercase tracking-[0.25em] text-slate-500 mb-8">
              AI-powered expense tracking
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.6, delay: 0.1 }} className="mb-5 md:mb-6">
              <TypewriterBrand large />
            </motion.div>

            <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }} className="text-sm md:text-base text-slate-500 max-w-lg mx-auto mb-10 md:mb-12 leading-relaxed">
              Track your money. Understand your habits. Make smarter decisions — all powered by AI.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.35 }} className="flex flex-col sm:flex-row gap-3 justify-center mb-20 md:mb-28">
              <button onClick={() => navigate('/login')} className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5">
                Get Started
              </button>
              <button onClick={() => scrollToSection('features')} className="px-7 py-3.5 text-slate-400 hover:text-white font-semibold text-sm transition-colors">
                Learn more →
              </button>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.5 }} className="relative max-w-5xl mx-auto group">
            <div className="absolute -inset-6 md:-inset-10 bg-gradient-to-b from-indigo-500/15 to-emerald-500/5 rounded-[3rem] blur-3xl opacity-50" />
            <div className="absolute -inset-10 md:-inset-16 rounded-[4rem] border border-indigo-500/[0.06] pointer-events-none" />

            {/* Floating cards */}
            {[
              { pos: '-top-5 -left-4 sm:-left-6', color: 'emerald', label: 'Income', val: '+₹12,450', sub: '↑ 12%', delay: '0s', dur: '5s' },
              { pos: '-top-4 -right-4 sm:-right-6', color: 'indigo', label: 'AI Score', val: '98.7%', sub: 'Excellent', delay: '1s', dur: '6s' },
              { pos: '-bottom-5 left-8', color: 'purple', label: 'Saved', val: '₹45,200', sub: '85% goal', delay: '1.5s', dur: '7s' },
              { pos: '-bottom-4 -right-4', color: 'rose', label: 'Spent', val: '-₹3,850', sub: '↓ 8%', delay: '0.5s', dur: '5.5s' },
            ].map((c, i) => (
              <div key={i} className={`absolute ${c.pos} z-20`} style={{ animation: `float ${c.dur} ease-in-out ${c.delay} infinite` }}>
                <div className={`rounded-xl md:rounded-2xl p-3 md:p-4 bg-slate-900/85 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-${c.color}-500/10`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${c.color}-400 animate-pulse`} />
                    <p className="text-[7px] md:text-[8px] text-slate-500 uppercase font-bold tracking-widest">{c.label}</p>
                  </div>
                  <p className={`text-base md:text-xl font-black text-${c.color}-400 tracking-tighter`}>{c.val}</p>
                  <p className={`text-[7px] text-${c.color}-400/50 font-bold`}>{c.sub}</p>
                </div>
              </div>
            ))}

            {/* Mockup */}
            <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl bg-slate-900/90 backdrop-blur-3xl transition-transform duration-700 group-hover:scale-[1.005]">
              <div className="h-9 md:h-11 bg-slate-800/60 border-b border-white/5 flex items-center px-5 gap-2">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" /><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" /></div>
                <div className="ml-3 h-5 bg-white/5 rounded-md max-w-[180px] md:max-w-xs flex-1 flex items-center px-3"><span className="text-[8px] text-slate-600 font-mono">smartspend.ai/dashboard</span></div>
              </div>
              <div className="p-4 md:p-7">
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-5">
                  {[{ l: 'Balance', v: '₹1,24,500', c: 'white' }, { l: 'Expenses', v: '-₹18,340', c: 'rose-400' }, { l: 'Savings', v: '34.2%', c: 'emerald-400' }].map(s => (
                    <div key={s.l} className="bg-white/[0.02] rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5">
                      <p className="text-[7px] md:text-[8px] text-slate-600 uppercase font-bold tracking-widest mb-1">{s.l}</p>
                      <p className={`text-sm md:text-xl font-black text-${s.c} tracking-tighter`}>{s.v}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl md:rounded-2xl bg-white/[0.015] border border-white/5 p-4 md:p-5">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[8px] md:text-[9px] text-slate-500 uppercase font-bold tracking-widest">Weekly Overview</p>
                    <div className="flex gap-2">{['indigo', 'emerald'].map(c => <div key={c} className="flex items-center gap-1"><div className={`w-1.5 h-1.5 rounded-full bg-${c}-500`} /><span className="text-[6px] md:text-[7px] text-slate-600 font-bold uppercase">{c === 'indigo' ? 'Income' : 'Saving'}</span></div>)}</div>
                  </div>
                  <div className="h-28 md:h-40 flex items-end gap-1 md:gap-2">
                    {[{a:40,b:25},{a:75,b:55},{a:50,b:30},{a:95,b:70},{a:60,b:40},{a:85,b:65},{a:55,b:35},{a:70,b:50}].map((d,i) => (
                      <div key={i} className="flex-1 flex gap-px items-end h-full">
                        <div className="flex-1 bg-indigo-500/25 hover:bg-indigo-500/40 rounded-t transition-all" style={{ height: `${d.a}%` }} />
                        <div className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/35 rounded-t transition-all" style={{ height: `${d.b}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none rounded-b-[2rem]" />
          </motion.div>
        </div>

        <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }`}</style>
      </section>

      {/* Trusted Stats Bar */}
      <section id="metrics" className="py-10 md:py-16 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { val: '50K+', label: 'Active Users', icon: '👥' },
            { val: '₹12Cr+', label: 'Tracked', icon: '📊' },
            { val: '99.9%', label: 'Uptime', icon: '⚡' },
            { val: 'Gemini', label: 'AI Engine', icon: '🧠' },
          ].map(s => (
            <div key={s.label} className="text-center p-4">
              <p className="text-2xl md:text-3xl mb-1">{s.icon}</p>
              <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{s.val}</p>
              <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16 md:mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-500/20">Features</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mt-6 mb-4 tracking-tighter leading-tight">Everything you need to<br /><span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #818cf8, #34d399)' }}>master your money.</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium text-sm md:text-base">Smart tools, beautiful design, and AI intelligence — all working together.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {[
            { title: 'AI Insights', desc: 'Get personalized spending analysis powered by Google Gemini. Understand where your money goes.', icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: 'indigo' },
            { title: 'Smart Charts', desc: 'Beautiful visualizations that make complex financial data simple and actionable.', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'emerald' },
            { title: 'Bank-Grade Security', desc: 'Your financial data is protected with enterprise-level encryption and Supabase auth.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', color: 'purple' },
            { title: 'Instant Tracking', desc: 'Add income & expenses in seconds. Categorize, tag, and search with ease.', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'sky' },
            { title: 'Budget Goals', desc: 'Set monthly budgets and track your progress with smart alerts and insights.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
            { title: 'Cross-Platform', desc: 'Access your dashboard from any device. Your data syncs in real-time everywhere.', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'rose' },
          ].map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <div className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                <div className={`w-12 h-12 bg-${f.color}-500/10 border border-${f.color}-500/20 rounded-xl flex items-center justify-center mb-5 text-${f.color}-400 group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon} /></svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16 md:mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20">How It Works</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-6 mb-4 tracking-tighter">Start in <span className="text-emerald-400">3 simple steps</span></h2>
            <p className="text-slate-400 max-w-lg mx-auto font-medium text-sm md:text-base">No complex setup. Just sign up and start tracking your finances.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your email in seconds. No credit card needed.', color: 'indigo' },
              { step: '02', title: 'Track Spending', desc: 'Add your income and expenses. Categorize and organize effortlessly.', color: 'emerald' },
              { step: '03', title: 'Get AI Insights', desc: 'Let Gemini AI analyze your patterns and give you smart suggestions.', color: 'purple' },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.15 }} className="relative text-center p-8 md:p-10">
                <div className={`text-6xl md:text-8xl font-black text-${s.color}-500/10 absolute top-2 left-1/2 -translate-x-1/2 select-none`}>{s.step}</div>
                <div className={`w-14 h-14 bg-${s.color}-500/10 border border-${s.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 mt-8 text-${s.color}-400`}>
                  <span className="text-xl font-black">{s.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600 rounded-full blur-[250px] opacity-[0.06]" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tighter">Ready to take control of<br />your <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #818cf8, #34d399)' }}>finances?</span></h2>
          <p className="text-slate-400 font-medium text-sm md:text-base mb-10 max-w-lg mx-auto">Join thousands of users who are already tracking smarter with SmartSpend AI.</p>
          <button onClick={() => navigate('/login')} className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-base md:text-lg transition-all shadow-2xl shadow-indigo-600/30 hover:-translate-y-0.5 uppercase tracking-wider">
            Get Started Free →
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <TypewriterBrand animate={false} />
            </div>
            <div className="flex items-center gap-6">
              {['Features', 'Contact', 'Privacy'].map(l => (
                <button key={l} onClick={() => l === 'Contact' ? navigate('/contact') : l === 'Features' ? scrollToSection('features') : null} className="text-xs text-slate-500 hover:text-white font-medium transition-colors">{l}</button>
              ))}
            </div>
            <p className="text-slate-600 text-xs font-medium">&copy; 2025 SmartSpend. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
