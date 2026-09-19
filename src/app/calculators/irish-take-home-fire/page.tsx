'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import { calculateFIRENumber, calculateYearsToFIRE } from '@/lib/calculations';
import {
  EXAMPLE_NUMBERS_LINE,
  IRELAND_BADGE,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import { calculateIrishTakeHome, IRELAND_TAX_ASSUMPTIONS, IRELAND_TAX_YEAR_LABEL } from '@/lib/ireland-tax';
import { calculateSavingsRate, formatCurrency, formatNumber } from '@/lib/utils';

interface IrishFireFormValues {
  grossSalary: number;
  pensionPercent: number;
  expenses: number;
  currentSavings: number;
  expectedReturn: number;
  withdrawalRate: number;
}

const defaultValues: IrishFireFormValues = {
  grossSalary: 55000,
  pensionPercent: 5,
  expenses: 2800,
  currentSavings: 20000,
  expectedReturn: 7,
  withdrawalRate: 4,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export default function IrishTakeHomeFirePage() {
  const { register, watch, formState } = useForm<IrishFireFormValues>({ defaultValues });
  const [expensePeriod, setExpensePeriod] = useState<'monthly' | 'annual'>('monthly');
  const values = watch();

  const grossSalary = finiteNumber(values.grossSalary);
  const pensionPercent = finiteNumber(values.pensionPercent);
  const expenseInput = finiteNumber(values.expenses);
  const currentSavings = finiteNumber(values.currentSavings);
  const expectedReturn = finiteNumber(values.expectedReturn);
  const withdrawalRate = finiteNumber(values.withdrawalRate, 4);

  const takeHome = useMemo(() => calculateIrishTakeHome(grossSalary, pensionPercent), [grossSalary, pensionPercent]);
  const annualExpenses = expensePeriod === 'monthly' ? expenseInput * 12 : expenseInput;
  const annualSurplus = takeHome.takeHome - annualExpenses;
  const fireNumber =
    annualExpenses > 0 && withdrawalRate > 0 ? calculateFIRENumber(annualExpenses, withdrawalRate / 100) : 0;
  const yearsToFire =
    fireNumber <= 0
      ? 0
      : calculateYearsToFIRE(currentSavings, Math.max(annualSurplus, 0), fireNumber, expectedReturn);
  const alreadyThere = fireNumber > 0 && currentSavings >= fireNumber;
  const cannotReach = !alreadyThere && annualSurplus <= 0 && (expectedReturn <= 0 || currentSavings <= 0);
  const savingsRate = calculateSavingsRate(takeHome.takeHome, annualExpenses);
  const progress = fireNumber > 0 ? Math.min((currentSavings / fireNumber) * 100, 100) : 0;
  const yearsLabel = alreadyThere
    ? 'Already there'
    : cannotReach
      ? 'Need a surplus'
      : yearsToFire >= 80
        ? '80+ years'
        : `${formatNumber(yearsToFire, 1)} years`;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {IRELAND_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Irish Take-Home → FIRE</h1>
          <p className="mt-1 text-sm text-gray-700">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-gray-600">
            Start from a rough Irish take-home, subtract spending, then estimate a FIRE number and years to get there.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Gross annual salary (€)"
            register={register('grossSalary', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.grossSalary}
            suffix="€"
          />
          <InputField
            label="Pension contribution % (optional)"
            step="0.1"
            register={register('pensionPercent', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be >= 0' },
              max: { value: 40, message: 'Too high for this sketch' },
            })}
            error={formState.errors.pensionPercent}
            suffix="%"
          />
          <div className="sm:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-gray-800">Spending</p>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setExpensePeriod('monthly')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    expensePeriod === 'monthly' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setExpensePeriod('annual')}
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
                    expensePeriod === 'annual' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>
            <InputField
              label={expensePeriod === 'monthly' ? 'Monthly expenses (€)' : 'Annual expenses (€)'}
              register={register('expenses', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.expenses}
              suffix="€"
            />
          </div>
          <InputField
            label="Current savings / net worth (€)"
            register={register('currentSavings', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.currentSavings}
            suffix="€"
          />
          <InputField
            label="Expected investment return (%)"
            step="0.1"
            register={register('expectedReturn', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.expectedReturn}
            suffix="%"
          />
          <InputField
            label="Safe withdrawal rate (%)"
            step="0.1"
            register={register('withdrawalRate', {
              valueAsNumber: true,
              required: 'Required',
              min: { value: 1, message: 'Too low' },
              max: { value: 10, message: 'Too high' },
            })}
            error={formState.errors.withdrawalRate}
            suffix="%"
          />
        </div>

        <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
          <p className="font-semibold text-gray-800">What this sketch assumes ({IRELAND_TAX_YEAR_LABEL})</p>
          <ul className="list-disc space-y-1 pl-4">
            <li>Single person, PAYE job, PRSI Class A. No spouse, children, rent credit, or medical card.</li>
            <li>
              Income tax: 20% up to {formatCurrency(IRELAND_TAX_ASSUMPTIONS.standardRateBand, 0, 'EUR')}, then 40%. Credits of{' '}
              {formatCurrency(IRELAND_TAX_ASSUMPTIONS.personalTaxCredit + IRELAND_TAX_ASSUMPTIONS.employeeTaxCredit, 0, 'EUR')}{' '}
              (personal + PAYE).
            </li>
            <li>USC bands: 0.5% / 2% / 3% / 8% (2026-shaped). No USC if pay after pension is €13,000 or less.</li>
            <li>
              Employee PRSI at 4.2% of gross (the early-2026 rate). We skip the small weekly PRSI credit and the 4.35% rise from
              October 2026.
            </li>
            <li>Employee pension % reduces PAYE and USC, not PRSI. Take-home is after tax, PRSI, and that pension slice.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Years to FIRE</p>
            <p className="mt-1 text-3xl font-bold text-primary">{yearsLabel}</p>
            <p className="mt-2 text-sm font-semibold text-gray-600">FIRE number</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatCurrency(fireNumber, 0, 'EUR')}</p>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Take-home used</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(takeHome.takeHome, 0, 'EUR')}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
            <span className="text-sm font-semibold text-gray-600">Estimated annual surplus</span>
            <span className="text-sm font-bold text-gray-900">{formatCurrency(annualSurplus, 0, 'EUR')}</span>
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
          {annualSurplus < 0 ? (
            <div className="rounded-lg bg-emerald-50 px-4 py-3 text-xs text-emerald-900">
              Spending is above take-home in this example — years assume no new saving.
            </div>
          ) : null}
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Tax sketch</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Employee pension', value: takeHome.pensionContribution },
              { label: 'PAYE (after credits)', value: takeHome.paye },
              { label: 'USC', value: takeHome.usc },
              { label: 'PRSI', value: takeHome.prsi },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="font-semibold text-gray-600">{row.label}</span>
                <span className="font-bold text-gray-900">{formatCurrency(row.value, 0, 'EUR')}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Savings rate on take-home: {formatNumber(savingsRate * 100, 1)}%. Annual spending used:{' '}
            {formatCurrency(annualExpenses, 0, 'EUR')}.
          </p>
        </div>

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Progress to FIRE</h3>
            <span className="text-sm font-semibold text-primary">{formatCurrency(currentSavings, 0, 'EUR')}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full bg-gradient-primary" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Current</span>
            <span>Goal: {formatCurrency(fireNumber, 0, 'EUR')}</span>
          </div>
        </div>

        {/* Amazon affiliate slot — Product can drop in a live tag later. Empty on purpose: this repo has no affiliate IDs. */}
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-xs text-gray-400">
          Optional reading list goes here later. Nothing for sale on this page.
        </div>
      </div>
    </div>
  );
}
