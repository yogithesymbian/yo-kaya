// src/components/ExpenseCard.tsx
import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import type { Expense } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/formatters';

interface Props {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const ExpenseCard: React.FC<Props> = ({ expense, onEdit, onDelete, loading }) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
              {expense.category}
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(expense.date)}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">{expense.description}</h3>
          <p className="text-lg font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            disabled={loading}
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            disabled={loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;