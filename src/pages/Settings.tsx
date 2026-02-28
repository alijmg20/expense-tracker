import { useState } from 'react';
import { Download, Upload, AlertTriangle, Sun, Moon, Monitor } from 'lucide-react';
import { db } from '../db/database';
import type { Theme } from '../hooks/useTheme';

interface SettingsProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export default function Settings({ theme, setTheme }: SettingsProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    const categories = await db.categories.toArray();
    const expenses = await db.expenses.toArray();
    const monthlyBudgets = await db.monthlyBudgets.toArray();

    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      categories,
      expenses,
      monthlyBudgets,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.version || !data.categories || !data.expenses) {
        throw new Error('Formato inválido');
      }

      await db.transaction('rw', db.categories, db.expenses, db.monthlyBudgets, async () => {
        await db.categories.clear();
        await db.expenses.clear();
        await db.monthlyBudgets.clear();

        await db.categories.bulkPut(data.categories);

        await db.expenses.bulkPut(data.expenses);

        if (data.monthlyBudgets) {
          await db.monthlyBudgets.bulkPut(data.monthlyBudgets);
        }
      });

      setImportStatus('success');
    } catch {
      setImportStatus('error');
    }

    e.target.value = '';
  };

  const themeOptions: { key: Theme; label: string; icon: React.ReactNode }[] = [
    { key: 'system', label: 'Sistema', icon: <Monitor size={14} /> },
    { key: 'light', label: 'Claro', icon: <Sun size={14} /> },
    { key: 'dark', label: 'Oscuro', icon: <Moon size={14} /> },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Configuración</h2>

      <div className="flex flex-col gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Apariencia</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Selecciona el tema de la aplicación.
          </p>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {themeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setTheme(opt.key)}
                className={`flex items-center justify-center gap-1.5 flex-1 py-2 rounded-md text-xs font-medium transition-all ${
                  theme === opt.key
                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Exportar datos</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
            Descarga un archivo JSON con todos tus gastos, categorías y presupuestos.
          </p>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors w-full justify-center"
          >
            <Download size={16} />
            Descargar backup
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Importar datos</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
            Restaura un backup desde un archivo JSON.
          </p>
          <p className="text-xs text-red-400 mb-3 flex items-center gap-1">
            <AlertTriangle size={12} />
            Esto reemplazará todos los datos actuales.
          </p>
          <label className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer w-full justify-center">
            <Upload size={16} />
            Seleccionar archivo
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>

        {importStatus === 'success' && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm px-4 py-3 rounded-lg">
            Datos importados correctamente.
          </div>
        )}

        {importStatus === 'error' && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
            Error al importar. Verifica que el archivo sea un backup válido.
          </div>
        )}
      </div>
    </div>
  );
}
