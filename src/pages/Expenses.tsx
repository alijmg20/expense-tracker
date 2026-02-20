import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import MonthFilter from '../components/MonthFilter';
import { formatCurrency, getMonthRange } from '../utils/dateUtils';
import type { Expense } from '../types';

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const { start, end } = getMonthRange(year, month);
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    const inMonth = d >= start && d <= end;
    const inCategory = selectedCategoryId === null || e.categoryId === selectedCategoryId;
    return inMonth && inCategory;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense?.id) {
      await updateExpense(editingExpense.id, data);
    } else {
      await addExpense(data);
    }
    setEditingExpense(undefined);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingExpense(undefined);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gastos</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <MonthFilter
        month={month}
        year={year}
        onChange={(m, y) => { setMonth(m); setYear(y); }}
      />

      <select
        value={selectedCategoryId ?? ''}
        onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
      >
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs text-gray-400">
          {filteredExpenses.length} gasto{filteredExpenses.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-semibold text-gray-700">
          Total: {formatCurrency(total)}
        </span>
      </div>

      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={deleteExpense}
      />

      {showForm && (
        <ExpenseForm
          onSubmit={handleSubmit}
          onClose={handleClose}
          initialData={editingExpense}
        />
      )}
    </div>
  );
}