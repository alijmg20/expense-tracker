import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDate(date: Date): string {
  return format(new Date(date), "d 'de' MMM, yyyy", { locale: es });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getMonthRange(year: number, month: number) {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export function getMonthName(month: number): string {
  const date = new Date(2000, month);
  return format(date, 'MMMM', { locale: es });
}