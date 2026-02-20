import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import TypewriterBrand from './TypewriterBrand';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onSignOut: () => void;
  userEmail: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onSignOut,
  userEmail,
  isOpen,
  onClose
}) => {
  const menuItems = [
    {
      id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      id: 'analytics', path: '/analytics', label: 'Analytics', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'transactions', path: '/transactions', label: 'History', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'profile', path: '/profile', label: 'Account Profile', icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
  ];

  // Fix: Explicitly type sidebarVariants as Variants to avoid 'string' vs 'AnimationGeneratorType' mismatch in transition type
  const sidebarVariants: Variants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const Content = (
    <div className="h-full w-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-12">
        <NavLink to="/dashboard" onClick={onClose} className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative w-9 h-9 bg-slate-900 border border-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <TypewriterBrand animate={false} />
        </NavLink>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-500 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 border-t border-white/5 space-y-4">
        <NavLink
          to="/profile"
          onClick={onClose}
          className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
            ? 'text-white bg-white/5 border border-white/10'
            : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold italic shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="truncate flex-1 text-left">{userEmail.split('@')[0]}</span>
        </NavLink>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-white/5 z-50 hidden lg:flex flex-col">
        {Content}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.aside
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed left-0 top-0 h-full w-[280px] bg-slate-950 border-r border-white/10 z-[101] lg:hidden flex flex-col"
            >
              {Content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
