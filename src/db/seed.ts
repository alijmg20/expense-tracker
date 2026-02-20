import { db } from './database';

const defaultCategories = [
  { name: 'Arriendo', type: 'fixed' as const, color: '#ef4444' },
  { name: 'Servicios', type: 'fixed' as const, color: '#f97316' },
  { name: 'Internet', type: 'fixed' as const, color: '#8b5cf6' },
  { name: 'Supermercado', type: 'variable' as const, color: '#22c55e' },
  { name: 'Transporte', type: 'variable' as const, color: '#3b82f6' },
  { name: 'Entretenimiento', type: 'variable' as const, color: '#ec4899' },
  { name: 'Salud', type: 'variable' as const, color: '#14b8a6' },
  { name: 'Otros', type: 'variable' as const, color: '#6b7280' },
];

export async function seedCategories() {
  const count = await db.categories.count();
  if (count === 0) {
    await db.categories.bulkAdd(defaultCategories);
  }
}