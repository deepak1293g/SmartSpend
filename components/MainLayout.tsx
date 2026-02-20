import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import { UserProfile } from '../types';

interface MainLayoutProps {
    user: UserProfile;
    onSignOut: () => void;
    setIsAddTransactionModalOpen: (open: boolean) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ user, onSignOut, setIsAddTransactionModalOpen }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const activeSection = location.pathname === '/dashboard' ? 'dashboard' : location.pathname.substring(1);

    return (
        <>
            <Sidebar
                activeSection={activeSection}
                setActiveSection={(s) => { navigate(s === 'dashboard' ? '/dashboard' : `/${s}`); setIsSidebarOpen(false); }}
                onSignOut={onSignOut}
                userEmail={user.name || user.email}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-5 right-5 z-40 p-2.5 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl text-slate-400 hover:text-white lg:hidden shadow-xl"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            <main className="transition-all duration-500 lg:pl-64">
                <div className="sticky top-0 z-30 h-16 w-full glass-dark border-b border-white/5 backdrop-blur-xl"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-20">
                    <Outlet />
                </div>
            </main>

            <AnimatePresence>
                {location.pathname === '/dashboard' && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsAddTransactionModalOpen(true)}
                        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.4)] z-[60] border border-white/20 text-white"
                    >
                        <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
};

export default MainLayout;
