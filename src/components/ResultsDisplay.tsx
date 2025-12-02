import { ReactNode } from 'react';
import { formatCurrency } from '@/lib/utils';

interface ResultsDisplayProps {
  title: string;
  rows: Array<{ label: string; value: number | string; highlight?: boolean }>;
  extra?: ReactNode;
}

export default function ResultsDisplay({ title, rows, extra }: ResultsDisplayProps) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">{row.label}</span>
            <span className={`text-sm font-bold ${row.highlight ? 'text-primary' : 'text-gray-900'}`}>
              {typeof row.value === 'number' ? formatCurrency(row.value) : row.value}
            </span>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}
