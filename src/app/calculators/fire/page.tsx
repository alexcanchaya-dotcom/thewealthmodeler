'use client';

import { useMemo, useState } from 'react';
import { Switch } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import ResultsDisplay from '@/components/ResultsDisplay';
import { calculateFIRENumber, calculateYearsToFIRE } from '@/lib/calculations';
import { calculateSavingsRate, formatCurrency, formatNumber } from '@/lib/utils';

interface FireFormValues {
  currentAge: number;
  netWorth: number;
  income: number;
  expenses: number;
  expectedReturn: number;
  withdrawalRate: number;
}

const defaultValues: FireFormValues = {
  currentAge: 30,
  netWorth: 40000,
  income: 90000,
  expenses: 45000,
  expectedReturn: 7,
  withdrawalRate: 4,
};

export default function FIREPage() {
  const { register, watch, formState } = useForm<FireFormValues>({ defaultValues });
  const [coastFire, setCoastFire] = useState(false);
  const [baristaFire, setBaristaFire] = useState(false);
  const values = watch();

  const savingsRate = calculateSavingsRate(values.income, values.expenses);
  const annualSavings = Math.max(values.income - values.expenses, 0) * (baristaFire ? 0.75 : 1);
  const fireNumber = calculateFIRENumber(values.expenses, values.withdrawalRate / 100);
  const yearsToFire = calculateYearsToFIRE(values.netWorth, coastFire ? 0 : annualSavings, fireNumber, values.expectedReturn);
  const ageAtFire = values.currentAge + yearsToFire;
  const progress = Math.min((values.netWorth / fireNumber) * 100, 100);
  const monthlySavingsNeeded = fireNumber > values.netWorth && yearsToFire > 0 ? (fireNumber - values.netWorth) / (yearsToFire * 12) : 0;

  const comparisonRows = useMemo(
    () => {
      const baseYears = calculateYearsToFIRE(values.netWorth, annualSavings, fireNumber, values.expectedReturn);
      const coastYears = calculateYearsToFIRE(values.netWorth, 0, fireNumber, values.expectedReturn);
      const baristaYears = calculateYearsToFIRE(values.netWorth, annualSavings * 0.75, fireNumber, values.expectedReturn);
      return [
        { label: 'Standard', years: baseYears, note: 'Saving full surplus each year' },
        { label: 'Coast FIRE', years: coastYears, note: 'Let investments grow without new contributions' },
        { label: 'Barista FIRE', years: baristaYears, note: 'Part-time work, lower contributions' },
      ];
    },
    [values.netWorth, annualSavings, fireNumber, values.expectedReturn]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FIRE Calculator</h1>
          <p className="text-sm text-gray-600">Find your FIRE number, timeline, and how much to save each month.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="Current Age"
            register={register('currentAge', { valueAsNumber: true, required: 'Required', min: { value: 1, message: 'Invalid age' } })}
            error={formState.errors.currentAge}
          />
          <InputField
            label="Current Net Worth"
            register={register('netWorth', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.netWorth}
          />
          <InputField
            label="Annual Income"
            register={register('income', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.income}
          />
          <InputField
            label="Annual Expenses"
            register={register('expenses', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.expenses}
          />
          <InputField
            label="Expected Investment Return (%)"
            step="0.1"
            register={register('expectedReturn', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
            error={formState.errors.expectedReturn}
            suffix="%"
          />
          <InputField
            label="Safe Withdrawal Rate (%)"
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

        <div className="flex flex-wrap gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <Toggle label="Coast FIRE" enabled={coastFire} onChange={setCoastFire} description="Pause contributions once your current investments can grow to target." />
          <Toggle label="Barista FIRE" enabled={baristaFire} onChange={setBaristaFire} description="Supplement savings with part-time work." />
        </div>
      </div>

      <div className="space-y-4">
        <ResultsDisplay
          title="FIRE Snapshot"
          rows={[
            { label: 'Your FIRE Number', value: fireNumber, highlight: true },
            { label: 'Years Until FIRE', value: formatNumber(yearsToFire, 1) + ' years' },
            { label: 'Age at FIRE', value: formatNumber(ageAtFire, 1) },
            { label: 'Savings Rate', value: `${formatNumber(savingsRate * 100, 1)}%` },
            { label: 'Monthly Savings Needed', value: monthlySavingsNeeded },
          ]}
          extra={
            <div className="rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-800">
              Savings rate is calculated as (Income - Expenses) / Income. Adjust Coast or Barista modes to see how different strategies impact your timeline.
            </div>
          }
        />

        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Progress to FIRE</h3>
            <span className="text-sm font-semibold text-primary">{formatCurrency(values.netWorth)}</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full bg-gradient-primary" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Current</span>
            <span>Goal: {formatCurrency(fireNumber)}</span>
          </div>
        </div>

        <div className="card space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Scenario Comparison</h3>
          <div className="space-y-2">
            {comparisonRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{row.label}</p>
                  <p className="text-xs text-gray-600">{row.note}</p>
                </div>
                <p className="text-sm font-bold text-primary">{formatNumber(row.years, 1)} yrs</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  description: string;
}

function Toggle({ label, enabled, onChange, description }: ToggleProps) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${enabled ? 'bg-primary' : 'bg-gray-200'} relative inline-flex h-7 w-14 items-center rounded-full transition`}
      >
        <span className="sr-only">Toggle {label}</span>
        <span
          className={`${enabled ? 'translate-x-7' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition`}
        />
      </Switch>
    </div>
  );
}
