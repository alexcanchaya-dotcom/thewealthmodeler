'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  MORTGAGE_OVERPAY_VS_CASH_BADGE,
  MORTGAGE_OVERPAY_VS_CASH_FOOTNOTE,
} from '@/lib/irish-copy';
import {
  DEFAULT_AER,
  DEFAULT_BALANCE,
  DEFAULT_CASH_AER,
  DEFAULT_EXTRA,
  DEFAULT_SCHEDULED_PAYMENT,
  DEFAULT_TERM_YEARS,
  PAYMENT_TOO_LOW_MESSAGE,
  calculateMortgageOverpayVsCash,
  cashPileCopy,
  monthlyRateFromAer,
  overpayHeadline,
  scheduledMonthlyPayment,
} from '@/lib/mortgage-overpay-vs-cash';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  balance: number;
  aerPercent: number;
  termYears: number;
  scheduledPayment: number;
  extraMonthly: number;
  cashAerPercent: number;
}

const defaultValues: FormValues = {
  balance: DEFAULT_BALANCE,
  aerPercent: DEFAULT_AER,
  termYears: DEFAULT_TERM_YEARS,
  scheduledPayment: DEFAULT_SCHEDULED_PAYMENT,
  extraMonthly: DEFAULT_EXTRA,
  cashAerPercent: DEFAULT_CASH_AER,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function MortgageOverpayVsCashPage() {
  const { register, watch, setValue, formState } = useForm<FormValues>({ defaultValues });
  const [paymentDirty, setPaymentDirty] = useState(false);
  const values = watch();

  const balance = Math.max(finiteNumber(values.balance), 0);
  const aerPercent = Math.max(finiteNumber(values.aerPercent), 0);
  const termYears = Math.max(finiteNumber(values.termYears), 0);
  const extraMonthly = Math.max(finiteNumber(values.extraMonthly), 0);
  const cashAerPercent = Math.max(finiteNumber(values.cashAerPercent), 0);

  const calculatedPayment = useMemo(
    () => Math.round(scheduledMonthlyPayment(balance, monthlyRateFromAer(aerPercent), termYears)),
    [balance, aerPercent, termYears]
  );

  useEffect(() => {
    if (!paymentDirty) {
      setValue('scheduledPayment', calculatedPayment);
    }
  }, [calculatedPayment, paymentDirty, setValue]);

  const scheduledPayment = paymentDirty
    ? Math.max(finiteNumber(values.scheduledPayment), 0)
    : calculatedPayment;

  const result = useMemo(
    () =>
      calculateMortgageOverpayVsCash({
        balance,
        aerPercent,
        termYears,
        scheduledPayment,
        extraMonthly,
        cashAerPercent,
      }),
    [balance, aerPercent, termYears, scheduledPayment, extraMonthly, cashAerPercent]
  );

  const canShowResult = result.baseline.paidOff && result.overpay.paidOff;
  const headline = canShowResult
    ? overpayHeadline(result.interestSaved, result.monthsCut, (value) => formatEuro(value))
    : PAYMENT_TOO_LOW_MESSAGE;
  const cashLine = cashPileCopy(result.cashPile, result.cashAerPercent, result.cashOpportunity, (value) =>
    formatEuro(value)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge badge-ie">
            {MORTGAGE_OVERPAY_VS_CASH_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Mortgage overpay vs keep cash</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            If you overpay the mortgage by a set amount each month, how much interest do you save and how many months
            sooner are you done — versus keeping that cash liquid? Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Remaining balance (€)"
            step="1"
            register={register('balance', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.balance}
            suffix="€"
          />
          <InputField
            label="Rate AER (%)"
            step="0.01"
            register={register('aerPercent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.aerPercent}
            suffix="%"
          />
          <InputField
            label="Remaining term years"
            step="1"
            register={register('termYears', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Must be >= 1' },
              max: { value: 50, message: 'Too long for this sketch' },
            })}
            error={formState.errors.termYears}
          />
          <InputField
            label="Extra monthly overpay (€)"
            step="1"
            register={register('extraMonthly', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.extraMonthly}
            suffix="€"
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Current scheduled monthly payment (€)"
              step="1"
              register={register('scheduledPayment', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
                onChange: () => setPaymentDirty(true),
              })}
              error={formState.errors.scheduledPayment}
              suffix="€"
            />
            {paymentDirty ? (
              <button
                type="button"
                onClick={() => {
                  setPaymentDirty(false);
                  setValue('scheduledPayment', calculatedPayment);
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Use calculated {formatEuro(calculatedPayment)}
              </button>
            ) : (
              <p className="text-xs text-ink-muted">Auto-calculated from balance, rate, and term — edit if yours differs.</p>
            )}
          </div>
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="if you kept the cash earning"
              step="0.01"
              register={register('cashAerPercent', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.cashAerPercent}
              suffix="%"
            />
          </div>
        </div>

        <p className="text-xs text-ink-muted">{MORTGAGE_OVERPAY_VS_CASH_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>

          {canShowResult ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Interest without overpay</p>
                <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.baseline.totalInterest)}</p>
              </div>
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Interest with overpay</p>
                <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.overpay.totalInterest)}</p>
              </div>
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Payoff without overpay</p>
                <p className="mt-1 text-xl font-bold text-white">{result.baseline.payoffMonths} months left</p>
              </div>
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Payoff with overpay</p>
                <p className="mt-1 text-xl font-bold text-white">{result.overpay.payoffMonths} months left</p>
              </div>
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

        {canShowResult ? (
          <div className="card space-y-2">
            <p className="text-sm font-semibold text-ink-body">If you kept the extras in cash</p>
            <p className="text-sm font-semibold text-white">{cashLine}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
