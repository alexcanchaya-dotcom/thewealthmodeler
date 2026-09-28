'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  HELP_TO_BUY_BOOST_HINT,
  HELP_TO_BUY_DEPOSIT_BADGE,
  HELP_TO_BUY_DEPOSIT_FOOTNOTE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import {
  DEFAULT_ALREADY_SAVED,
  DEFAULT_DEPOSIT_PERCENT,
  DEFAULT_HOME_PRICE,
  DEFAULT_HTB_BOOST,
  DEFAULT_MONTHLY_SAVE,
  addCalendarMonths,
  calculateHelpToBuyDeposit,
  formatRoughMonthYear,
  headlineForResult,
} from '@/lib/help-to-buy-deposit-runway';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  homePrice: number;
  depositPercent: number;
  alreadySaved: number;
  monthlySave: number;
  htbBoost: number;
}

const defaultValues: FormValues = {
  homePrice: DEFAULT_HOME_PRICE,
  depositPercent: DEFAULT_DEPOSIT_PERCENT,
  alreadySaved: DEFAULT_ALREADY_SAVED,
  monthlySave: DEFAULT_MONTHLY_SAVE,
  htbBoost: DEFAULT_HTB_BOOST,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function HelpToBuyDepositRunwayPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const [asOf, setAsOf] = useState<Date | null>(null);
  const values = watch();

  useEffect(() => {
    setAsOf(new Date());
  }, []);

  const homePrice = Math.max(finiteNumber(values.homePrice), 0);
  const depositPercent = Math.max(finiteNumber(values.depositPercent), 0);
  const alreadySaved = Math.max(finiteNumber(values.alreadySaved), 0);
  const monthlySave = finiteNumber(values.monthlySave);
  const htbBoost = Math.max(finiteNumber(values.htbBoost), 0);

  const result = useMemo(
    () =>
      calculateHelpToBuyDeposit({
        homePrice,
        depositPercent,
        alreadySaved,
        monthlySave,
        htbBoost,
      }),
    [homePrice, depositPercent, alreadySaved, monthlySave, htbBoost]
  );

  const headline = headlineForResult(result);
  const dateish =
    asOf && result.months !== null && result.months > 0
      ? `Roughly ${result.months} months from today — ${formatRoughMonthYear(
          addCalendarMonths(asOf, result.months)
        )}`
      : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge badge-ie">
            {HELP_TO_BUY_DEPOSIT_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Help to Buy deposit runway</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            How many months until you have the deposit. An optional Help to Buy boost shortens the runway. Numbers
            update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Home price (€)"
            step="1"
            register={register('homePrice', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.homePrice}
            suffix="€"
          />
          <div className="space-y-2">
            <InputField
              label="Deposit target (%)"
              step="0.1"
              register={register('depositPercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
                max: { value: 100, message: 'Must be <= 100' },
              })}
              error={formState.errors.depositPercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">Target {formatEuro(result.targetDeposit)} (price × %)</p>
          </div>
          <InputField
            label="Already saved (€)"
            step="1"
            register={register('alreadySaved', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.alreadySaved}
            suffix="€"
          />
          <InputField
            label="Monthly save (€)"
            step="1"
            register={register('monthlySave', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.monthlySave}
            suffix="€"
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Optional Help to Buy boost (€)"
              step="1"
              register={register('htbBoost', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.htbBoost}
              suffix="€"
            />
            <p className="text-xs text-ink-muted">{HELP_TO_BUY_BOOST_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{HELP_TO_BUY_DEPOSIT_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            {dateish ? <p className="mt-2 text-sm font-semibold text-ink-body">{dateish}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Target</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.targetDeposit)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Gap left</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.gap)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Monthly save</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(Math.max(monthlySave, 0))}</p>
            </div>
          </div>

          {htbBoost > 0 ? (
            <p className="text-sm font-semibold text-white">
              With HTB boost of {formatEuro(htbBoost)}, gap is {formatEuro(result.gap)}
            </p>
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
