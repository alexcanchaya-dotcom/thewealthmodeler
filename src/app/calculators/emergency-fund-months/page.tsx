'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EMERGENCY_FUND_BADGE,
  EMERGENCY_FUND_FOOTNOTE,
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import {
  BAND_MAX_MONTHS,
  BAND_MIN_MONTHS,
  calculateEmergencyFund,
  EXPENSES_GUARD_MESSAGE,
} from '@/lib/emergency-fund';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  monthlyExpenses: number;
  cash: number;
  monthlySurplus: number;
}

const defaultValues: FormValues = {
  monthlyExpenses: 2500,
  cash: 7500,
  monthlySurplus: 200,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function EmergencyFundMonthsPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const monthlyExpenses = finiteNumber(values.monthlyExpenses);
  const cash = Math.max(finiteNumber(values.cash), 0);
  const monthlySurplus = finiteNumber(values.monthlySurplus);

  const result = useMemo(() => calculateEmergencyFund({ monthlyExpenses, cash, monthlySurplus }), [
    monthlyExpenses,
    cash,
    monthlySurplus,
  ]);

  const headline =
    'error' in result ? EXPENSES_GUARD_MESSAGE : `You have ${result.monthsCovered.toFixed(1)} months covered`;

  const subline =
    'error' in result
      ? null
      : result.band === 'under'
        ? `Under the common 3–6 month band — short by ${formatEuro(result.shortfallToThree)} to reach 3 months`
        : result.band === 'inside'
          ? 'Inside the common 3–6 month band'
          : 'Above 6 months — solid cushion for many households';

  const rebuildLine =
    'error' in result || result.monthsToSix === null
      ? null
      : `About ${result.monthsToSix} months to reach 6 months at this surplus`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {EMERGENCY_FUND_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Emergency fund months</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            How many months of essential expenses your rainy-day cash covers. Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Monthly essential expenses (€)"
            step="1"
            register={register('monthlyExpenses', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.monthlyExpenses}
            suffix="€"
          />
          <InputField
            label="Cash / rainy-day savings (€)"
            step="1"
            register={register('cash', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.cash}
            suffix="€"
          />
          <InputField
            label="Monthly surplus you can save (€)"
            step="1"
            register={register('monthlySurplus', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.monthlySurplus}
            suffix="€"
          />
          <div className="flex flex-col justify-end gap-2">
            <p className="text-sm font-semibold text-white">Target band</p>
            <div className="rounded-lg border border-glass-line bg-glass-subtle px-4 py-3 text-sm text-ink-body">
              {BAND_MIN_MONTHS}–{BAND_MAX_MONTHS} months — fixed in this version
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{EMERGENCY_FUND_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            {subline ? <p className="mt-2 text-sm font-semibold text-ink-body">{subline}</p> : null}
          </div>

          {'error' in result ? null : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Rainy-day cash</p>
                <p className="mt-1 text-xl font-bold text-white">{formatEuro(cash)}</p>
              </div>
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Monthly essentials</p>
                <p className="mt-1 text-xl font-bold text-white">{formatEuro(monthlyExpenses)}</p>
              </div>
            </div>
          )}

          {rebuildLine ? (
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Months to rebuild to 6 months</p>
              <p className="mt-1 text-sm font-bold text-white">{rebuildLine}</p>
            </div>
          ) : null}

          <p className="text-sm text-ink-body">
            <a
              href={LONGEVITY_LINK_HREF}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              {LONGEVITY_LINK_TEXT}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
