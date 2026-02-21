
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import TypewriterBrand from './TypewriterBrand';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
      {/* Fixed Navigation Bar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${scrolled
        ? 'bg-slate-950/70 backdrop-blur-xl border-white/10 py-4 shadow-2xl'
        : 'bg-transparent border-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-indigo-500 shadow-inner">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <TypewriterBrand animate={false} />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors italic">Features</button>
            <button onClick={() => scrollToSection('stats')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors italic">Metrics</button>
            <button onClick={() => scrollToSection('intelligence')} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors italic">AI Cognitive</button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 text-indigo-400 rounded-xl font-black text-xs uppercase tracking-widest transition-all italic"
            >
              Portal Access
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background Glows */}
        <div className="absolute top-0 -left-10 w-48 h-48 md:w-96 md:h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[140px] opacity-10 animate-pulse"></div>
        <div className="absolute top-20 -right-10 w-48 h-48 md:w-96 md:h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[100px] md:blur-[140px] opacity-10 animate-pulse delay-700"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] md:text-[10px] font-extrabold mb-6 md:mb-8 tracking-[0.2em] uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Next-Gen Intelligence
            </div>

            <div className="min-h-[140px] md:min-h-[220px]">
              <TypewriterBrand large />
            </div>

            <p className="text-base md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 mb-8 md:mb-12 leading-relaxed font-semibold">
              Transform your financial data into actionable intelligence. Elite expense tracking meets high-fidelity AI insights designed for absolute clarity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/login')}
                className="px-8 md:px-10 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold text-base md:text-lg transition-all shadow-2xl shadow-indigo-600/40 transform hover:-translate-y-1 uppercase tracking-tighter italic"
              >
                Launch App
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-8 md:px-10 py-4 md:py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-extrabold text-base md:text-lg transition-all backdrop-blur-sm uppercase tracking-tighter italic"
              >
                Features
              </button>
            </div>
          </div>

          {/* Visual Elements Area */}
          <div className="relative group mt-8 lg:mt-0 px-4 md:px-0">
            {/* Floating Cards */}
            <div className="absolute -top-4 sm:-top-8 md:-top-12 -left-2 sm:-left-4 md:-left-8 z-20 animate-blob scale-75 sm:scale-100 origin-top-left" style={{ animationDuration: '6s' }}>
              <div className="glass rounded-xl md:rounded-2xl p-3 md:p-5 border-l-4 border-l-emerald-500 shadow-2xl bg-slate-900/60 backdrop-blur-3xl border border-white/10">
                <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Inbound</p>
                <p className="text-xl md:text-3xl font-black text-emerald-400 tracking-tighter">+₹12,450</p>
              </div>
            </div>

            <div className="absolute -bottom-2 sm:-bottom-6 md:-bottom-10 -right-2 sm:-right-4 md:-right-6 z-20 animate-blob animation-delay-2000 scale-75 sm:scale-100 origin-bottom-right" style={{ animationDuration: '8s' }}>
              <div className="glass rounded-xl md:rounded-2xl p-3 md:p-5 border-l-4 border-l-rose-500 shadow-2xl bg-slate-900/60 backdrop-blur-3xl border border-white/10">
                <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Outbound</p>
                <p className="text-xl md:text-3xl font-black text-rose-400 tracking-tighter">-₹2,142</p>
              </div>
            </div>

            {/* Main Mockup Container */}
            <div className="relative">
              <div className="absolute -inset-4 md:-inset-6 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/10 rounded-[2rem] md:rounded-[3rem] blur-2xl md:blur-3xl opacity-50"></div>
              <div className="relative glass rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl bg-slate-900/80 backdrop-blur-3xl transition-transform duration-700 group-hover:scale-[1.01]">
                <div className="h-8 md:h-10 bg-white/5 border-b border-white/5 flex items-center px-4 md:px-6 gap-2">
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-rose-500/50"></div>
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-amber-500/50"></div>
                  <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-emerald-500/50"></div>
                </div>
                <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-2 w-16 md:w-24 bg-white/10 rounded"></div>
                      <div className="h-5 w-32 md:w-48 bg-white/5 rounded-lg"></div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                  </div>
                  <div className="h-40 md:h-56 rounded-2xl md:rounded-3xl bg-white/5 border border-white/5 p-4 md:p-6 flex items-end justify-around gap-2 md:gap-3">
                    {[40, 75, 50, 95, 60, 85, 55, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-indigo-500/40 rounded-t-lg" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Grid */}
      <section id="stats" className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { val: '120K+', label: 'TX Sync' },
            { val: '99.9%', label: 'Latency' },
            { val: 'Gemini', label: 'Cognitive' },
            { val: 'Titan', label: 'Security' }
          ].map((stat) => (
            <div key={stat.label} className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 text-center">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">{stat.val}</p>
              <p className="text-[9px] md:text-[10px] text-slate-500 uppercase font-extrabold tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 uppercase italic tracking-tighter leading-none">Core Systems.</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-semibold text-base md:text-lg px-4">Sophisticated financial engineering paired with hyper-modern aesthetic sensibilities.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { title: 'Analysis', icon: 'M13 10V3L4 14h7v7l9-11h-7z', desc: 'Advanced neural processing of your cash flow patterns.', color: 'indigo' },
            { title: 'Clarity', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', desc: 'High-fidelity visualizations rendering your financial trajectory.', color: 'emerald' },
            { title: 'Unified', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', desc: 'Encrypted sovereignty via military-grade architecture.', color: 'purple' }
          ].map((f) => (
            <GlassCard key={f.title} className="p-8 md:p-10 border-white/5 hover:border-white/10 transition-all">
              <div className={`w-12 h-12 md:w-16 md:h-16 bg-slate-900 border border-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 text-${f.color}-400`}>
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={f.icon} /></svg>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white mb-4 uppercase italic">{f.title}</h3>
              <p className="text-sm md:text-base text-slate-500 font-semibold leading-relaxed">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-white/5 bg-slate-950/50 backdrop-blur-xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 md:gap-3 mb-8 md:mb-10">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 border border-white/10 rounded-lg md:rounded-2xl flex items-center justify-center text-indigo-500">
              <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <TypewriterBrand />
          </div>
          <p className="text-slate-500 text-[10px] md:text-sm font-extrabold uppercase tracking-[0.3em] px-4">&copy; 2024 SmartSpend AI Systems. <br className="md:hidden" /> All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
