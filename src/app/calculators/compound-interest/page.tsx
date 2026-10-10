'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import MobileResultLine from '@/components/MobileResultLine';
import { EXAMPLE_NUMBERS_LINE, LONGEVITY_LINK_HREF, LONGEVITY_LINK_TEXT, US_MODEL_BADGE } from '@/lib/irish-copy';
import ResultsDisplay from '@/components/ResultsDisplay';
import Chart from '@/components/Chart';
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
  const { register, handleSubmit, watch, formState } = useForm<CompoundFormValues>({ defaultValues });
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

  // Phone-only live line: the same calculateCompoundInterest the Calculate button uses,
  // fed with what is currently typed so it updates without pressing Calculate.
  const watched = watch();
  const liveResult = useMemo(() => {
    const { principal, monthlyContribution, annualRate, years } = watched;
    const ok = [principal, monthlyContribution, annualRate, years].every((v) => Number.isFinite(v));
    if (!ok || principal < 0 || monthlyContribution < 0 || annualRate < 0 || annualRate > 30 || years < 1) return null;
    return calculateCompoundInterest(Number(principal), Number(monthlyContribution), Number(annualRate), Number(years));
  }, [watched.principal, watched.monthlyContribution, watched.annualRate, watched.years]);

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
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card">
        <span className="badge badge-us mb-3">{US_MODEL_BADGE}</span>
        <h1 className="text-2xl font-bold text-white">Compound Interest Calculator</h1>
        <MobileResultLine>
          {liveResult
            ? `About ${formatCurrency(liveResult.finalAmount)} after ${watched.years} ${watched.years === 1 ? 'year' : 'years'}`
            : 'Fill in every box to see your result'}
        </MobileResultLine>
        <p className="mt-1 text-sm text-ink-body">{EXAMPLE_NUMBERS_LINE}</p>
        <p className="text-sm text-ink-body">See how your investments grow with monthly contributions and annual compounding.</p>
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

      <div className="min-w-0 space-y-4">
        <ResultsDisplay
          title="Results"
          rows={[
            { label: 'Final Amount', value: result.finalAmount, highlight: true },
            { label: 'Total Contributions', value: result.totalContributions },
            { label: 'Total Interest Earned', value: result.totalInterest },
          ]}
          extra={
            <>
              <div className="text-xs text-ink-muted">
                Final amount shown with annual compounding. Total contributions include your initial investment plus monthly deposits.
              </div>
              <p className="text-sm text-ink-body">
                <a
                  href={LONGEVITY_LINK_HREF}
                  target="_blank"
                  rel="noreferrer"
                  className="tap-target font-semibold text-primary hover:underline"
                >
                  {LONGEVITY_LINK_TEXT}
                </a>
              </p>
            </>
          }
        />
        <div className="card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Growth Over Time</h3>
            <span className="text-sm font-semibold text-primary">{formatCurrency(result.finalAmount)}</span>
          </div>
          <Chart labels={chartLabels} totalValue={totalValues} contributions={contributions} />
        </div>
      </div>
    </div>
  );
}
