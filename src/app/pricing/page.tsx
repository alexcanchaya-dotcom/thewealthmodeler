import Link from 'next/link';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing – The Wealth Modeler',
  description: 'Choose the plan that fits your financial independence journey. Free forever or upgrade to Pro for PDF exports, ad-free experience, and more.',
};

const FREE_FEATURES = [
  'All 3 calculators (Compound Interest, FIRE, Retirement)',
  'Real-time results & charts',
  'Scenario comparisons (Coast FIRE, Barista FIRE)',
  'Mobile-friendly responsive design',
  'Privacy-first — no data stored server-side',
];

const FREE_MISSING = [
  'PDF / print export (clean, ad-free)',
  'Saved scenarios (cloud sync)',
  'Advanced tax-adjusted calculations',
  'Priority email support',
  'Ad-free experience',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Clean PDF export of all results',
  'Save & sync unlimited scenarios',
  'Tax-adjusted net return calculator',
  'Social Security income integrator',
  'Ad-free experience across all pages',
  'Priority email support',
  'Early access to new calculators',
];

export default function PricingPage() {
  return (
    <div className="space-y-16">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
          Pricing
        </div>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">Simple, transparent pricing</h1>
        <p className="mt-3 text-lg text-gray-600">
          Start free. Upgrade when you need more firepower on your path to FIRE.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Free Tier */}
        <div className="card space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Free Forever</p>
            <p className="mt-1 text-4xl font-bold text-gray-900">$0</p>
            <p className="text-sm text-gray-500">No credit card required</p>
          </div>

          <Link
            href="/calculators/compound-interest"
            className="block w-full rounded-lg border-2 border-primary px-6 py-3 text-center text-sm font-bold text-primary transition hover:bg-blue-50"
          >
            Get Started Free
          </Link>

          <ul className="space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                {f}
              </li>
            ))}
            {FREE_MISSING.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-gray-400">
                <XMarkIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-300" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-card">
          <div className="space-y-6">
            <div>
              <div className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Pro
              </div>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-4xl font-bold">$7</p>
                <p className="mb-1 text-blue-200">/ month</p>
              </div>
              <p className="text-sm text-blue-200">or $59/year — save 30%</p>
            </div>

            <button
              className="w-full rounded-lg bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-blue-50"
              onClick={() => alert('Stripe integration coming soon! Sign up to be notified.')}
            >
              Upgrade to Pro
            </button>

            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white">
                  <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-200" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              q: 'Will the free tier always be free?',
              a: 'Yes. All core calculators — Compound Interest, FIRE, and Retirement — will remain free forever. We believe financial education should be accessible to everyone.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We use Stripe for secure card payments. We accept all major credit and debit cards. Annual plans can also be paid via bank transfer.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Absolutely. Cancel at any time from your account settings. You keep Pro access until the end of your billing period.',
            },
            {
              q: 'Is my financial data stored on your servers?',
              a: 'No. All calculations run entirely in your browser. Pro features like saved scenarios use encrypted cloud storage with your explicit consent.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-1">
              <p className="text-sm font-bold text-gray-900">{q}</p>
              <p className="text-sm text-gray-600">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
