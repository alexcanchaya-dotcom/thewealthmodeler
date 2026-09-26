import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

// Whole card is the link: one quiet affordance instead of a "Calculate Now" button per tile.
export default function CalculatorCard({ title, description, icon, href }: CalculatorCardProps) {
  return (
    <Link href={href} className="card card-interactive group flex flex-col gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 ring-1 ring-inset ring-white/15">
        {icon}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-ink-body">{description}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9db8ff] transition group-hover:gap-2.5">
        Open calculator
        <ArrowRightIcon className="h-4 w-4" />
      </span>
    </Link>
  );
}
