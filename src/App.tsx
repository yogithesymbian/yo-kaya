// src/App.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { expenseAPI } from '@/services/expenseAPI';
import type { Expense, ExpenseForm, TimeRange } from '@/types/expense';
import ExpenseModal from '@/components/ExpenseModal';
import SummaryCards from '@/components/SummaryCards';
import TrendChart from '@/components/Charts/TrendChart';
import CategoryChart from '@/components/Charts/CategoryChart';
import ExpenseCard from '@/components/ExpenseCard';
import Header from '@/components/Header';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [activeTimeRange, setActiveTimeRange] = useState<TimeRange>('1w');
  const [form, setForm] = useState<ExpenseForm>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: ''
  });

  const categoryColors = ['#3B82F6','#EF4444','#10B981','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#6B7280'];
  const categories = ['Makanan & Minuman','Transportasi','Belanja','Tagihan','Hiburan','Kesehatan','Pendidikan','Lainnya'];

  useEffect(() => {
    loadExpenses();
    loadAllExpenses();
  }, [currentPage]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const res = await expenseAPI.getExpenses(currentPage);
      setExpenses(res.data);
      setTotalPages(res.totalPages);
      setTotalExpenses(res.total);
    } finally {
      setLoading(false);
    }
  };

  const loadAllExpenses = async () => {
    setChartLoading(true);
    try {
      const res = await expenseAPI.getAllExpenses();
      setAllExpenses(res);
    } finally {
      setChartLoading(false);
    }
  };

  const chartData = useMemo(() => {
    const now = new Date();
    const daysMap: Record<TimeRange, number> = {
      '15m': 0.01,
      '1h': 0.04,
      '1d': 1,
      '1w': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365
    };
    const days = daysMap[activeTimeRange];
    const startDate = new Date(now.getTime() - days * 86400000);

    const filtered = allExpenses.filter(exp => {
      const d = new Date(exp.date);
      return d >= startDate && d <= now;
    });

    const grouped: Record<string, number> = {};
    filtered.forEach(exp => {
      const d = new Date(exp.date);
      let key = activeTimeRange === '1w'
        ? d.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('id-ID', { month: 'short' });
      if (days <= 1) key = `${d.getHours().toString().padStart(2, '0')}:00`;
      grouped[key] = (grouped[key] || 0) + exp.amount;
    });

    return Object.entries(grouped).map(([time, amount]) => ({ time, amount }));
  }, [allExpenses, activeTimeRange]);

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    allExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value], i) => ({
      name,
      value,
      color: categoryColors[i % categoryColors.length]
    }));
  }, [allExpenses]);

  const totalAmount = allExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async () => {
    if (!form.category || !form.description || !form.amount) return;
    setLoading(true);
    try {
      const data = {
        date: form.date,
        category: form.category,
        description: form.description,
        amount: parseFloat(form.amount)
      };
      if (editingId) {
        await expenseAPI.updateExpense(editingId, data);
        setEditingId(null);
      } else {
        await expenseAPI.createExpense(data);
      }
      await loadExpenses();
      await loadAllExpenses();
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Expense) => {
    setForm({
      date: exp.date,
      category: exp.category,
      description: exp.description,
      amount: exp.amount.toString()
    });
    setEditingId(exp.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;
    setLoading(true);
    try {
      await expenseAPI.deleteExpense(id);
      await loadExpenses();
      await loadAllExpenses();
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Header onAdd={() => setShowModal(true)} />
        <SummaryCards total={totalAmount} count={totalExpenses} average={totalAmount / Math.max(1, Math.ceil(allExpenses.length / 2))} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <TrendChart data={chartData} loading={chartLoading} activeTimeRange={activeTimeRange} setActiveTimeRange={setActiveTimeRange} />
          <CategoryChart data={categoryData} loading={chartLoading} />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">📋 Riwayat Pengeluaran</h2>
            <div className="text-sm text-gray-500">
              Halaman {currentPage} dari {totalPages} ({totalExpenses} total)
            </div>
          </div>
          {loading && expenses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Memuat data...
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg mb-4">Belum ada catatan pengeluaran</p>
              <p className="text-gray-400">Tambahkan pengeluaran pertama Anda!</p>
            </div>
          ) : (
            <>
              <div className="divide-y">
                {expenses.map(exp => (
                  <ExpenseCard key={exp.id} expense={exp} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="p-6 border-t flex justify-between items-center">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    ← Sebelumnya
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)} disabled={loading} className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading} className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Selanjutnya →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ExpenseModal
          isOpen={showModal}
          onClose={resetForm}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          categories={categories}
          loading={loading}
          editingId={editingId}
        />
      </div>
    </div>
  );
};

export default App;
