// src/services/expenseAPI.ts
import type { Expense } from '@/types/expense';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const expenseAPI = {
  async getExpenses(page = 1, limit = 10): Promise<{ data: Expense[]; total: number; totalPages: number }> {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    const sorted = stored.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: sorted.slice(start, end),
      total: sorted.length,
      totalPages: Math.ceil(sorted.length / limit),
    };
  },

  async getAllExpenses(): Promise<Expense[]> {
    await delay(200);
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    return stored.sort((a: Expense, b: Expense) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    await delay(300);
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updated = [...stored, newExpense];
    localStorage.setItem('expenses', JSON.stringify(updated));
    return newExpense;
  },

  async updateExpense(id: string, expense: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    const index = stored.findIndex((exp: Expense) => exp.id === id);
    if (index !== -1) {
      stored[index] = { ...stored[index], ...expense };
      localStorage.setItem('expenses', JSON.stringify(stored));
      return stored[index];
    }
    throw new Error('Expense not found');
  },

  async deleteExpense(id: string): Promise<void> {
    await delay(300);
    const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
    const filtered = stored.filter((exp: Expense) => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(filtered));
  },
};