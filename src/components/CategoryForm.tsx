import { useState } from 'react';
import { X } from 'lucide-react';
import type { Category } from '../types';

interface CategoryFormProps {
  onSubmit: (data: Omit<Category, 'id'>) => void;
  onClose: () => void;
  initialData?: Category;
}

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#6b7280', '#78716c',
];

export default function CategoryForm({ onSubmit, onClose, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [type, setType] = useState<'fixed' | 'variable'>(initialData?.type ?? 'variable');
  const [color, setColor] = useState(initialData?.color ?? colorOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onSubmit({ name, type, color });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Transporte"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('fixed')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  type === 'fixed'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                Fijo
              </button>
              <button
                type="button"
                onClick={() => setType('variable')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  type === 'variable'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-500'
                }`}
              >
                Variable
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors mt-2"
          >
            {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
          </button>
        </form>
      </div>
    </div>
  );
}