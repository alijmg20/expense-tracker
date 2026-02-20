import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthName } from '../utils/dateUtils';

interface MonthFilterProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthFilter({ month, year, onChange }: MonthFilterProps) {
  const handlePrev = () => {
    if (month === 0) {
      onChange(11, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (month === 11) {
      onChange(0, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 mb-4">
      <button onClick={handlePrev} className="p-1 text-gray-400 hover:text-gray-600">
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm font-semibold text-gray-800 capitalize">
        {getMonthName(month)} {year}
      </span>
      <button onClick={handleNext} className="p-1 text-gray-400 hover:text-gray-600">
        <ChevronRight size={20} />
      </button>
    </div>
  );
}