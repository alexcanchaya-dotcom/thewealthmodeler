import Link from 'next/link';
import { ReactNode } from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function CalculatorCard({ title, description, icon, href }: CalculatorCardProps) {
  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center gap-3 text-primary">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="flex-1 text-sm text-gray-600">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Calculate Now
      </Link>
    </div>
  );
}
