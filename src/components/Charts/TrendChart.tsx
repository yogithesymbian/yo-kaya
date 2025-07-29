// src/components/Charts/TrendChart.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartData {
  time: string;
  amount: number;
}

interface Props {
  data: ChartData[];
  loading: boolean;
  activeTimeRange: string;
  setActiveTimeRange: (range: string) => void;
}

const timeRanges = [
  { key: '15m', label: '15M' },
  { key: '1h', label: '1H' },
  { key: '1d', label: '1D' },
  { key: '1w', label: '1W' },
  { key: '1M', label: '1M' },
  { key: '3M', label: '3M' },
  { key: '1Y', label: '1Y' }
];

const TrendChart: React.FC<Props> = ({ data, loading, activeTimeRange, setActiveTimeRange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">📈</span>
          <h2 className="text-lg font-semibold">Trend Pengeluaran</h2>
        </div>
      </div>

      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {timeRanges.map((range) => (
          <button
            key={range.key}
            onClick={() => setActiveTimeRange(range.key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTimeRange === range.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Pengeluaran']}
                labelStyle={{ color: '#374151' }}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TrendChart;
