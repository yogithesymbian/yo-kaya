import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, Edit3, Plus, Save, X, TrendingUp, ChevronLeft, ChevronRight, Calendar, DollarSign, Tag, FileText, Database, HardDrive, Cloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface ExpenseForm {
  date: string;
  category: string;
  description: string;
  amount: string;
}

type TimeRange = '15m' | '1h' | '1d' | '1w' | '1M' | '3M' | '1Y';
type StorageType = 'localStorage' | 'firebase';

// Firebase configuration (you'll need to replace with your actual config)
// const firebaseConfig = {
//   apiKey: "your-api-key",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "your-app-id"
// };

// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import { app } from "./firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyBRcX5LYBLfW5mH8uBR2fTDG2RkiwtGbl0",
//   authDomain: "samatech-labs.firebaseapp.com",
//   projectId: "samatech-labs",
//   storageBucket: "samatech-labs.firebasestorage.app",
//   messagingSenderId: "596323338500",
//   appId: "1:596323338500:web:ce2ba40eb9569a0ec1e851"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Mock Firebase functions (replace with actual Firebase SDK)
const mockFirebase = {
  async get(firebaseName: string): Promise<Expense[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In real implementation, this would be:
    const snapshot = await getDocs(collection(db, firebaseName));
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return snapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() } as Expense)
    )

    
    // For now, return sample data or localStorage fallback
    // const stored = JSON.parse(localStorage.getItem('firebase_expenses') || '[]');
    // if (stored.length === 0) {
    //   const sampleData = generateSampleData();
    //   localStorage.setItem('firebase_expenses', JSON.stringify(sampleData));
    //   return sampleData;
    // }
    // return stored;
  },
  
  async add(firebaseName: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // const newExpense: Expense = {
    //   ...data,
    //   id: Date.now().toString(),
    //   createdAt: new Date().toISOString()
    // };
    // In real implementation: 
    const docRef = await addDoc(collection(db, firebaseName), data);
    
    // const stored = JSON.parse(localStorage.getItem('firebase_expenses') || '[]');
    // const updated = [...stored, newExpense];
    // localStorage.setItem('firebase_expenses', JSON.stringify(updated));
    // return newExpense;
  },
  
  async update(firebaseName: string, id: string, data: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // In real implementation: 
    await updateDoc(doc(db, firebaseName, id), data);
    
    // const stored = JSON.parse(localStorage.getItem('firebase_expenses') || '[]');
    // const index = stored.findIndex((exp: Expense) => exp.id === id);
    // if (index !== -1) {
    //   stored[index] = { ...stored[index], ...data };
    //   localStorage.setItem('firebase_expenses', JSON.stringify(stored));
    //   return stored[index];
    // }
    // throw new Error('Expense not found');
  },
  
  async delete(firebaseName: string, id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // In real implementation: 
    await deleteDoc(doc(db, firebaseName, id));
    
    // const stored = JSON.parse(localStorage.getItem('firebase_expenses') || '[]');
    // const filtered = stored.filter((exp: Expense) => exp.id !== id);
    // localStorage.setItem('firebase_expenses', JSON.stringify(filtered));
  }
};

// Enhanced API functions with storage type support
const api = {
  async getExpenses(page: number = 1, limit: number = 10, storageType: StorageType = 'localStorage', firebaseName: string = 'expenses'): Promise<{ data: Expense[], total: number, totalPages: number }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let allExpenses: Expense[] = [];
    
    if (storageType === 'firebase') {
      allExpenses = await mockFirebase.get(firebaseName);
    } else {
      const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
      
      // Jika belum ada data, generate sample data
      if (stored.length === 0) {
        const sampleData = generateSampleData();
        localStorage.setItem('expenses', JSON.stringify(sampleData));
        allExpenses = sampleData;
      } else {
        allExpenses = stored;
      }
    }
    
    const sorted = allExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: sorted.slice(start, end),
      total: sorted.length,
      totalPages: Math.ceil(sorted.length / limit)
    };
  },

  async getAllExpenses(storageType: StorageType = 'localStorage', firebaseName: string = 'expenses'): Promise<Expense[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (storageType === 'firebase') {
      const expenses = await mockFirebase.get(firebaseName);
      return expenses.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else {
      const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
      return stored.sort((a: Expense, b: Expense) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
  },

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt'>, storageType: StorageType = 'localStorage', firebaseName: string = 'expenses'): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (storageType === 'firebase') {
      return await mockFirebase.add(firebaseName, expense);
    } else {
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updated = [...stored, newExpense];
      localStorage.setItem('expenses', JSON.stringify(updated));
      return newExpense;
    }
  },

  async updateExpense(id: string, expense: Omit<Expense, 'id' | 'createdAt'>, storageType: StorageType = 'localStorage', firebaseName: string = 'expenses'): Promise<Expense> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (storageType === 'firebase') {
      return await mockFirebase.update(firebaseName, id, expense);
    } else {
      const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
      const index = stored.findIndex((exp: Expense) => exp.id === id);
      if (index !== -1) {
        stored[index] = { ...stored[index], ...expense };
        localStorage.setItem('expenses', JSON.stringify(stored));
        return stored[index];
      }
      throw new Error('Expense not found');
    }
  },

  async deleteExpense(id: string, storageType: StorageType = 'localStorage', firebaseName: string = 'expenses'): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (storageType === 'firebase') {
      await mockFirebase.delete(firebaseName, id);
    } else {
      const stored = JSON.parse(localStorage.getItem('expenses') || '[]');
      const filtered = stored.filter((exp: Expense) => exp.id !== id);
      localStorage.setItem('expenses', JSON.stringify(filtered));
    }
  }
};

