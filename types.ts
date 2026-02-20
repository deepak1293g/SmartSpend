
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: TransactionType;
  created_at: string; // Using the default Supabase timestamp
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export const CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Housing',
  'Transportation',
  'Entertainment',
  'Health',
  'Salary',
  'Investment',
  'Other'
];

export type CurrencyCode = 'INR';

export interface CurrencyInfo {
  symbol: string;
  rate: number;
  label: string;
}

export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyInfo> = {
  INR: { symbol: '₹', rate: 1, label: 'Indian Rupee' },
};
