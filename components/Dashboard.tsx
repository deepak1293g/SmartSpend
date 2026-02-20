import React from 'react';
import { motion } from 'framer-motion';
import Summary from './Summary';
import Visualization from './Visualization';
import TransactionList from './TransactionList';
import { Transaction, UserProfile, CurrencyCode } from '../types';

interface DashboardProps {
    transactions: Transaction[];
    currency: CurrencyCode;
    user: UserProfile | null;
    setSelectedTransaction: (tx: Transaction | null) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, currency, user, setSelectedTransaction }) => {
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <header className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Market Overview</h2>
            </header>
            <div className="space-y-6 md:space-y-8">
                <Summary transactions={transactions} currency={currency} />
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    <Visualization transactions={transactions} currency={currency} />
                    <TransactionList transactions={transactions} currency={currency} user={user} onSelectTransaction={setSelectedTransaction} />
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
