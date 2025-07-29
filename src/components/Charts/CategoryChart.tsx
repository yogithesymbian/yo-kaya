// src/components/Charts/CategoryChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface Props {
  data: CategoryData[];
  loading: boolean;
}

const CategoryChart: React.FC<Props> = ({ data, loading }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-4">Distribusi Kategori</h2>
      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                fontSize={12}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
