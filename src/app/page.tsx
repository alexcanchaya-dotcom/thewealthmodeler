import Link from 'next/link';
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
} from '@heroicons/react/24/outline';
import CalculatorCard from '@/components/CalculatorCard';
import { HERO_CONTENT } from '@/lib/constants';

const popular = [
  {
    title: 'FIRE Calculator',
    description: 'Your FIRE number, years to independence, and a simple progress read.',
    icon: <DevicePhoneMobileIcon className="h-6 w-6" />,
    href: '/calculators/fire',
  },
  {
    title: 'Compound Interest',
    description: 'See growth with monthly contributions and a yearly breakdown.',
    icon: <ChartPieIcon className="h-6 w-6" />,
    href: '/calculators/compound-interest',
  },
  {
    title: 'Retirement Calculator',
    description: 'Nest egg, monthly income, and how long savings may last.',
    icon: <ShieldCheckIcon className="h-6 w-6" />,
    href: '/calculators/retirement',
  },
];

const irelandPopular = [
  {
    title: 'Irish Take-Home → FIRE',
    description: 'Irish take-home from salary, then years to FIRE.',
    icon: <CurrencyEuroIcon className="h-6 w-6" />,
    href: '/calculators/irish-take-home-fire',
  },
  {
    title: 'Mortgage repayment',
    description: 'Monthly cost at your quoted rate, plus a stress-rate check.',
    icon: <CreditCardIcon className="h-6 w-6" />,
    href: '/calculators/mortgage-repayment',
  },
  {
    title: 'Local Property Tax',
    description: 'Rough yearly LPT from market value and optional local adjust.',
    icon: <HomeIcon className="h-6 w-6" />,
    href: '/calculators/local-property-tax',
  },
];

const allCalculators = [
  { title: 'State Savings vs bank', description: 'State Savings (tax-free) vs bank deposit after 33% DIRT.', href: '/calculators/state-savings-vs-bank', icon: <BanknotesIcon className="h-5 w-5" /> },
  { title: 'Mortgage vs rent', description: 'Same home — renting or buying cheaper this month.', href: '/calculators/mortgage-vs-rent', icon: <HomeModernIcon className="h-5 w-5" /> },
  { title: 'Emergency fund months', description: 'How many months of essentials your cash covers.', href: '/calculators/emergency-fund-months', icon: <WalletIcon className="h-5 w-5" /> },
  { title: 'Pension vs take-home', description: 'Raise pension — take-home drop vs pot growth.', href: '/calculators/pension-vs-take-home', icon: <BriefcaseIcon className="h-5 w-5" /> },
  { title: 'Car finance vs cash', description: 'Finance monthly vs paying cash over the term.', href: '/calculators/car-finance-vs-cash', icon: <TruckIcon className="h-5 w-5" /> },
  { title: 'Rent rise vs move', description: 'Stay after a rent rise, or move over a horizon.', href: '/calculators/rent-rise-vs-move', icon: <ArrowTrendingUpIcon className="h-5 w-5" /> },
  { title: 'Mortgage overpay vs cash', description: 'Overpay €X/month — interest saved vs liquid cash.', href: '/calculators/mortgage-overpay-vs-cash', icon: <ScaleIcon className="h-5 w-5" /> },
  { title: 'Help to Buy deposit runway', description: 'Months to a deposit — optional Help to Buy boost.', href: '/calculators/help-to-buy-deposit-runway', icon: <KeyIcon className="h-5 w-5" /> },
  { title: 'State Pension / PRSI gap', description: 'How much State Pension covers — and the monthly gap.', href: '/calculators/state-pension-prsi-gap', icon: <BuildingLibraryIcon className="h-5 w-5" /> },
  { title: 'How much can I borrow', description: 'Rough mortgage from income and deposit (LTI / LTV).', href: '/calculators/how-much-can-i-borrow', icon: <ReceiptPercentIcon className="h-5 w-5" /> },
];

export default function HomePage() {
  return (
    <div className="space-y-20">
      <section className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div className="space-y-7">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Free calculators · no signup</p>
          <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl md:leading-[1.15]">{HERO_CONTENT.title}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted">{HERO_CONTENT.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculators/fire" className="btn-primary inline-flex items-center gap-2">
              {HERO_CONTENT.cta}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-mist bg-white/80 px-5 py-3 text-sm font-medium text-primary shadow-soft hover:bg-white"
            >
              How it works
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-mist/80 pt-5 text-sm text-muted">
            <span>100% free</span>
            <span className="hidden text-mist sm:inline">·</span>
            <span>Inputs stay on your device</span>
            <span className="hidden text-mist sm:inline">·</span>
            <span>Example numbers — not advice</span>
          </div>
        </div>

        <div className="rounded-card border border-mist/70 bg-gradient-hero p-6 shadow-soft">
          <div className="rounded-card border border-white/70 bg-white/75 p-5 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Start here</p>
            <h2 className="mt-2 text-xl font-semibold text-text">Ireland or FIRE — pick one calm path</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Free result first. No email wall. Irish tools use Irish-style defaults you can change.
            </p>
            <div className="mt-5 space-y-2">
              <Link href="/calculators/irish-take-home-fire" className="flex items-center justify-between rounded-xl bg-background/90 px-4 py-3 text-sm font-medium text-text transition hover:bg-white">
                Irish take-home → FIRE
                <ArrowRightIcon className="h-4 w-4 text-muted" />
              </Link>
              <Link href="/calculators/fire" className="flex items-center justify-between rounded-xl bg-background/90 px-4 py-3 text-sm font-medium text-text transition hover:bg-white">
                FIRE number
                <ArrowRightIcon className="h-4 w-4 text-muted" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Popular</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">Core planners</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {popular.map((item) => (
            <CalculatorCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">Ireland</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-text">Irish money questions</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Local badges stay on each calculator. Figures are examples — change them. Not advice.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {irelandPopular.map((item) => (
            <CalculatorCard key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">All calculators</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-text">Quieter full list</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {allCalculators.map((item) => (
            <CalculatorCard key={item.href} {...item} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
