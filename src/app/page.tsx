import Link from 'next/link';
import { ArrowRightIcon, ChartPieIcon, ShieldCheckIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import CalculatorCard from '@/components/CalculatorCard';
import EmailCapture from '@/components/EmailCapture';
import AdUnit from '@/components/AdUnit';
import { HERO_CONTENT } from '@/lib/constants';

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-2xl bg-white/80 p-8 shadow-card backdrop-blur md:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary">
            Finance Toolkit
          </div>
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">{HERO_CONTENT.title}</h1>
          <p className="text-lg text-gray-600">{HERO_CONTENT.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculators/compound-interest" className="btn-primary inline-flex items-center gap-2">
              {HERO_CONTENT.cta}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-100 px-5 py-3 text-sm font-semibold text-primary hover:bg-blue-50"
            >
              Learn More
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ label: 'Total Users', value: '100% Free' }, { label: 'Data Privacy', value: 'No tracking' }, { label: 'Mobile Friendly', value: 'Responsive' }].map(
              (item) => (
                <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">{item.label}</p>
                  <p className="text-sm font-bold text-gray-900">{item.value}</p>
                </div>
              )
            )}
          </div>
        </div>
        <div className="grid gap-4 rounded-xl bg-gradient-primary p-6 text-white shadow-inner">
          <div className="rounded-xl border border-white/20 bg-white/10 p-4">
            <h3 className="text-lg font-semibold">Built for FIRE & Retirement</h3>
            <p className="text-sm text-blue-50">
              Explore calculators tailored for compound growth, Financial Independence (FIRE), and retirement planning. Visualize your
              path with charts and year-by-year projections.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Compound Interest', description: 'See how your investments grow with recurring contributions.' },
              { title: 'FIRE Number', description: 'Identify your target number to reach financial independence.' },
              { title: 'Retirement', description: 'Plan your nest egg and spending horizon confidently.' },
              { title: 'Mobile Friendly', description: 'Access your plan anywhere with responsive layouts.' },
            ].map((item) => (
              <div key={item.title} className="rounded-lg bg-white/10 p-4 shadow-sm">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-blue-50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad unit below the hero */}
      <AdUnit slot="1111111111" format="horizontal" />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-primary">Tools</p>
            <h2 className="text-2xl font-bold text-gray-900">Featured Calculators</h2>
          </div>
          <Link href="/calculators/compound-interest" className="hidden items-center gap-2 text-sm font-semibold text-primary md:inline-flex">
            View all calculators
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <CalculatorCard
            title="Compound Interest Calculator"
            description="Project your investment growth with monthly contributions and see yearly breakdowns."
            icon={<ChartPieIcon className="h-6 w-6" />}
            href="/calculators/compound-interest"
          />
          <CalculatorCard
            title="Retirement Calculator"
            description="Estimate your retirement balance, monthly income, and how long your savings can last."
            icon={<ShieldCheckIcon className="h-6 w-6" />}
            href="/calculators/retirement"
          />
          <CalculatorCard
            title="FIRE Calculator"
            description="Calculate your FIRE number, years until financial independence, and track your progress."
            icon={<DevicePhoneMobileIcon className="h-6 w-6" />}
            href="/calculators/fire"
          />
        </div>
      </section>

      {/* Email newsletter capture */}
      <EmailCapture />

      <section className="grid gap-6 rounded-2xl bg-white p-8 shadow-card md:grid-cols-3">
        {[{ title: '100% Free', desc: 'No paywalls or subscriptions. Calculate as much as you want.' }, { title: 'Data Privacy', desc: 'Your inputs stay on your device—no account required.' }, { title: 'Mobile Friendly', desc: 'Designed with responsive layouts for phones and tablets.' }].map(
          (benefit) => (
            <div key={benefit.title} className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.desc}</p>
            </div>
          )
        )}
      </section>

      {/* Bottom ad unit */}
      <AdUnit slot="2222222222" format="rectangle" />
    </div>
  );
}
