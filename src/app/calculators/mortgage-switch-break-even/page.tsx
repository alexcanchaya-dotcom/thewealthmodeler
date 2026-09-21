'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  MORTGAGE_SWITCH_BREAK_EVEN_BADGE,
  MORTGAGE_SWITCH_BREAK_EVEN_CURRENT_RATE_HINT,
  MORTGAGE_SWITCH_BREAK_EVEN_FEES_HINT,
  MORTGAGE_SWITCH_BREAK_EVEN_FOOTNOTE,
  MORTGAGE_SWITCH_BREAK_EVEN_NEW_RATE_HINT,
} from '@/lib/irish-copy';
import {
  DEFAULT_CURRENT_RATE_PERCENT,
  DEFAULT_NEW_RATE_PERCENT,
  DEFAULT_REMAINING_BALANCE,
  DEFAULT_REMAINING_TERM_YEARS,
  DEFAULT_SWITCH_FEES,
  calculateMortgageSwitchBreakEven,
  switchBreakEvenHeadline,
} from '@/lib/mortgage-switch-break-even';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  remainingBalance: number;
  currentRatePercent: number;
  newRatePercent: number;
  remainingTermYears: number;
  switchFees: number;
}

const defaultValues: FormValues = {
  remainingBalance: DEFAULT_REMAINING_BALANCE,
  currentRatePercent: DEFAULT_CURRENT_RATE_PERCENT,
  newRatePercent: DEFAULT_NEW_RATE_PERCENT,
  remainingTermYears: DEFAULT_REMAINING_TERM_YEARS,
  switchFees: DEFAULT_SWITCH_FEES,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function MortgageSwitchBreakEvenPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const remainingBalance = Math.max(finiteNumber(values.remainingBalance), 0);
  const currentRatePercent = Math.max(finiteNumber(values.currentRatePercent), 0);
  const newRatePercent = Math.max(finiteNumber(values.newRatePercent), 0);
  const remainingTermYears = Math.max(finiteNumber(values.remainingTermYears), 0);
  const switchFees = Math.max(finiteNumber(values.switchFees), 0);

  const result = useMemo(
    () =>
      calculateMortgageSwitchBreakEven({
        remainingBalance,
        currentRatePercent,
        newRatePercent,
        remainingTermYears,
        switchFees,
      }),
    [remainingBalance, currentRatePercent, newRatePercent, remainingTermYears, switchFees]
  );

  const headline = switchBreakEvenHeadline(remainingBalance, result.monthlySaving, result.breakEvenMonths);
  const recoveredLine =
    result.breakEvenMonths === null
      ? null
      : `Fees recovered after ${result.breakEvenMonths.toFixed(1)} months`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {MORTGAGE_SWITCH_BREAK_EVEN_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Mortgage switch break-even</h1>
          <p className="mt-1 text-sm text-gray-700">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-gray-600">
            If you switch to a cheaper rate, how long until the one-off switch fees are paid back? Numbers update as you
            type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Remaining balance (€)"
            step="1"
            register={register('remainingBalance', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.remainingBalance}
            suffix="€"
          />
          <div className="space-y-2">
            <InputField
              label="Current rate (%)"
              step="0.01"
              register={register('currentRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.currentRatePercent}
              suffix="%"
            />
            <p className="text-xs text-gray-500">{MORTGAGE_SWITCH_BREAK_EVEN_CURRENT_RATE_HINT}</p>
          </div>
          <div className="space-y-2">
            <InputField
              label="New rate (%)"
              step="0.01"
              register={register('newRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.newRatePercent}
              suffix="%"
            />
            <p className="text-xs text-gray-500">{MORTGAGE_SWITCH_BREAK_EVEN_NEW_RATE_HINT}</p>
          </div>
          <InputField
            label="Remaining term years"
            step="1"
            register={register('remainingTermYears', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Must be >= 1' },
              max: { value: 50, message: 'Too long for this sketch' },
            })}
            error={formState.errors.remainingTermYears}
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Switch fees (€)"
              step="1"
              register={register('switchFees', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.switchFees}
              suffix="€"
            />
            <p className="text-xs text-gray-500">{MORTGAGE_SWITCH_BREAK_EVEN_FEES_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">{MORTGAGE_SWITCH_BREAK_EVEN_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            {recoveredLine ? <p className="mt-2 text-sm text-gray-700">{recoveredLine}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Current monthly</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.currentMonthly)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">New monthly</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.newMonthly)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Monthly saving</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.monthlySaving)}</p>
            </div>
          </div>

          <p className="text-sm text-gray-700">
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
