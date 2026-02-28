import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils/dateUtils';

interface BudgetInputProps {
  currentBudget: number | null;
  onSave: (amount: number) => void;
}

export default function BudgetInput({ currentBudget, onSave }: BudgetInputProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const handleEdit = () => {
    setValue(currentBudget ? String(currentBudget) : '');
    setEditing(true);
  };

  const handleSave = () => {
    const num = Number(value);
    if (num > 0) {
      onSave(num);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0"
          min="0"
          autoFocus
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={handleSave} className="p-1.5 text-green-500 hover:text-green-600">
          <Check size={18} />
        </button>
        <button onClick={handleCancel} className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-base text-gray-700 dark:text-gray-300">
        {currentBudget ? formatCurrency(currentBudget) : 'Sin definir'}
      </span>
      <button onClick={handleEdit} className="p-1 text-gray-400 dark:text-gray-500 hover:text-blue-500">
        <Pencil size={14} />
      </button>
    </div>
  );
}
