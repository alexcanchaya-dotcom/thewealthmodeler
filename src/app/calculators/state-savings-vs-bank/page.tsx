'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
  STATE_SAVINGS_AER_HOLD_NOTE,
  STATE_SAVINGS_BADGE,
  STATE_SAVINGS_RATE_FOOTNOTE,
} from '@/lib/irish-copy';
import {
  DEFAULT_STATE_SAVINGS_PRODUCT_ID,
  DIRT_RATE,
  INSTALMENT_SAVINGS_NOTE,
  STATE_SAVINGS_PRODUCTS,
  TERM_YEARS_OPTIONS,
  calculateBankNetAfterDirt,
  calculateStateSavingsNet,
  compareBalances,
  comparisonHeadline,
  getStateSavingsProduct,
  getStateSavingsProductByTerm,
} from '@/lib/state-savings';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  lumpSum: number;
  termYears: number;
  productId: string;
  bankAer: number;
}

const defaultValues: FormValues = {
  lumpSum: 10000,
  termYears: 5,
  productId: DEFAULT_STATE_SAVINGS_PRODUCT_ID,
  bankAer: 2,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function StateSavingsVsBankPage() {
  const { register, watch, setValue, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const lumpSum = Math.max(finiteNumber(values.lumpSum), 0);
  const termYears = finiteNumber(values.termYears, 5);
  const bankAer = finiteNumber(values.bankAer);
  const product = getStateSavingsProduct(values.productId);
  const effectiveTerm = product?.termYears ?? termYears;
  const canCompare = Boolean(product);

  const stateNet = canCompare && product ? calculateStateSavingsNet(lumpSum, product.totalReturn) : null;
  const bankNet = calculateBankNetAfterDirt(lumpSum, bankAer, effectiveTerm);

  const result = useMemo(() => {
    if (stateNet === null) return null;
    const comparison = compareBalances(stateNet, bankNet);
    return {
      headline: comparisonHeadline(comparison.winner, comparison.amount, (value) => formatEuro(value)),
      stateNet,
      bankNet,
    };
  }, [stateNet, bankNet]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="badge">
            {STATE_SAVINGS_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">State Savings vs bank</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            Compare a tax-free State Savings product with a bank deposit after 33% DIRT. Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Lump sum (€)"
            step="1"
            register={register('lumpSum', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.lumpSum}
            suffix="€"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white" htmlFor="termYears">
              Term years
            </label>
            <select
              id="termYears"
              className="input-base"
              value={termYears}
              onChange={(event) => {
                const nextTerm = Number(event.target.value);
                setValue('termYears', nextTerm);
                const match = getStateSavingsProductByTerm(nextTerm);
                setValue('productId', match?.id ?? '');
              }}
            >
              {TERM_YEARS_OPTIONS.map((years) => (
                <option key={years} value={years}>
                  {years} years
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-semibold text-white" htmlFor="productId">
              State Savings product
            </label>
            <select
              id="productId"
              className="input-base"
              value={product?.id ?? ''}
              onChange={(event) => {
                const nextId = event.target.value;
                const match = getStateSavingsProduct(nextId);
                setValue('productId', nextId);
                if (match) setValue('termYears', match.termYears);
              }}
            >
              {!product ? (
                <option value="" disabled>
                  No lump-sum product for this term
                </option>
              ) : null}
              {STATE_SAVINGS_PRODUCTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-ink-muted">{STATE_SAVINGS_AER_HOLD_NOTE}</p>
            <p className="text-xs text-ink-muted">{INSTALMENT_SAVINGS_NOTE}</p>
          </div>

          <InputField
            label="Bank gross AER (%)"
            step="0.01"
            register={register('bankAer', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.bankAer}
            suffix="%"
          />

          <div className="flex flex-col justify-end gap-2">
            <p className="text-sm font-semibold text-white">DIRT</p>
            <div className="rounded-lg border border-glass-line bg-glass-subtle px-4 py-3 text-sm text-ink-body">
              {(DIRT_RATE * 100).toFixed(0)}% fixed — you cannot turn DIRT off
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{STATE_SAVINGS_RATE_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          {result ? (
            <>
              <div>
                <p className="text-sm font-semibold text-ink-body">Result</p>
                <p className="mt-1 text-3xl font-bold text-primary">{result.headline}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-glass-subtle px-4 py-3">
                  <p className="text-sm font-semibold text-ink-body">State Savings</p>
                  <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.stateNet)}</p>
                  {product ? (
                    <p className="mt-1 text-xs text-ink-muted">
                      {product.name} · tax-free · {effectiveTerm} years
                    </p>
                  ) : null}
                </div>
                <div className="rounded-lg bg-glass-subtle px-4 py-3">
                  <p className="text-sm font-semibold text-ink-body">Bank after DIRT</p>
                  <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.bankNet)}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {bankAer.toFixed(2)}% AER · {(DIRT_RATE * 100).toFixed(0)}% DIRT · {effectiveTerm} years
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm font-semibold text-ink-body">Result</p>
                <p className="mt-1 text-xl font-bold text-white">{INSTALMENT_SAVINGS_NOTE}</p>
              </div>
              <div className="rounded-lg bg-glass-subtle px-4 py-3">
                <p className="text-sm font-semibold text-ink-body">Bank after DIRT</p>
                <p className="mt-1 text-xl font-bold text-white">{formatEuro(bankNet)}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {bankAer.toFixed(2)}% AER · {(DIRT_RATE * 100).toFixed(0)}% DIRT · {effectiveTerm} years
                </p>
              </div>
            </>
          )}
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
