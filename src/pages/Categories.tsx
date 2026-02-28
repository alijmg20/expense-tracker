import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import CategoryForm from '../components/CategoryForm';
import type { Category } from '../types';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);

  const handleSubmit = async (data: Omit<Category, 'id'>) => {
    if (editingCategory?.id) {
      await updateCategory(editingCategory.id, data);
    } else {
      await addCategory(data);
    }
    setEditingCategory(undefined);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCategory(undefined);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCategoryId !== null) {
      await deleteCategory(deletingCategoryId);
      setDeletingCategoryId(null);
    }
  };

  const fixedCategories = categories.filter((c) => c.type === 'fixed');
  const variableCategories = categories.filter((c) => c.type === 'variable');

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Categorías</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {fixedCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Gastos Fijos
          </h3>
          <div className="flex flex-col gap-2">
            {fixedCategories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                onEdit={handleEdit}
                onDelete={(id) => setDeletingCategoryId(id)}
              />
            ))}
          </div>
        </div>
      )}

      {variableCategories.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Gastos Variables
          </h3>
          <div className="flex flex-col gap-2">
            {variableCategories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                onEdit={handleEdit}
                onDelete={deleteCategory}
              />
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <CategoryForm
          onSubmit={handleSubmit}
          onClose={handleClose}
          initialData={editingCategory}
        />
      )}

      {deletingCategoryId !== null && (
        <ConfirmDialog
          title="Eliminar Categoría"
          message="¿Estás seguro de querer eliminar esta categoría?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingCategoryId(null)}
        />
      )}
    </div>
  );
}

function CategoryItem({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">{category.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(category)}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-blue-500"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(category.id!)}
          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
