'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  HOW_MUCH_CAN_I_BORROW_BADGE,
  HOW_MUCH_CAN_I_BORROW_FOOTNOTE,
  HOW_MUCH_CAN_I_BORROW_LTI_HINT,
  HOW_MUCH_CAN_I_BORROW_LTV_HINT,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import {
  DEFAULT_DEPOSIT,
  DEFAULT_GROSS_ANNUAL_INCOME,
  DEFAULT_LTI_MULTIPLE,
  DEFAULT_MAX_LTV_PERCENT,
  DEFAULT_OTHER_ANNUAL_INCOME,
  borrowHeadline,
  calculateHowMuchCanIBorrow,
} from '@/lib/how-much-can-i-borrow';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  grossAnnualIncome: number;
  otherAnnualIncome: number;
  ltiMultiple: number;
  deposit: number;
  maxLtvPercent: number;
}

const defaultValues: FormValues = {
  grossAnnualIncome: DEFAULT_GROSS_ANNUAL_INCOME,
  otherAnnualIncome: DEFAULT_OTHER_ANNUAL_INCOME,
  ltiMultiple: DEFAULT_LTI_MULTIPLE,
  deposit: DEFAULT_DEPOSIT,
  maxLtvPercent: DEFAULT_MAX_LTV_PERCENT,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

function bindingLabel(binding: 'income' | 'ltv' | 'both'): string {
  if (binding === 'income') return 'Income';
  if (binding === 'ltv') return 'LTV';
  return 'Both';
}

export default function HowMuchCanIBorrowPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const grossAnnualIncome = Math.max(finiteNumber(values.grossAnnualIncome), 0);
  const otherAnnualIncome = Math.max(finiteNumber(values.otherAnnualIncome), 0);
  const ltiMultiple = Math.max(finiteNumber(values.ltiMultiple), 0);
  const deposit = Math.max(finiteNumber(values.deposit), 0);
  const maxLtvPercent = Math.max(finiteNumber(values.maxLtvPercent), 0);

  const result = useMemo(
    () =>
      calculateHowMuchCanIBorrow({
        grossAnnualIncome,
        otherAnnualIncome,
        ltiMultiple,
        deposit,
        maxLtvPercent,
      }),
    [grossAnnualIncome, otherAnnualIncome, ltiMultiple, deposit, maxLtvPercent]
  );

  const headline = borrowHeadline(result.incomeCap, result.ltvCap, result.borrowable, (value) =>
    formatEuro(value)
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {HOW_MUCH_CAN_I_BORROW_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-white">How much can I borrow</h1>
          <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-ink-body">
            Roughly how much mortgage you could borrow from income and deposit. The headline is the lower of a simple
            income (LTI) cap and an LTV cap. Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Gross annual income (€)"
            step="1"
            register={register('grossAnnualIncome', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.grossAnnualIncome}
            suffix="€"
          />
          <InputField
            label="Other annual income (€)"
            step="1"
            register={register('otherAnnualIncome', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.otherAnnualIncome}
            suffix="€"
          />
          <div className="space-y-2">
            <InputField
              label="LTI multiple"
              step="0.1"
              register={register('ltiMultiple', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.ltiMultiple}
            />
            <p className="text-xs text-ink-muted">{HOW_MUCH_CAN_I_BORROW_LTI_HINT}</p>
          </div>
          <InputField
            label="Deposit / equity (€)"
            step="1"
            register={register('deposit', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 0, message: 'Must be >= 0' },
            })}
            error={formState.errors.deposit}
            suffix="€"
          />
          <div className="sm:col-span-2 space-y-2">
            <InputField
              label="Max LTV (%)"
              step="0.1"
              register={register('maxLtvPercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.maxLtvPercent}
              suffix="%"
            />
            <p className="text-xs text-ink-muted">{HOW_MUCH_CAN_I_BORROW_LTV_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-ink-muted">{HOW_MUCH_CAN_I_BORROW_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-ink-body">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Income cap</p>
              <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.incomeCap)}</p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">LTV cap</p>
              <p className="mt-1 text-xl font-bold text-white">
                {result.ltvCap === null ? 'Unlimited' : formatEuro(result.ltvCap)}
              </p>
            </div>
            <div className="rounded-lg bg-glass-subtle px-4 py-3">
              <p className="text-sm font-semibold text-ink-body">Binding limit</p>
              <p className="mt-1 text-xl font-bold text-white">{bindingLabel(result.binding)}</p>
            </div>
          </div>

          <div className="rounded-lg bg-glass-subtle px-4 py-3">
            <p className="text-sm font-semibold text-ink-body">Implied max property</p>
            <p className="mt-1 text-xl font-bold text-white">{formatEuro(result.impliedProperty)}</p>
            <p className="mt-1 text-xs text-ink-muted">Borrowable + deposit</p>
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
