import Dexie, { type Table } from 'dexie';
import type { Category, Expense, MonthlyBudget } from '../types';

export class ExpenseDatabase extends Dexie {
  categories!: Table<Category>;
  expenses!: Table<Expense>;
  monthlyBudgets!: Table<MonthlyBudget>;

  constructor() {
    super('ExpenseTracker');
    this.version(1).stores({
      categories: '++id, name, type',
      expenses: '++id, categoryId, date',
      monthlyBudgets: '++id, [year+month]'
    });
  }
}

export const db = new ExpenseDatabase();