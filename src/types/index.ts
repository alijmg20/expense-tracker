export interface Category {
    id?: number;
    name: string;
    type: 'fixed' | 'variable';
    color: string;
    isDeleted?: boolean;
  }
  
export interface Expense {
    id?: number;
    title: string;
    description?: string;
    amount: number;
    categoryId: number;
    date: Date;
    createdAt: Date;
}

export interface MonthlyBudget {
    id?: number;
    year: number;
    month: number;
    totalBudget: number;
}