import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';

export function useBudget(year: number, month: number) {
  const budget = useLiveQuery(
    () => db.monthlyBudgets
      .where('[year+month]')
      .equals([year, month])
      .first(),
    [year, month]
  );

  const setBudget = async (totalBudget: number) => {
    const existing = await db.monthlyBudgets
      .where('[year+month]')
      .equals([year, month])
      .first();

    if (existing?.id) {
      await db.monthlyBudgets.update(existing.id, { totalBudget });
    } else {
      await db.monthlyBudgets.add({ year, month, totalBudget });
    }
  };

  return { budget: budget ?? null, setBudget };
}