// Generate sample data untuk demo
const generateSampleData = (): Expense[] => {
  const categories = ['Makanan & Minuman', 'Transportasi', 'Belanja', 'Tagihan', 'Hiburan', 'Kesehatan', 'Pendidikan', 'Lainnya'];
  const descriptions = {
    'Makanan & Minuman': ['Makan siang', 'Kopi pagi', 'Groceries', 'Dinner', 'Snack'],
    'Transportasi': ['Bensin', 'Ojek online', 'Parkir', 'Tol', 'Grab'],
    'Belanja': ['Baju', 'Sepatu', 'Elektronik', 'Alat tulis', 'Gift'],
    'Tagihan': ['Listrik', 'Air', 'Internet', 'HP', 'Asuransi'],
    'Hiburan': ['Bioskop', 'Konser', 'Game', 'Streaming', 'Karaoke'],
    'Kesehatan': ['Obat', 'Vitamin', 'Checkup', 'Dokter', 'Olahraga'],
    'Pendidikan': ['Buku', 'Kursus', 'Training', 'Seminar', 'Workshop'],
    'Lainnya': ['Donasi', 'Gift', 'Emergency', 'Misc', 'Other']
  };

  const data: Expense[] = [];
  return data;
};

// Storage Toggle Component
const StorageToggle: React.FC<{
  storageType: StorageType;
  onToggle: (type: StorageType) => void;
  className?: string;
}> = ({ storageType, onToggle, className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Database size={16} />
        <span className="font-medium">Storage:</span>
      </div>
      
      <div className="relative">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => onToggle('localStorage')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              storageType === 'localStorage'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <HardDrive size={14} />
            Local
          </button>
          <button
            onClick={() => onToggle('firebase')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              storageType === 'firebase'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Cloud size={14} />
            Firebase
          </button>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full ${
          storageType === 'localStorage' ? 'bg-blue-500' : 'bg-orange-500'
        }`}></div>
        <span className="text-xs text-gray-500">
          {storageType === 'localStorage' ? 'Browser Storage' : 'Cloud Database'}
        </span>
      </div>
    </div>
  );
};

// Modal Component
const ExpenseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: ExpenseForm;
  setForm: React.Dispatch<React.SetStateAction<ExpenseForm>>;
  categories: string[];
  loading: boolean;
  editingId: string | null;
}> = ({ isOpen, onClose, onSubmit, form, setForm, categories, loading, editingId }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {editingId ? '✏️ Edit Pengeluaran' : '➕ Tambah Pengeluaran'}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-2">
            {editingId ? 'Perbarui informasi pengeluaran' : 'Catat pengeluaran baru Anda'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar size={16} className="text-blue-600" />
              Tanggal
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Tag size={16} className="text-green-600" />
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              required
            >
              <option value="">Pilih Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText size={16} className="text-purple-600" />
              Deskripsi
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Contoh: Makan siang di restoran favorit"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
              required
            />
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign size={16} className="text-orange-600" />
              Jumlah
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                Rp
              </span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="50,000"
                min="0"
                step="1000"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !form.category || !form.description || !form.amount}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
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
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExpenseTracker: React.FC = () => {
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
  const [storageType, setStorageType] = useState<StorageType>('localStorage');
  const [firebaseName, setFirebaseName] = useState<string>('');
  const [form, setForm] = useState<ExpenseForm>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: ''
  });

  const categories = [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja',
    'Tagihan',
    'Hiburan',
    'Kesehatan',
    'Pendidikan',
    'Lainnya'
  ];

  const timeRanges: { key: TimeRange; label: string; days: number }[] = [
    { key: '15m', label: '15M', days: 0.01 },
    { key: '1h', label: '1H', days: 0.04 },
    { key: '1d', label: '1D', days: 1 },
    { key: '1w', label: '1W', days: 7 },
    { key: '1M', label: '1M', days: 30 },
    { key: '3M', label: '3M', days: 90 },
    { key: '1Y', label: '1Y', days: 365 }
  ];

  const categoryColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280'
  ];

  useEffect(() => {
    loadExpenses();
    loadAllExpenses();
  }, [currentPage, storageType]); // Added storageType dependency

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const result = await api.getExpenses(currentPage, 10, storageType);
      setExpenses(result.data);
      setTotalPages(result.totalPages);
      setTotalExpenses(result.total);
    } catch (error) {
      console.error('Error loading expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllExpenses = async () => {
    setChartLoading(true);
    try {
      const data = await api.getAllExpenses(storageType);
      setAllExpenses(data);
    } catch (error) {
      console.error('Error loading all expenses:', error);
    } finally {
      setChartLoading(false);
    }
  };

  // Chart data processing
  const chartData = useMemo(() => {
    const range = timeRanges.find(r => r.key === activeTimeRange);
    if (!range || !allExpenses.length) return [];

    const now = new Date();
    const startDate = new Date(now.getTime() - (range.days * 24 * 60 * 60 * 1000));
    
    const filteredExpenses = allExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= now;
    });

    // Group by appropriate time interval
    const groupedData: { [key: string]: number } = {};
    
    filteredExpenses.forEach(expense => {
      let key: string;
      const date = new Date(expense.date);
      
      if (range.days <= 1) {
        // For 15m, 1h, 1d - group by hour
        key = `${date.getHours().toString().padStart(2, '0')}:00`;
      } else if (range.days <= 7) {
        // For 1w - group by day
        key = date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
      } else {
        // For 1M, 3M, 1Y - group by month
        key = date.toLocaleDateString('id-ID', { month: 'short' });
      }
      
      groupedData[key] = (groupedData[key] || 0) + expense.amount;
    });

    return Object.entries(groupedData)
      .map(([time, amount]) => ({ time, amount }))
      .sort((a, b) => {
        if (range.days <= 1) {
          return a.time.localeCompare(b.time);
        }
        return 0; // Keep original order for other ranges
      });
  }, [allExpenses, activeTimeRange]);

  // Category pie chart data
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    allExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryTotals)
      .map(([name, value], index) => ({
        name,
        value,
        color: categoryColors[index % categoryColors.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [allExpenses]);

  const handleSubmit = async () => {
    if (!form.category || !form.description || !form.amount) return;

    setLoading(true);
    try {
      const expenseData = {
        date: form.date,
        category: form.category,
        description: form.description,
        amount: parseFloat(form.amount)
      };

      if (editingId) {
        await api.updateExpense(editingId, expenseData, storageType);
        setEditingId(null);
      } else {
        await api.createExpense(expenseData, storageType);
      }

      await loadExpenses();
      await loadAllExpenses();
      resetForm();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense: Expense) => {
    setForm({
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString()
    });
    setEditingId(expense.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengeluaran ini?')) return;

    setLoading(true);
    try {
      await api.deleteExpense(id, storageType);
      await loadExpenses();
      await loadAllExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStorageToggle = (type: StorageType) => {
    setStorageType(type);
    setCurrentPage(1); // Reset to first page when switching storage
  };

  const handleFirebaseNameInput = (input: string) => {
    setFirebaseName(input);
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: ''
    });
    setShowModal(false);
    setEditingId(null);
  };

  const totalAmount = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          {/* Storage Toggle */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <StorageToggle 
              storageType={storageType}
              onToggle={handleStorageToggle}
            />
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              storageType === 'localStorage' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-orange-100 text-orange-700'
            }`}>
              {storageType === 'localStorage' ? '💾 Data tersimpan di browser' : `☁️ Data tersimpan di cloud (${firebaseName})`}
            </div>

            
          </div>
          {storageType === 'firebase' ? (
            <>
              {/* Description Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText size={16} className="text-purple-600" />
                  Nama Database Cloud
                </label>
                <input
                  type="text"
                  value={firebaseName}
                  onChange={(e) => handleFirebaseNameInput(e.target.value)}
                  placeholder="Contoh: agustus_yogi_password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>
              <br/>
            </>
          ) : <></>}
          
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Catatan Pengeluaran</h1>
              <p className="text-gray-600">
                Kelola keuangan Anda dengan mudah dan efisien 
                {storageType === 'firebase' && (
                  <span className="ml-2 inline-flex items-center gap-1 text-orange-600 text-sm">
                    <Cloud size={14} />
                    Sync cloud aktif
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
            >
              <Plus size={20} />
              Tambah Pengeluaran
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-blue-700">Total Pengeluaran</p>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">💳</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-green-700">Total Transaksi</p>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-900">{totalExpenses}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-purple-700">Rata-rata per Hari</p>
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📈</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(totalAmount / Math.max(1, Math.ceil(allExpenses.length / 2)))}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                <h2 className="text-lg font-semibold">Trend Pengeluaran</h2>
              </div>
            </div>

            {/* Time Range Selector */}
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
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#666"
                      fontSize={12}
                    />
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

          {/* Category Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Distribusi Kategori</h2>
            <div className="h-64">
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                      fontSize={12}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Expense List with Pagination */}
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
                {expenses.map((expense) => (
                  <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
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
                        <h3 className="font-medium text-gray-900 mb-1">
                          {expense.description}
                        </h3>
                        <p className="text-lg font-semibold text-red-600">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                    Sebelumnya
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal */}
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

export default ExpenseTracker;