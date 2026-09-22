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
    <div className="card space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-text">{title}</h3>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-xl border border-mist/70 bg-background/80 px-4 py-3.5">
            <span className="text-sm font-medium text-muted">{row.label}</span>
            <span className={`text-sm font-semibold ${row.highlight ? 'text-primary' : 'text-text'}`}>
              {typeof row.value === 'number' ? formatCurrency(row.value, 0, currency) : row.value}
            </span>
          </div>
        ))}
      </div>
      {extra}
    </div>
  );
}
