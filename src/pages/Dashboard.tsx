import { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import { useCategories } from '../hooks/useCategories';
import { useBudget } from '../hooks/useBudget';
import MonthFilter from '../components/MonthFilter';
import BudgetInput from '../components/BudgetInput';
import { formatCurrency, getMonthRange } from '../utils/dateUtils';
import { getDaysInMonth } from 'date-fns';

export default function Dashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const { expenses } = useExpenses();
  const { categories } = useCategories();
  const { budget, setBudget } = useBudget(year, month);

  const { start, end } = getMonthRange(year, month);
  const monthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= start && d <= end;
  });

  const totalMonth = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const { start: prevStart, end: prevEnd } = getMonthRange(prevYear, prevMonth);
  const prevMonthExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d >= prevStart && d <= prevEnd;
  });
  const totalPrevMonth = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthChange = totalPrevMonth > 0
    ? Math.round(((totalMonth - totalPrevMonth) / totalPrevMonth) * 100)
    : null;

  const yearExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year;
  });
  const totalYear = yearExpenses.reduce((sum, e) => sum + e.amount, 0);

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const today = now.getDate();
  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();
  const daysElapsed = isCurrentMonth ? today : daysInMonth;
  const dailyAverage = daysElapsed > 0 ? totalMonth / daysElapsed : 0;
  const projected = dailyAverage * daysInMonth;

  const budgetAmount = budget?.totalBudget ?? 0;
  const remaining = budgetAmount > 0 ? budgetAmount - totalMonth : 0;
  const usagePercent = budgetAmount > 0 ? Math.round((totalMonth / budgetAmount) * 100) : 0;

  const expensesByCategory = categories
    .map((cat) => {
      const catTotal = monthExpenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return { ...cat, total: catTotal };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  const fixedTotal = monthExpenses
    .filter((e) => {
      const cat = categories.find((c) => c.id === e.categoryId);
      return cat?.type === 'fixed';
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const variableTotal = totalMonth - fixedTotal;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Panel de Control</h2>

      <MonthFilter
        month={month}
        year={year}
        onChange={(m, y) => { setMonth(m); setYear(y); }}
      />

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">Presupuesto mensual</span>
        </div>
        <BudgetInput currentBudget={budget?.totalBudget ?? null} onSave={setBudget} />

        {budgetAmount > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">{usagePercent}% usado</span>
              <span className={remaining >= 0 ? 'text-green-600' : 'text-red-500'}>
                {remaining >= 0 ? 'Restante: ' : 'Excedido: '}
                {formatCurrency(Math.abs(remaining))}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  usagePercent > 100 ? 'bg-red-500' :
                  usagePercent > 80 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <span className="text-sm text-gray-400">Total del mes</span>
          <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(totalMonth)}</p>
          {monthChange !== null && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                monthChange > 0
                  ? 'bg-red-50 text-red-500'
                  : monthChange < 0
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-50 text-gray-400'
              }`}>
                {monthChange > 0 ? '+' : ''}{monthChange}%
              </span>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <span className="text-sm text-gray-400">Total del año</span>
          <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(totalYear)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <span className="text-sm text-gray-400">Promedio diario</span>
          <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(dailyAverage)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <span className="text-sm text-gray-400">Proyección mes</span>
          <p className={`text-xl font-bold mt-1 ${
            budgetAmount > 0 && projected > budgetAmount ? 'text-red-500' : 'text-gray-800'
          }`}>
            {formatCurrency(projected)}
          </p>
        </div>
      </div>

      {(fixedTotal > 0 || variableTotal > 0) && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
          <span className="text-sm text-gray-400 block mb-3">Fijo vs Variable</span>
          <div className="flex gap-2 mb-2">
            <div className="h-3 rounded-full bg-blue-500" style={{ flex: fixedTotal }} />
            <div className="h-3 rounded-full bg-emerald-500" style={{ flex: variableTotal }} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Fijo: {formatCurrency(fixedTotal)} ({totalMonth > 0 ? Math.round((fixedTotal / totalMonth) * 100) : 0}%)
            </span>
            <span className="text-gray-600">
              Variable: {formatCurrency(variableTotal)} ({totalMonth > 0 ? Math.round((variableTotal / totalMonth) * 100) : 0}%)
            </span>
          </div>
        </div>
      )}

      {expensesByCategory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <span className="text-sm text-gray-400 block mb-3">Gasto por categoría</span>
          <div className="flex flex-col gap-3">
            {expensesByCategory.map((cat) => {
              const percent = totalMonth > 0 ? Math.round((cat.total / totalMonth) * 100) : 0;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-base text-gray-700">{cat.name}</span>
                    </div>
                    <span className="text-base font-medium text-gray-800">{formatCurrency(cat.total)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${percent}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {monthExpenses.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mt-4">
          <span className="text-sm text-gray-400 block mb-3">Últimos gastos</span>
          <div className="flex flex-col gap-3">
            {monthExpenses.slice(0, 3).map((expense) => {
              const category = categories.find((c) => c.id === expense.categoryId);
              return (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: category?.color ?? '#6b7280' }}
                    />
                    <div className="min-w-0">
                      <p className="text-base text-gray-700 truncate">{expense.title}</p>
                      <p className="text-sm text-gray-400">{category?.name}</p>
                    </div>
                  </div>
                  <span className="text-base font-medium text-gray-800 shrink-0 ml-3">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}