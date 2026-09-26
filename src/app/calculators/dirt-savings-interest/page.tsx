'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  DIRT_SAVINGS_INTEREST_BADGE,
  DIRT_SAVINGS_INTEREST_DEPOSIT_HINT,
  DIRT_SAVINGS_INTEREST_DIRT_HINT,
  DIRT_SAVINGS_INTEREST_FOOTNOTE,
  DIRT_SAVINGS_INTEREST_RATE_HINT,
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import {
  DEFAULT_DEPOSIT,
  DEFAULT_DIRT_RATE_PERCENT,
  DEFAULT_GROSS_RATE_PERCENT,
  calculateDirtSavingsInterest,
  dirtHeadline,
} from '@/lib/dirt-savings-interest';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  deposit: number;
  grossRatePercent: number;
  dirtRatePercent: number;
}

const defaultValues: FormValues = {
  deposit: DEFAULT_DEPOSIT,
  grossRatePercent: DEFAULT_GROSS_RATE_PERCENT,
  dirtRatePercent: DEFAULT_DIRT_RATE_PERCENT,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function DirtSavingsInterestPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const deposit = Math.max(finiteNumber(values.deposit), 0);
  const grossRatePercent = Math.max(finiteNumber(values.grossRatePercent), 0);
  const dirtRatePercent = Math.max(finiteNumber(values.dirtRatePercent), 0);

  const result = useMemo(
    () =>
      calculateDirtSavingsInterest({
        deposit,
        grossRatePercent,
        dirtRatePercent,
      }),
    [deposit, grossRatePercent, dirtRatePercent]
  );

  const headline = dirtHeadline(deposit, grossRatePercent, result.netInterest, (value) => formatEuro(value));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge">
            {DIRT_SAVINGS_INTEREST_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">DIRT on savings interest</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            If your deposit earns this interest, how much DIRT is taken and what do you keep? Numbers update as you
            type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <InputField
              label="Deposit balance (€)"
              step="1"
              register={register('deposit', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.deposit}
              suffix="€"
            />
            <p className="text-xs text-ink-muted">{DIRT_SAVINGS_INTEREST_DEPOSIT_HINT}</p>
          </div>
          <div className="space-y-2">
            <InputField
              label="Gross interest rate (%)"
              step="0.01"
              register={register('grossRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.grossRatePercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{DIRT_SAVINGS_INTEREST_RATE_HINT}</p>
          </div>
          <div className="space-y-2">
            <InputField
              label="DIRT rate (%)"
              step="0.1"
              register={register('dirtRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.dirtRatePercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{DIRT_SAVINGS_INTEREST_DIRT_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{DIRT_SAVINGS_INTEREST_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Gross interest</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.grossInterest)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">DIRT tax</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.dirtTax)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Effective rate after DIRT</p>
              <p className="mt-1 text-xl font-bold text-white">{result.effectiveRatePercent.toFixed(1)}%</p>
            </div>
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
