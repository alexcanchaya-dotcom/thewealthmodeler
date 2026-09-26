'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  RENT_RISE_VS_MOVE_BADGE,
  RENT_RISE_VS_MOVE_FOOTNOTE,
} from '@/lib/irish-copy';
import {
  breakEvenCopy,
  calculateRentRiseVsMove,
  comparisonHeadline,
} from '@/lib/rent-rise-vs-move';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface FormValues {
  currentRent: number;
  newRent: number;
  moveCost: number;
  horizonMonths: number;
  newPlaceRent: number;
}

const defaultValues: FormValues = {
  currentRent: 1800,
  newRent: 1980,
  moveCost: 2500,
  horizonMonths: 12,
  newPlaceRent: 1800,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function RentRiseVsMovePage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const currentRent = Math.max(finiteNumber(values.currentRent), 0);
  const newRent = Math.max(finiteNumber(values.newRent), 0);
  const moveCost = Math.max(finiteNumber(values.moveCost), 0);
  const horizonMonths = Math.max(finiteNumber(values.horizonMonths), 0);
  const newPlaceRent = Math.max(finiteNumber(values.newPlaceRent, currentRent), 0);

  const result = useMemo(
    () =>
      calculateRentRiseVsMove({
        currentRent,
        newRent,
        moveCost,
        horizonMonths,
        newPlaceRent,
      }),
    [currentRent, newRent, moveCost, horizonMonths, newPlaceRent]
  );

  const headline = comparisonHeadline(result.winner, result.difference, result.horizonMonths, (value) =>
    formatEuro(value)
  );
  const paybackLine = breakEvenCopy(result.extraPerMonth, result.breakEvenMonths);
  const breakEvenLabel =
    result.breakEvenMonths === null ? '—' : `~${formatNumber(result.breakEvenMonths, 1)}`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge">
            {RENT_RISE_VS_MOVE_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Rent rise vs cost of moving</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            Landlord raises rent — cheaper to stay or move? Compare the extra rent if you stay with the one-time cost of
            moving over a chosen horizon. Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Current monthly rent (€)"
            step="1"
            register={register('currentRent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.currentRent}
            suffix="€"
          />
          <InputField
            label="New monthly rent (€) after rise"
            step="1"
            register={register('newRent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.newRent}
            suffix="€"
          />
          <InputField
            label="One-time move cost (€)"
            step="1"
            register={register('moveCost', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.moveCost}
            suffix="€"
          />
          <InputField
            label="Horizon months to compare"
            step="1"
            register={register('horizonMonths', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Must be >= 1' },
              max: { value: 120, message: 'Too long for this sketch' },
            })}
            error={formState.errors.horizonMonths}
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Optional new place monthly rent (€)"
              step="1"
              register={register('newPlaceRent', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.newPlaceRent}
              suffix="€"
            />
            <p className="text-xs text-ink-muted">
              Defaults to current rent — move to a similar rent. Change only if the new place costs more or less.
            </p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{RENT_RISE_VS_MOVE_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            <p className="mt-2 text-sm text-ink-body">{paybackLine}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Stay extra total</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.stayCost)}</p>
              <p className="mt-1 text-xs text-ink-muted">
                {formatEuro(result.extraPerMonth)} / month × {result.horizonMonths || 0}
              </p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Move one-time</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.moveCostOneTime)}</p>
              {result.newPlaceExtraOverHorizon > 0 ? (
                <p className="mt-1 text-xs text-ink-muted">
                  Plus {formatEuro(result.newPlaceExtraOverHorizon)} extra rent at the new place
                </p>
              ) : null}
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Break-even months</p>
              <p className="mt-1 text-xl font-bold text-white">{breakEvenLabel}</p>
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
