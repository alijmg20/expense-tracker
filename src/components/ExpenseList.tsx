import { Pencil, Trash2 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import type { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const { allIncludingDeleted: categories } = useCategories();

  const getCategoryById = (id: number) => {
    return categories.find((c) => c.id === id);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-sm">No hay gastos registrados</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((expense) => {
        const category = getCategoryById(expense.categoryId);
        return (
          <div
            key={expense.id}
            className="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-100"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: category?.color ?? '#6b7280' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{expense.title}</p>
                <p className="text-xs text-gray-400">
                  {category?.name ?? 'Sin categoría'} · {formatDate(expense.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-sm font-semibold text-gray-800">
                {formatCurrency(expense.amount)}
              </span>
              <button
                onClick={() => onEdit(expense)}
                className="p-1.5 text-gray-400 hover:text-blue-500"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(expense.id!)}
                className="p-1.5 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}