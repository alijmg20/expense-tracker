import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import type { Expense } from '../types';

export function useExpenses() {
  const expenses = useLiveQuery(
    () => db.expenses.orderBy('date').reverse().toArray()
  );

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    await db.expenses.add({ ...expense, createdAt: new Date() });
  };

  const updateExpense = async (id: number, data: Partial<Expense>) => {
    await db.expenses.update(id, data);
  };

  const deleteExpense = async (id: number) => {
    await db.expenses.delete(id);
  };

  return { expenses: expenses ?? [], addExpense, updateExpense, deleteExpense };
}