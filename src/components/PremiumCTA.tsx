import Link from 'next/link';
import { LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface PremiumCTAProps {
  feature: string;
  description: string;
}

export default function PremiumCTA({ feature, description }: PremiumCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-white p-6 shadow-card">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <LockClosedIcon className="h-5 w-5 text-primary" />
          <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-white">PRO</span>
          <span className="text-sm font-semibold text-gray-900">{feature}</span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <Link href="/pricing" className="btn-primary inline-flex items-center gap-2">
          <SparklesIcon className="h-4 w-4" />
          Unlock with Pro
        </Link>
      </div>
      <SparklesIcon className="absolute -right-4 -top-4 h-24 w-24 rotate-12 text-blue-100" />
    </div>
  );
}
