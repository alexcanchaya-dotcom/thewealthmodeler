'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  STATE_PENSION_COMPLETENESS_HINT,
  STATE_PENSION_PRSI_GAP_BADGE,
  STATE_PENSION_PRSI_GAP_FOOTNOTE,
  STATE_PENSION_WEEKLY_HINT,
} from '@/lib/irish-copy';
import {
  DEFAULT_COMPLETENESS_PERCENT,
  DEFAULT_OTHER_INCOME_MONTHLY,
  DEFAULT_TARGET_MONTHLY,
  DEFAULT_WEEKLY_STATE_PENSION,
  calculateStatePensionPrsiGap,
  gapHeadline,
} from '@/lib/state-pension-prsi-gap';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  targetMonthly: number;
  weeklyStatePension: number;
  completenessPercent: number;
  otherIncomeMonthly: number;
}

const defaultValues: FormValues = {
  targetMonthly: DEFAULT_TARGET_MONTHLY,
  weeklyStatePension: DEFAULT_WEEKLY_STATE_PENSION,
  completenessPercent: DEFAULT_COMPLETENESS_PERCENT,
  otherIncomeMonthly: DEFAULT_OTHER_INCOME_MONTHLY,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function StatePensionPrsiGapPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const targetMonthly = Math.max(finiteNumber(values.targetMonthly), 0);
  const weeklyStatePension = Math.max(finiteNumber(values.weeklyStatePension), 0);
  const completenessPercent = Math.max(finiteNumber(values.completenessPercent), 0);
  const otherIncomeMonthly = Math.max(finiteNumber(values.otherIncomeMonthly), 0);

  const result = useMemo(
    () =>
      calculateStatePensionPrsiGap({
        targetMonthly,
        weeklyStatePension,
        completenessPercent,
        otherIncomeMonthly,
      }),
    [targetMonthly, weeklyStatePension, completenessPercent, otherIncomeMonthly]
  );

  const headline = gapHeadline(result.gapMonthly, (value) => formatEuro(value));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge badge-ie">
            {STATE_PENSION_PRSI_GAP_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">State Pension / PRSI gap</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            How much of your retirement spend the State Pension covers, and the monthly gap to fill from savings.
            Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Target monthly spend in retirement (€)"
            step="1"
            register={register('targetMonthly', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.targetMonthly}
            suffix="€"
          />
          <div className="space-y-2">
            <InputField
              label="Expected full State Pension (€ / week)"
              step="0.01"
              register={register('weeklyStatePension', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.weeklyStatePension}
              suffix="€"
            />
            <p className="text-xs text-ink-muted">{STATE_PENSION_WEEKLY_HINT}</p>
          </div>
          <div className="space-y-2">
            <InputField
              label="PRSI / contribution completeness (%)"
              step="1"
              register={register('completenessPercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
                max: { value: 100, message: 'Must be <= 100' },
              })}
              error={formState.errors.completenessPercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{STATE_PENSION_COMPLETENESS_HINT}</p>
          </div>
          <InputField
            label="Optional private pension / other income (€ / month)"
            step="1"
            register={register('otherIncomeMonthly', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.otherIncomeMonthly}
            suffix="€"
          />
        </div>

        <p className="text-xs text-ink-muted">{STATE_PENSION_PRSI_GAP_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Target</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(targetMonthly)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">State Pension/mo</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.statePensionMonthly)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Other</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(otherIncomeMonthly)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Gap</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.gapMonthly)}</p>
            </div>
          </div>

          <div className="rounded-lg bg-glass-subtle px-4 py-3">
            <p className="text-sm font-semibold text-ink-body">Annual gap</p>
            <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.gapAnnual)}</p>
          </div>

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
