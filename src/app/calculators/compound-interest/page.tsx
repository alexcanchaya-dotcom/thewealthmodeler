'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import ResultsDisplay from '@/components/ResultsDisplay';
import Chart from '@/components/Chart';
import AdUnit from '@/components/AdUnit';
import AffiliateLinks from '@/components/AffiliateLinks';
import PremiumCTA from '@/components/PremiumCTA';
import { calculateCompoundInterest } from '@/lib/calculations';
import { formatCurrency } from '@/lib/utils';
import type { CompoundInterestResult } from '@/types/calculator';

interface CompoundFormValues {
  principal: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
}

const defaultValues: CompoundFormValues = {
  principal: 10000,
  monthlyContribution: 500,
  annualRate: 7,
  years: 20,
};

export default function CompoundInterestPage() {
  const { register, handleSubmit, formState } = useForm<CompoundFormValues>({ defaultValues });
  const [inputs, setInputs] = useState<CompoundFormValues>(defaultValues);
  const [result, setResult] = useState<CompoundInterestResult>(calculateCompoundInterest(
    defaultValues.principal,
    defaultValues.monthlyContribution,
    defaultValues.annualRate,
    defaultValues.years
  ));

  const onSubmit = (data: CompoundFormValues) => {
    const calculation = calculateCompoundInterest(
      Number(data.principal),
      Number(data.monthlyContribution),
      Number(data.annualRate),
      Number(data.years)
    );
    setInputs(data);
    setResult(calculation);
  };

  const chartLabels = useMemo(() => result.yearlyBreakdown.map((year) => `Year ${year.year}`), [result]);
  const totalValues = useMemo(() => result.yearlyBreakdown.map((year) => Math.round(year.balance)), [result]);
  const contributions = useMemo(
    () =>
      result.yearlyBreakdown.map((year) =>
        Math.round(inputs.principal + inputs.monthlyContribution * 12 * year.year)
      ),
    [result, inputs]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">Compound Interest Calculator</h1>
          <p className="text-sm text-gray-600">See how your investments grow with monthly contributions and annual compounding.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Initial Investment ($)"
              register={register('principal', { valueAsNumber: true, required: 'Required', min: { value: 0, message: 'Must be >= 0' } })}
              error={formState.errors.principal}
            />
            <InputField
              label="Monthly Contribution ($)"
              register={register('monthlyContribution', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.monthlyContribution}
            />
            <InputField
              label="Annual Interest Rate (%)"
              register={register('annualRate', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
                max: { value: 30, message: 'Too high' },
              })}
              error={formState.errors.annualRate}
              step="0.01"
              suffix="%"
            />
            <InputField
              label="Time Horizon (years)"
              register={register('years', { valueAsNumber: true, required: 'Required', min: { value: 1, message: 'At least 1 year' } })}
              error={formState.errors.years}
            />
            <button type="submit" className="btn-primary w-full">Calculate</button>
          </form>
        </div>

        <div className="space-y-4">
          <ResultsDisplay
            title="Results"
            rows={[
              { label: 'Final Amount', value: result.finalAmount, highlight: true },
              { label: 'Total Contributions', value: result.totalContributions },
              { label: 'Total Interest Earned', value: result.totalInterest },
            ]}
            extra={
              <div className="text-xs text-gray-500">
                Final amount shown with annual compounding. Total contributions include your initial investment plus monthly deposits.
              </div>
            }
          />
          <div className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Growth Over Time</h3>
              <span className="text-sm font-semibold text-primary">{formatCurrency(result.finalAmount)}</span>
            </div>
            <Chart labels={chartLabels} totalValue={totalValues} contributions={contributions} />
          </div>
        </div>
      </div>

      {/* Ad between calculator and resources */}
      <AdUnit slot="3333333333" format="horizontal" />

      {/* Premium PDF export feature */}
      <PremiumCTA
        feature="Export Results to PDF"
        description="Download a clean, formatted PDF of your compound interest projection — no ads, ready to share with your financial adviser or save for your records."
      />

      {/* Contextual affiliate recommendations */}
      <AffiliateLinks calculator="compound-interest" />
    </div>
  );
}
