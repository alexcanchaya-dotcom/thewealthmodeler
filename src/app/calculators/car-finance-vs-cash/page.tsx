'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  CAR_FINANCE_VS_CASH_BADGE,
  CAR_FINANCE_VS_CASH_FOOTNOTE,
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import { calculateCarFinanceVsCash, comparisonHeadline } from '@/lib/car-finance-vs-cash';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  price: number;
  deposit: number;
  termMonths: number;
  aprPercent: number;
  balloon: number;
}

const defaultValues: FormValues = {
  price: 28000,
  deposit: 3000,
  termMonths: 48,
  aprPercent: 7.9,
  balloon: 0,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function CarFinanceVsCashPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const price = Math.max(finiteNumber(values.price), 0);
  const deposit = Math.max(finiteNumber(values.deposit), 0);
  const termMonths = Math.max(finiteNumber(values.termMonths), 0);
  const aprPercent = Math.max(finiteNumber(values.aprPercent), 0);
  const balloon = Math.max(finiteNumber(values.balloon), 0);

  const result = useMemo(
    () =>
      calculateCarFinanceVsCash({
        price,
        deposit,
        termMonths,
        aprPercent,
        balloon,
      }),
    [price, deposit, termMonths, aprPercent, balloon]
  );

  const headline = comparisonHeadline(result.winner, result.difference, (value) => formatEuro(value));

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {CAR_FINANCE_VS_CASH_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Car finance vs cash</h1>
          <p className="mt-1 text-sm text-gray-700">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-gray-600">
            Same car — monthly finance versus paying cash now. Which path costs less over the term? Numbers update as
            you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Car price (€)"
            step="1"
            register={register('price', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.price}
            suffix="€"
          />
          <InputField
            label="Deposit / cash down (€)"
            step="1"
            register={register('deposit', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.deposit}
            suffix="€"
          />
          <InputField
            label="Finance term months"
            step="1"
            register={register('termMonths', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Must be >= 1' },
              max: { value: 120, message: 'Too long for this sketch' },
            })}
            error={formState.errors.termMonths}
          />
          <InputField
            label="APR (%)"
            step="0.01"
            register={register('aprPercent', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.aprPercent}
            suffix="%"
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="optional balloon / Guaranteed Future Value"
              step="1"
              register={register('balloon', {
                valueAsNumber: true,
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.balloon}
              suffix="€"
            />
            <p className="text-xs text-gray-500">Optional end payment. Leave at 0 for a standard loan.</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">{CAR_FINANCE_VS_CASH_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Monthly payment</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.monthlyPayment)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Total out on finance</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.totalPaidFinance)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Total out on cash</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.totalPaidCash)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Interest</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.financeInterest)}</p>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Cash needs {formatEuro(result.cashUpfrontAfterDeposit)} upfront from savings after deposit
          </p>
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
