'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import MobileResultLine from '@/components/MobileResultLine';
import { EXAMPLE_NUMBERS_LINE, LONGEVITY_LINK_HREF, LONGEVITY_LINK_TEXT } from '@/lib/irish-copy';
import {
  DEFAULT_AMOUNT,
  DEFAULT_GROWTH_PERCENT,
  DEFAULT_YEARS,
  RATE_2026,
  RATE_FROM_2027,
  calculateExitTax,
  exitTaxHeadline,
} from '@/lib/exit-tax-etf-ireland';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  amount: number;
  growthPercent: number;
  years: number;
  ratePercent: string;
}

const defaultValues: FormValues = {
  amount: DEFAULT_AMOUNT,
  growthPercent: DEFAULT_GROWTH_PERCENT,
  years: DEFAULT_YEARS,
  ratePercent: String(RATE_FROM_2027),
};

const BUDGET_SPEECH =
  'https://www.gov.ie/en/department-of-finance/speeches/statement-by-minister-harris-on-budget-2027/';
const FINANCE_BILL =
  'https://www.gov.ie/en/department-of-finance/press-releases/department-of-finance-publishes-finance-bill-no2-2026/';
const REVENUE_TDM =
  'https://www.revenue.ie/en/tax-professionals/tdm/income-tax-capital-gains-tax-corporation-tax/part-27/27-04-01.pdf';

const fin = (v: number, f = 0) => (Number.isFinite(v) ? v : f);
const euro = (v: number, digits = 0) => formatCurrency(v, digits, 'EUR');

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
      {children}
    </a>
  );
}

export default function ExitTaxEtfIrelandPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const amount = Math.max(fin(values.amount), 0);
  const growthPercent = fin(values.growthPercent);
  const years = Math.max(Math.floor(fin(values.years)), 0);
  const ratePercent = Number(values.ratePercent) || RATE_FROM_2027;

  const result = useMemo(
    () => calculateExitTax({ amount, growthPercent, years, ratePercent }),
    [amount, growthPercent, years, ratePercent]
  );
  const headline = exitTaxHeadline(amount, result.leftAfterTax, (v) => euro(v));

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card min-w-0 space-y-4">
          <div className="space-y-3">
            <span className="badge badge-ie">Ireland — exit tax on ETFs (simplified)</span>
            <h1 className="text-2xl font-bold text-white">Exit tax on ETFs (Ireland)</h1>
            <MobileResultLine>{headline}</MobileResultLine>
            <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
            <p className="text-sm text-ink-body">
              If you put money into an Irish-domiciled ETF, how much exit tax is due on the gain and what is left?
              Numbers update as you type.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Amount invested (€)"
              step="1"
              register={register('amount', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.amount}
              suffix="€"
            />
            <InputField
              label="Annual growth (%)"
              step="0.1"
              register={register('growthPercent', { valueAsNumber: true, required: 'Required' })}
              error={formState.errors.growthPercent}
              suffix="%"
            />
            <InputField
              label="Years held"
              step="1"
              register={register('years', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.years}
              suffix="yrs"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="exit-tax-rate" className="text-sm font-medium text-white/90">
                Tax year of sale or charge
              </label>
              <select id="exit-tax-rate" className="input-base" {...register('ratePercent')}>
                <option value={String(RATE_FROM_2027)}>From 1 Jan 2027 — 35% (Budget 2027)</option>
                <option value={String(RATE_2026)}>Sold in 2026 — 38%</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-ink-muted">
            Simplified: one growth rate every year, no dividends, fees or other income, and the chosen rate is used for
            every charge. Losses can&apos;t be offset against other gains.
          </p>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="card space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink-body">Result</p>
              <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Final value', euro(result.finalValue, 2)],
                ['Gain', euro(result.gain, 2)],
                ['Exit tax', euro(result.totalTax, 2)],
                ['Left after tax', euro(result.leftAfterTax, 2)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-glass-subtle px-4 py-3">
                  <p className="text-sm font-semibold text-ink-body">{label}</p>
                  <p className="mt-1 text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
            {result.deemedDisposals.length > 0 && (
              <div className="space-y-1 text-sm text-ink-body">
                <p className="font-semibold">Deemed disposals (taxed even though not sold)</p>
                <ul className="list-disc space-y-1 pl-5">
                  {result.deemedDisposals.map((d) => (
                    <li key={d.year}>
                      Year {d.year}: value {euro(d.value, 2)}, tax {euro(d.tax, 2)}
                    </li>
                  ))}
                </ul>
                <p>
                  Tax at sale after credit for {euro(result.deemedTaxPaid, 2)} already paid: {euro(result.taxAtSale, 2)}
                </p>
              </div>
            )}
            {result.refundDue > 0 && (
              <p className="text-sm text-ink-body">
                The value fell after a deemed disposal, so tax at sale is €0 and about {euro(result.refundDue, 2)} of
                the earlier deemed-disposal tax may be refundable.
              </p>
            )}
            <p className="text-sm text-ink-body">
              The new Investment Account starts on 1 July 2027 with no deemed disposal.
            </p>
            <p className="text-sm text-ink-body">
              <a href={LONGEVITY_LINK_HREF} target="_blank" rel="noreferrer" className="tap-target font-semibold text-primary hover:underline">
                {LONGEVITY_LINK_TEXT}
              </a>
            </p>
          </div>
        </div>
      </div>

      <section className="card space-y-4 text-sm leading-relaxed text-ink-body">
        <h2 className="text-xl font-bold text-white">How exit tax on ETFs works, in plain English</h2>
        <p>
          In Ireland, most ETFs that are based in Ireland or another EU country are not taxed like shares. Instead of
          capital gains tax, the profit is taxed under the funds regime, usually called exit tax. You pay it on the gain:
          what you sell for, minus what you paid. You don&apos;t get the yearly capital gains tax allowance, and
          you can&apos;t use a loss on an ETF to reduce gains elsewhere. Losses can&apos;t be offset against other
          gains, so a fund that goes down simply means no exit tax on that fund.
        </p>
        <h3 className="text-lg font-semibold text-white">What rate applies?</h3>
        <p>
          The rate has been 38%. In Budget 2027, the Minister for Finance announced that the rate for investors in Irish
          and equivalent offshore funds will fall from 38% to 35% from 1 January 2027, and the Finance (No. 2) Bill 2026
          includes this change, saying the 35% rate will also apply to Irish-domiciled ETFs. The Bill still has to pass
          the Oireachtas, so check the final law. That is why this calculator lets you pick the tax year: choose 35% if
          the sale or charge happens from 1 January 2027, or 38% if you sell in 2026.
        </p>
        <h3 className="text-lg font-semibold text-white">The worked example</h3>
        <p>
          Put in €10,000, assume it grows 7% a year, and sell after 8 years. It grows to about €17,181.86, a gain of
          €7,181.86. At 35%, the exit tax is €2,513.65, leaving about €14,668. If the same sale happened in 2026 at 38%,
          the tax would be €2,729.11, leaving €14,452.75. The difference is about €215 on this example.
        </p>
        <h3 className="text-lg font-semibold text-white">Deemed disposal: the 8-year rule</h3>
        <p>
          The unusual part of the Irish rules is deemed disposal. Every 8 years after you buy, you are treated as if you
          sold and bought back the holding, even if you did nothing. Tax is charged on the gain up to that point, and you
          have to pay it out of your own pocket because nothing was actually sold. When you finally sell, you work out the
          exit tax on the whole gain since you bought, then take off the tax you already paid on deemed disposals, so the
          same gain is not taxed twice.
        </p>
        <p>
          For example, hold the same €10,000 for 16 years at 7%. At year 8 there is a deemed disposal and about
          €2,513.65 of tax is due. By year 16 the holding is worth about €29,521.64, a total gain of €19,521.64. The tax
          on that whole gain at 35% is about €6,832.57. Taking off the €2,513.65 already paid leaves about €4,318.92 due
          when you sell.
        </p>
        <p>
          If the value drops after a deemed disposal, the tax worked out at sale can be smaller than the tax you already
          paid. In that case nothing more is due at sale, and you may be able to claim back the difference. This
          calculator shows a note when that happens.
        </p>
        <h3 className="text-lg font-semibold text-white">What this calculator leaves out</h3>
        <p>
          Real investments don&apos;t grow by the same amount every year. This page ignores dividends (which are also
          taxed), fund fees, broker costs, buying in more than one go, and the fact that a deemed disposal and a later
          sale could fall in different tax years with different rates. It uses the chosen rate for every charge. It also
          only covers ETFs taxed under the funds regime; some ETFs based outside the EU are taxed differently. Use it to
          get a feel for the numbers, then check the details with Revenue or a qualified adviser.
        </p>
        <h3 className="text-lg font-semibold text-white">The new Investment Account</h3>
        <p>
          The new Investment Account starts on 1 July 2027 with no deemed disposal. Instead, there is a flat 1% tax on
          the value above €50,000 each year, with a €12,000 yearly contribution limit, and the provider handles the tax.
        </p>
        <h3 className="text-lg font-semibold text-white">Sources</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <Source href={BUDGET_SPEECH}>Statement by Minister Harris on Budget 2027 (gov.ie)</Source> — 38% to 35%
            from 1 January 2027; Investment Account from 1 July 2027.
          </li>
          <li>
            <Source href={FINANCE_BILL}>Department of Finance publishes Finance (No. 2) Bill 2026 (gov.ie)</Source> —
            rate cut to 35%, including Irish-domiciled ETFs.
          </li>
          <li>
            <Source href={REVENUE_TDM}>Revenue Tax and Duty Manual Part 27-04-01 (PDF)</Source> — current 38% rate,
            the 8-year deemed disposal and credit for tax already paid.
          </li>
        </ul>
      </section>
    </div>
  );
}
