// src/components/Header.tsx
import React from 'react';
import { Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

const Header: React.FC<Props> = ({ onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Catatan Pengeluaran</h1>
          <p className="text-gray-600">Kelola keuangan Anda dengan mudah dan efisien</p>
        </div>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
        >
          <Plus size={20} /> Tambah Pengeluaran
        </button>
      </div>
    </div>
  );
};

export default Header;
