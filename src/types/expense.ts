// src/types/expense.ts
export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
}

export interface ExpenseForm {
  date: string;
  category: string;
  description: string;
  amount: string;
}

export type TimeRange = '15m' | '1h' | '1d' | '1w' | '1M' | '3M' | '1Y';