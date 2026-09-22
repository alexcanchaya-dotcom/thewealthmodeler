'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  PENSION_VS_TAKE_HOME_BADGE,
  PENSION_VS_TAKE_HOME_FOOTNOTE,
} from '@/lib/irish-copy';
import {
  RELIEF_RATE_HIGHER,
  RELIEF_RATE_STANDARD,
  calculatePensionVsTakeHome,
  takeHomeHeadline,
  type ReliefRate,
} from '@/lib/pension-vs-take-home';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  grossMonthly: number;
  currentPercent: number;
  newPercent: number;
  employerMatchPercent: number;
}

const defaultValues: FormValues = {
  grossMonthly: 4000,
  currentPercent: 5,
  newPercent: 8,
  employerMatchPercent: 0,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function PensionVsTakeHomePage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const [reliefRate, setReliefRate] = useState<ReliefRate>(RELIEF_RATE_HIGHER);
  const values = watch();

  const grossMonthly = Math.max(finiteNumber(values.grossMonthly), 0);
  const currentPercent = finiteNumber(values.currentPercent);
  const newPercent = finiteNumber(values.newPercent);
  const employerMatchPercent = Math.max(finiteNumber(values.employerMatchPercent), 0);

  const result = useMemo(
    () =>
      calculatePensionVsTakeHome({
        grossMonthly,
        currentPercent,
        newPercent,
        reliefRate,
        employerMatchPercent,
      }),
    [grossMonthly, currentPercent, newPercent, reliefRate, employerMatchPercent]
  );

  const headline = takeHomeHeadline(result.direction, result.netTakeHomeHit, (value) => formatEuro(value));
  const employerMatchEuro = (grossMonthly * employerMatchPercent) / 100;
  const netCostLabel = result.direction === 'decrease' ? 'Net gain to you' : 'Net cost to you';

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {PENSION_VS_TAKE_HOME_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Pension vs take-home</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            If you put more into your pension, how much does take-home drop after tax relief, and how much more goes
            into the pot? Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Gross monthly pay (€)"
            step="1"
            register={register('grossMonthly', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.grossMonthly}
            suffix="€"
          />
          <InputField
            label="Current employee pension % of gross"
            step="0.1"
            register={register('currentPercent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.currentPercent}
            suffix="%"
          />
          <InputField
            label="New employee pension % of gross"
            step="0.1"
            register={register('newPercent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.newPercent}
            suffix="%"
          />
          <InputField
            label="Optional employer match %"
            step="0.1"
            register={register('employerMatchPercent', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.employerMatchPercent}
            suffix="%"
          />

          <div className="sm:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-white">Your usual income-tax rate for relief</p>
              <div className="inline-flex rounded-lg border border-glass-line bg-glass-subtle p-1">
                <button
                  type="button"
                  onClick={() => setReliefRate(RELIEF_RATE_STANDARD)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    reliefRate === RELIEF_RATE_STANDARD ? 'bg-glass text-primary shadow-sm' : 'text-ink-body'
                  }`}
                >
                  20%
                </button>
                <button
                  type="button"
                  onClick={() => setReliefRate(RELIEF_RATE_HIGHER)}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    reliefRate === RELIEF_RATE_HIGHER ? 'bg-glass text-primary shadow-sm' : 'text-ink-body'
                  }`}
                >
                  40%
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{PENSION_VS_TAKE_HOME_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">{netCostLabel}</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(Math.abs(result.netTakeHomeHit))}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Extra into pot</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.extraIntoPot)}</p>
              {employerMatchPercent > 0 ? (
                <p className="mt-1 text-xs text-ink-muted">
                  Includes employer match of {formatEuro(employerMatchEuro)} / month
                </p>
              ) : null}
            </div>
          </div>
          <div className="rounded-lg bg-glass-subtle px-4 py-3">
            <p className="text-sm font-semibold text-ink-body">Annualised</p>
            <p className="mt-1 text-lg font-bold text-white">
              {formatEuro(Math.abs(result.annualisedNetCost))} / year
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              {formatEuro(Math.abs(result.netTakeHomeHit))} × 12
            </p>
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
