import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowRightIcon,
  ChartPieIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CurrencyEuroIcon,
  BanknotesIcon,
  HomeModernIcon,
  WalletIcon,
  BriefcaseIcon,
  TruckIcon,
  ArrowTrendingUpIcon,
  ScaleIcon,
  KeyIcon,
  BuildingLibraryIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  HomeIcon,
  PercentBadgeIcon,
} from '@heroicons/react/24/outline';
import CalculatorCard from '@/components/CalculatorCard';
import { HERO_CONTENT } from '@/lib/constants';

type Group = 'ireland' | 'investing';

interface CalculatorEntry {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  group: Group;
}

const iconClass = 'h-5 w-5';

const calculators: CalculatorEntry[] = [
  {
    title: 'Compound Interest',
    description: 'Project your investment growth with monthly contributions and see yearly breakdowns.',
    href: '/calculators/compound-interest',
    icon: <ChartPieIcon className={iconClass} />,
    group: 'investing',
  },
  {
    title: 'FIRE',
    description: 'Calculate your FIRE number, years until financial independence, and track your progress.',
    href: '/calculators/fire',
    icon: <DevicePhoneMobileIcon className={iconClass} />,
    group: 'investing',
  },
  {
    title: 'Retirement',
    description: 'Estimate your retirement balance, monthly income, and how long your savings can last.',
    href: '/calculators/retirement',
    icon: <ShieldCheckIcon className={iconClass} />,
    group: 'investing',
  },
  {
    title: 'Irish Take-Home → FIRE',
    description: 'Irish take-home from salary, then years to FIRE using Irish numbers.',
    href: '/calculators/irish-take-home-fire',
    icon: <CurrencyEuroIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'How much can I borrow',
    description: 'Roughly how much mortgage you could borrow from income and deposit — the lower of a simple LTI and LTV cap.',
    href: '/calculators/how-much-can-i-borrow',
    icon: <ReceiptPercentIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Mortgage repayment',
    description: 'What would this mortgage cost per month at your quoted rate — plus a higher stress-rate check.',
    href: '/calculators/mortgage-repayment',
    icon: <CreditCardIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'State Savings vs bank',
    description: 'Compare Irish State Savings (tax-free) with a bank deposit after 33% DIRT.',
    href: '/calculators/state-savings-vs-bank',
    icon: <BanknotesIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Mortgage vs rent',
    description: 'Same home, same month — is renting or buying cheaper using Irish-style numbers.',
    href: '/calculators/mortgage-vs-rent',
    icon: <HomeModernIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Emergency fund months',
    description: 'How many months of essential expenses your rainy-day cash covers.',
    href: '/calculators/emergency-fund-months',
    icon: <WalletIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Pension vs take-home',
    description: 'If you raise your pension, how much take-home drops after relief — and how much more hits the pot.',
    href: '/calculators/pension-vs-take-home',
    icon: <BriefcaseIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Car finance vs cash',
    description: 'Same car — monthly finance versus paying cash now. Which path costs less over the term.',
    href: '/calculators/car-finance-vs-cash',
    icon: <TruckIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Rent rise vs move',
    description: 'Landlord raises rent — cheaper to stay or move over a chosen horizon.',
    href: '/calculators/rent-rise-vs-move',
    icon: <ArrowTrendingUpIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Mortgage overpay vs cash',
    description: 'Overpay the mortgage by €X/month — interest saved and months cut versus keeping that cash liquid.',
    href: '/calculators/mortgage-overpay-vs-cash',
    icon: <ScaleIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Help to Buy deposit runway',
    description: 'How many months until you have the house deposit — optional Help to Buy boost shortens the runway.',
    href: '/calculators/help-to-buy-deposit-runway',
    icon: <KeyIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'State Pension / PRSI gap',
    description: 'How much of your retirement spend the State Pension covers, and the monthly gap to fill from savings.',
    href: '/calculators/state-pension-prsi-gap',
    icon: <BuildingLibraryIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'Local Property Tax',
    description: 'About how much Local Property Tax you might pay from property market value and an optional local adjustment.',
    href: '/calculators/local-property-tax',
    icon: <HomeIcon className={iconClass} />,
    group: 'ireland',
  },
  {
    title: 'DIRT on savings interest',
    description: 'If your deposit earns this interest, how much DIRT is taken and what you keep after tax.',
    href: '/calculators/dirt-savings-interest',
    icon: <PercentBadgeIcon className={iconClass} />,
    group: 'ireland',
  },
];

const byHref = (href: string) => calculators.find((c) => c.href === href)!;

// Short curated strips (UX brief §4) instead of a wall of identical CTA tiles.
const curated: Array<{ label: string; items: CalculatorEntry[] }> = [
  {
    label: 'Popular',
    items: ['/calculators/compound-interest', '/calculators/fire', '/calculators/retirement'].map(byHref),
  },
  {
    label: 'Ireland',
    items: ['/calculators/irish-take-home-fire', '/calculators/how-much-can-i-borrow', '/calculators/mortgage-repayment'].map(byHref),
  },
];

const allGroups: Array<{ label: string; group: Group }> = [
  { label: 'Ireland', group: 'ireland' },
  { label: 'Investing & retirement', group: 'investing' },
];

const trustPoints = ['100% free, no sign-up', 'Inputs stay on your device', 'Irish & US models', 'Example numbers, not advice'];

export default function HomePage() {
  return (
    <div className="space-y-24 md:space-y-28">
      <section className="mx-auto max-w-3xl space-y-8 pt-6 text-center md:pt-12">
        <h1 className="text-5xl font-semibold leading-[1.1] tracking-tight text-white md:text-6xl">{HERO_CONTENT.title}</h1>
        <p className="mx-auto max-w-2xl text-lg text-ink-body md:text-xl md:leading-relaxed">{HERO_CONTENT.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="#calculators" className="btn-primary gap-2">
            {HERO_CONTENT.cta}
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
          <Link href="/about" className="text-sm font-medium text-white/80 transition hover:text-white">
            Learn more
          </Link>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-sm text-ink-muted">
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary/80" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      </section>

      <section id="calculators" className="scroll-mt-24 space-y-14">
        {curated.map((strip) => (
          <div key={strip.label} className="space-y-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-muted">{strip.label}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {strip.items.map((calc) => (
                <CalculatorCard key={calc.href} title={calc.title} description={calc.description} icon={calc.icon} href={calc.href} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="all-calculators" className="scroll-mt-24 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">All calculators</h2>
          <p className="text-ink-body">Free result first. Change the example numbers to match your situation.</p>
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          {allGroups.map(({ label, group }) => (
            <div key={group} className="space-y-3">
              <h3 className="text-sm font-medium uppercase tracking-[0.16em] text-ink-muted">{label}</h3>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {calculators
                  .filter((c) => c.group === group)
                  .map((calc) => (
                    <li key={calc.href}>
                      <Link href={calc.href} className="group flex items-center justify-between gap-4 py-3.5">
                        <span className="text-sm font-medium text-white/90 transition group-hover:text-white">{calc.title}</span>
                        <ArrowRightIcon className="h-4 w-4 shrink-0 text-white/40 transition group-hover:translate-x-0.5 group-hover:text-white/80" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
