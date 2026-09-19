'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  MORTGAGE_VS_RENT_BADGE,
  MORTGAGE_VS_RENT_FOOTNOTE,
} from '@/lib/irish-copy';
import {
  amortisingMonthlyPayment,
  buyMonthlyTotal,
  compareMonthly,
  comparisonHeadline,
  depositNeeded,
  loanSize,
  monthlyRateFromAer,
  totalInterestIfHeldToTerm,
  type DepositMode,
} from '@/lib/mortgage-vs-rent';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  monthlyRent: number;
  homePrice: number;
  depositInput: number;
  mortgageAer: number;
  termYears: number;
  otherMonthlyCosts: number;
}

const defaultValues: FormValues = {
  monthlyRent: 1800,
  homePrice: 350000,
  depositInput: 10,
  mortgageAer: 3.5,
  termYears: 30,
  otherMonthlyCosts: 150,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function MortgageVsRentPage() {
  const { register, watch, setValue, formState } = useForm<FormValues>({ defaultValues });
  const [depositMode, setDepositMode] = useState<DepositMode>('percent');
  const values = watch();

  const monthlyRent = Math.max(finiteNumber(values.monthlyRent), 0);
  const homePrice = Math.max(finiteNumber(values.homePrice), 0);
  const depositInput = Math.max(finiteNumber(values.depositInput), 0);
  const mortgageAer = Math.max(finiteNumber(values.mortgageAer), 0);
  const termYears = Math.max(finiteNumber(values.termYears), 0);
  const otherMonthlyCosts = Math.max(finiteNumber(values.otherMonthlyCosts), 0);

  const result = useMemo(() => {
    const deposit = depositNeeded(homePrice, depositInput, depositMode);
    const loan = loanSize(homePrice, deposit);
    const monthlyRate = monthlyRateFromAer(mortgageAer);
    const mortgagePayment = amortisingMonthlyPayment(loan, monthlyRate, termYears);
    const buyTotal = buyMonthlyTotal(mortgagePayment, otherMonthlyCosts);
    const comparison = compareMonthly(monthlyRent, buyTotal);
    return {
      deposit,
      loan,
      mortgagePayment,
      buyTotal,
      headline: comparisonHeadline(comparison.winner, comparison.amount, (value) => formatEuro(value)),
      totalInterest: totalInterestIfHeldToTerm(loan, mortgagePayment, termYears),
    };
  }, [homePrice, depositInput, depositMode, mortgageAer, termYears, otherMonthlyCosts, monthlyRent]);

  const switchDepositMode = (nextMode: DepositMode) => {
    if (nextMode === depositMode) return;
    const currentDeposit = depositNeeded(homePrice, depositInput, depositMode);
    if (nextMode === 'euro') {
      setValue('depositInput', Math.round(currentDeposit));
    } else if (homePrice > 0) {
      const percent = (currentDeposit / homePrice) * 100;
      setValue('depositInput', Math.round(percent * 10) / 10);
    }
    setDepositMode(nextMode);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {MORTGAGE_VS_RENT_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Mortgage vs rent</h1>
          <p className="mt-1 text-sm text-gray-700">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-gray-600">
            Same home, same month — is renting or buying cheaper this month, and roughly over the term? Numbers update as
            you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Monthly rent (€)"
            step="1"
            register={register('monthlyRent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.monthlyRent}
            suffix="€"
          />
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

          <div className="sm:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800">Deposit</p>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => switchDepositMode('percent')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    depositMode === 'percent' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  %
                </button>
                <button
                  type="button"
                  onClick={() => switchDepositMode('euro')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    depositMode === 'euro' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  €
                </button>
              </div>
            </div>
            <InputField
              label={depositMode === 'percent' ? 'Deposit (%)' : 'Deposit (€)'}
              step={depositMode === 'percent' ? '0.1' : '1'}
              register={register('depositInput', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
                ...(depositMode === 'percent'
                  ? { max: { value: 100, message: 'Must be <= 100' } }
                  : {}),
              })}
              error={formState.errors.depositInput}
              suffix={depositMode === 'percent' ? '%' : '€'}
            />
          </div>

          <InputField
            label="Mortgage rate AER (%)"
            step="0.01"
            register={register('mortgageAer', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.mortgageAer}
            suffix="%"
          />
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
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Other monthly costs (€)"
              step="1"
              register={register('otherMonthlyCosts', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.otherMonthlyCosts}
              suffix="€"
            />
            <p className="text-xs text-gray-500">insurance / service / rates lump</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">{MORTGAGE_VS_RENT_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{result.headline}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Rent this month</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(monthlyRent)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Buy this month</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.buyTotal)}</p>
              <p className="mt-1 text-xs text-gray-500">
                Mortgage {formatEuro(result.mortgagePayment)} + other {formatEuro(otherMonthlyCosts)}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Loan size</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.loan)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Deposit needed</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.deposit)}</p>
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

        <div className="card space-y-2">
          <p className="text-sm font-semibold text-gray-600">If you hold the mortgage to term</p>
          <p className="text-lg font-bold text-gray-900">Total interest {formatEuro(result.totalInterest)}</p>
          <p className="text-xs text-gray-500">
            Secondary sketch only — not the headline. Assumes the loan is held for {termYears || 0} years at the entered
            AER.
          </p>
        </div>
      </div>
    </div>
  );
}
