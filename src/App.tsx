import { useEffect, useState } from 'react';
import { seedCategories } from './db/seed';
import { LayoutDashboard, Receipt, Tag, Settings } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Categories from './pages/Categories';
import SettingsPage from './pages/Settings';
import { useTheme } from './hooks/useTheme';

type Page = 'dashboard' | 'expenses' | 'categories' | 'settings';

const tabs: { key: Page; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { key: 'expenses', label: 'Gastos', icon: <Receipt size={20} /> },
  { key: 'categories', label: 'Categorías', icon: <Tag size={20} /> },
  { key: 'settings', label: 'Ajustes', icon: <Settings size={20} /> },
];

function App() {
  const [ready, setReady] = useState(false);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    seedCategories().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">App de Gastos</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-20">
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'expenses' && <Expenses />}
        {activePage === 'categories' && <Categories />}
        {activePage === 'settings' && <SettingsPage theme={theme} setTheme={setTheme} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActivePage(tab.key)}
              className={`flex flex-col items-center gap-1 py-2 px-3 flex-1 text-xs font-medium transition-colors ${
                activePage === tab.key
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
