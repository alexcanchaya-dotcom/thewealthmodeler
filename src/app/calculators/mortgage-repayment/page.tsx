'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  MORTGAGE_REPAYMENT_BADGE,
  MORTGAGE_REPAYMENT_FOOTNOTE,
  MORTGAGE_REPAYMENT_RATE_HINT,
  MORTGAGE_REPAYMENT_STRESS_HINT,
} from '@/lib/irish-copy';
import {
  DEFAULT_ANNUAL_RATE_PERCENT,
  DEFAULT_LOAN_AMOUNT,
  DEFAULT_STRESS_RATE_PERCENT,
  DEFAULT_TERM_YEARS,
  calculateMortgageRepayment,
  repaymentHeadline,
} from '@/lib/mortgage-repayment';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  loanAmount: number;
  annualRatePercent: number;
  termYears: number;
  stressRatePercent: number;
}

const defaultValues: FormValues = {
  loanAmount: DEFAULT_LOAN_AMOUNT,
  annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
  termYears: DEFAULT_TERM_YEARS,
  stressRatePercent: DEFAULT_STRESS_RATE_PERCENT,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function MortgageRepaymentPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const loanAmount = Math.max(finiteNumber(values.loanAmount), 0);
  const annualRatePercent = Math.max(finiteNumber(values.annualRatePercent), 0);
  const termYears = Math.max(finiteNumber(values.termYears), 0);
  const stressRatePercent = Math.max(finiteNumber(values.stressRatePercent), 0);

  const result = useMemo(
    () =>
      calculateMortgageRepayment({
        loanAmount,
        annualRatePercent,
        termYears,
        stressRatePercent,
      }),
    [loanAmount, annualRatePercent, termYears, stressRatePercent]
  );

  const headline = repaymentHeadline(loanAmount, result.monthlyPayment, (value) => formatEuro(value));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge">
            {MORTGAGE_REPAYMENT_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">Mortgage repayment</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            What would this mortgage cost per month? Headline is the repay at the quoted rate. Numbers update as you
            type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Loan amount (€)"
            step="1"
            register={register('loanAmount', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.loanAmount}
            suffix="€"
          />
          <div className="space-y-2">
            <InputField
              label="Annual interest rate (%)"
              step="0.01"
              register={register('annualRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.annualRatePercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{MORTGAGE_REPAYMENT_RATE_HINT}</p>
          </div>
          <InputField
            label="Term years"
            step="1"
            register={register('termYears', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Must be >= 1' },
              max: { value: 50, message: 'Too long for this sketch' },
            })}
            error={formState.errors.termYears}
          />
          <div className="space-y-2">
            <InputField
              label="Stress rate (%)"
              step="0.01"
              register={register('stressRatePercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.stressRatePercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{MORTGAGE_REPAYMENT_STRESS_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{MORTGAGE_REPAYMENT_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Stress monthly</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.stressMonthlyPayment)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Total interest</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.totalInterest)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Total paid</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.totalPaid)}</p>
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

        <div className="card space-y-2">
          <p className="text-sm font-semibold text-ink-body">Stress-rate repay</p>
          <p className="text-3xl font-bold text-primary">{formatEuro(result.stressMonthlyPayment)}</p>
          <p className="text-sm font-semibold text-white">
            At {Number.isFinite(stressRatePercent) ? String(stressRatePercent) : '0'}% —{' '}
            {formatEuro(result.stressTotalPaid)} paid over the term
          </p>
        </div>
      </div>
    </div>
  );
}
