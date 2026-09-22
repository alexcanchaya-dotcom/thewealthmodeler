import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  compact?: boolean;
}

export default function CalculatorCard({ title, description, icon, href, compact = false }: CalculatorCardProps) {
  if (compact) {
    return (
      <Link
        href={href}
        className="group flex items-start justify-between gap-3 rounded-card border border-mist/80 bg-white/80 px-4 py-3.5 shadow-soft transition hover:border-accent/30 hover:bg-white"
      >
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-text group-hover:text-primary">{title}</p>
          <p className="text-xs leading-relaxed text-muted">{description}</p>
        </div>
        <ArrowRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:text-primary" />
      </Link>
    );
  }

  return (
    <div className="card flex flex-col gap-5">
      <div className="flex items-center gap-3 text-primary">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist/80 text-primary">{icon}</div>
        <h3 className="text-lg font-semibold leading-snug text-text">{title}</h3>
      </div>
      <p className="flex-1 text-sm leading-relaxed text-muted">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:gap-3"
      >
        Open calculator
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
