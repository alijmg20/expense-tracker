import { useState } from 'react';
import { X } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import type { Expense } from '../types';

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onClose: () => void;
  initialData?: Expense;
}

export default function ExpenseForm({ onSubmit, onClose, initialData }: ExpenseFormProps) {
  const { categories } = useCategories();
   const [title, setTitle] = useState(initialData?.title ?? '');
  const [amount, setAmount] = useState(initialData ? String(initialData.amount) : '');
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId ?? 0);
  const [date, setDate] = useState(() => {
    if (initialData) {
      return new Date(initialData.date).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !categoryId || !date) return;

    onSubmit({
      title,
      amount: Number(amount),
      categoryId,
      date: new Date(date + 'T12:00:00'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar Gasto' : 'Nuevo Gasto'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Compra semanal"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value={0} disabled>Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors mt-2"
          >
            {initialData ? 'Guardar Cambios' : 'Agregar Gasto'}
          </button>
        </form>
      </div>
    </div>
  );
}