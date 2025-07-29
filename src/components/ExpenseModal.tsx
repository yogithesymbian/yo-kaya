// src/components/ExpenseModal.tsx
import React from 'react';
import { X, Calendar, Tag, FileText, DollarSign, Save } from 'lucide-react';
import type { ExpenseForm } from '@/types/expense';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: ExpenseForm;
  setForm: React.Dispatch<React.SetStateAction<ExpenseForm>>;
  categories: string[];
  loading: boolean;
  editingId: string | null;
}

const ExpenseModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, form, setForm, categories, loading, editingId }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {editingId ? '✏️ Edit Pengeluaran' : '➕ Tambah Pengeluaran'}
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
              <X size={20} />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-2">
            {editingId ? 'Perbarui informasi pengeluaran' : 'Catat pengeluaran baru Anda'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={16} className="text-blue-600" /> Tanggal
            </label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" required />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag size={16} className="text-green-600" /> Kategori
            </label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" required>
              <option value="">Pilih Kategori</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={16} className="text-purple-600" /> Deskripsi
            </label>
            <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Contoh: Makan siang" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" required />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign size={16} className="text-orange-600" /> Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">Rp</span>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="50000" min="0" step="1000" className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white" required />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading || !form.category || !form.description || !form.amount} className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editingId ? 'Update' : 'Simpan'}
                </>
              )}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
