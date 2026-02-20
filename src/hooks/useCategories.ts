import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Category } from '../types';

export function useCategories() {
  const allCategories = useLiveQuery(() => db.categories.toArray());

  const categories = (allCategories ?? []).filter((c) => !c.isDeleted);
  const allIncludingDeleted = allCategories ?? [];

  const addCategory = async (category: Omit<Category, 'id'>) => {
    await db.categories.add({ ...category, isDeleted: false });
  };

  const updateCategory = async (id: number, data: Partial<Category>) => {
    await db.categories.update(id, data);
  };

  const deleteCategory = async (id: number) => {
    await db.categories.update(id, { isDeleted: true });
  };

  return { categories, allIncludingDeleted, addCategory, updateCategory, deleteCategory };
}