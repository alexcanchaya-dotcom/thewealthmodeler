'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import ResultsDisplay from '@/components/ResultsDisplay';
import Chart from '@/components/Chart';
import { calculateRetirement, calculateCompoundInterest } from '@/lib/calculations';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface RetirementFormValues {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  annualSpending: number;
  lifeExpectancy: number;
}

const defaultValues: RetirementFormValues = {
  currentAge: 35,
  retirementAge: 60,
  currentSavings: 80000,
  monthlyContribution: 1200,
  expectedReturn: 6.5,
  annualSpending: 55000,
  lifeExpectancy: 90,
};

export default function RetirementPage() {
  const { register, handleSubmit, watch, formState } = useForm<RetirementFormValues>({ defaultValues });
  const [retirementData, setRetirementData] = useState(
    calculateRetirement(
      defaultValues.currentAge,
      defaultValues.retirementAge,
      defaultValues.currentSavings,
      defaultValues.monthlyContribution,
      defaultValues.expectedReturn,
      defaultValues.annualSpending
    )
  );

  const watched = watch();

  const onSubmit = (data: RetirementFormValues) => {
    const calculation = calculateRetirement(
      data.currentAge,
      data.retirementAge,
      data.currentSavings,
      data.monthlyContribution,
      data.expectedReturn,
      data.annualSpending
    );
    setRetirementData(calculation);
  };

  const horizonYears = Math.max(watched.retirementAge - watched.currentAge, 0);
  const growthProjection = useMemo(
    () =>
      calculateCompoundInterest(
        watched.currentSavings,
        watched.monthlyContribution,
        watched.expectedReturn,
        horizonYears
      ),
    [watched.currentSavings, watched.monthlyContribution, watched.expectedReturn, horizonYears]
  );

  const willMoneyLast = retirementData.yearsOfRetirement >= watched.lifeExpectancy - watched.retirementAge;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retirement Calculator</h1>
          <p className="text-sm text-gray-600">Estimate your nest egg, monthly income in retirement, and how long it may last.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Current Age"
              register={register('currentAge', { valueAsNumber: true, required: 'Required', min: { value: 18, message: 'Too young' } })}
              error={formState.errors.currentAge}
            />
            <InputField
              label="Retirement Age"
              register={register('retirementAge', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: watched.currentAge, message: 'Must be >= current age' },
              })}
              error={formState.errors.retirementAge}
            />
            <InputField
              label="Current Savings"
              register={register('currentSavings', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.currentSavings}
            />
            <InputField
              label="Monthly Contribution"
              register={register('monthlyContribution', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.monthlyContribution}
            />
            <InputField
              label="Expected Return Rate (%)"
              step="0.1"
              register={register('expectedReturn', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.expectedReturn}
              suffix="%"
            />
            <InputField
              label="Annual Retirement Spending"
              register={register('annualSpending', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.annualSpending}
            />
            <InputField
              label="Life Expectancy"
              register={register('lifeExpectancy', { valueAsNumber: true, required: 'Required', min: { value: 1, message: 'Must be >= 1' } })}
              error={formState.errors.lifeExpectancy}
            />
          </div>
          <button type="submit" className="btn-primary w-full">Calculate</button>
        </form>
      </div>

      <div className="space-y-4">
        <ResultsDisplay
          title="Retirement Outlook"
          rows={[
            { label: 'Retirement Balance', value: retirementData.retirementBalance, highlight: true },
            { label: 'Monthly Income (4% rule)', value: retirementData.monthlyIncome },
            { label: 'Years of Retirement Funded', value: formatNumber(retirementData.yearsOfRetirement, 1) },
            { label: 'Will Your Money Last?', value: willMoneyLast ? 'Yes' : 'No', highlight: willMoneyLast },
          ]}
          extra={
            <div className="rounded-lg bg-green-50 px-4 py-3 text-xs text-green-800">
              Assumes annual spending remains constant and a 4% withdrawal rate for monthly income. Adjust life expectancy to test different scenarios.
            </div>
          }
        />

        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Balance Projection</h3>
            <span className="text-sm font-semibold text-primary">{formatCurrency(growthProjection.finalAmount)}</span>
          </div>
          <Chart
            labels={growthProjection.yearlyBreakdown.map((item) => `Year ${item.year}`)}
            totalValue={growthProjection.yearlyBreakdown.map((item) => Math.round(item.balance))}
            contributions={growthProjection.yearlyBreakdown.map((item) =>
              Math.round(watched.currentSavings + watched.monthlyContribution * 12 * item.year)
            )}
          />
        </div>

        <div className="card space-y-2">
          <label className="text-sm font-semibold text-gray-800">Adjust Retirement Age</label>
          <input
            type="range"
            min={watched.currentAge}
            max={watched.lifeExpectancy}
            value={watched.retirementAge}
            onChange={(e) => {
              const value = Number(e.target.value);
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              handleSubmit((data) => onSubmit({ ...data, retirementAge: value }))();
            }}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>Current Age: {watched.currentAge}</span>
            <span>Retirement Age: {watched.retirementAge}</span>
            <span>Life Expectancy: {watched.lifeExpectancy}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
