// src/components/SummaryCards.tsx
import React from 'react';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  total: number;
  count: number;
  average: number;
}

const SummaryCards: React.FC<Props> = ({ total, count, average }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-blue-700">Total Pengeluaran</p>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💳</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-900">{formatCurrency(total)}</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-green-700">Total Transaksi</p>
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📊</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-green-900">{count}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-purple-700">Rata-rata per Hari</p>
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">📈</span>
          </div>
        </div>
        <p className="text-2xl font-bold text-purple-900">{formatCurrency(average)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
