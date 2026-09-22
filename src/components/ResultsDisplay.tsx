import { ReactNode } from 'react';
import { formatCurrency } from '@/lib/utils';

interface ResultsDisplayProps {
  title: string;
  rows: Array<{ label: string; value: number | string; highlight?: boolean }>;
  extra?: ReactNode;
  currency?: 'USD' | 'EUR';
}

export default function ResultsDisplay({ title, rows, extra, currency = 'USD' }: ResultsDisplayProps) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-glass-subtle px-4 py-3">
            <span className="text-sm font-semibold text-ink-body">{row.label}</span>
            <span className={`text-sm font-bold ${row.highlight ? 'text-[#9db8ff]' : 'text-white'}`}>
              {typeof row.value === 'number' ? formatCurrency(row.value, 0, currency) : row.value}
            </span>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}
