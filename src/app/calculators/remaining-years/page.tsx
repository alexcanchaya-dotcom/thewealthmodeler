'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import BalanceChart from './BalanceChart';
import {
  AGE_MAX,
  AGE_MIN,
  calculateRemainingYears,
  isValidInput,
  parsePlanTo,
  PLAN_TO_MAX,
  PLAN_TO_MIN,
  RETIRE_MAX,
  RETIRE_MIN,
  RETURN_MAX_PCT,
} from '@/lib/remaining-years';

// Free page: runs only in the browser. Nothing is saved or sent anywhere.
interface FormValues {
  age: number;
  planToAge: number;
  retireAge: number;
  spending: number;
  savings: number;
  yearlySaving: number;
  realReturnPct: number;
}

const defaultValues: FormValues = {
  age: 40,
  planToAge: 90,
  retireAge: 65,
  spending: 40000,
  savings: 100000,
  yearlySaving: 10000,
  realReturnPct: 4,
};

const num = (v: number, fb: number) => (Number.isFinite(v) ? v : fb);
const money = (v: number) => Math.round(v).toLocaleString('en-IE');
const ageText = (v: number) => (Number.isInteger(v) ? String(v) : String(Math.floor(v)));

export default function RemainingYearsPage() {
  const { register, watch, setValue, formState } = useForm<FormValues>({ defaultValues, mode: 'onChange' });

  // Only `?to=NN` is read from the link. Everything else in the URL is ignored.
  useEffect(() => {
    const to = parsePlanTo(new URLSearchParams(window.location.search).get('to'));
    if (to !== null) setValue('planToAge', to, { shouldValidate: true });
  }, [setValue]);

  const v = watch();
  // Hold back results while any field is out of range, so an error is never shown next to a result that used it.
  const valid = isValidInput(v);
  const age = num(v.age, defaultValues.age);
  const planToAge = num(v.planToAge, defaultValues.planToAge);
  const retireAge = num(v.retireAge, defaultValues.retireAge);
  const realReturnPct = Math.min(Math.max(num(v.realReturnPct, 0), 0), 8);

  const r = useMemo(
    () =>
      calculateRemainingYears({
        age,
        planToAge,
        retireAge,
        spending: num(v.spending, 0),
        savings: num(v.savings, 0),
        yearlySaving: num(v.yearlySaving, 0),
        realReturn: realReturnPct / 100,
      }),
    [age, planToAge, retireAge, v.spending, v.savings, v.yearlySaving, realReturnPct],
  );

  const line1 = `Your money needs to last ${r.yearsInRetirement} years (age ${r.retirementStartAge} to age ${planToAge}).`;
  const line2 = `To do that you need about ${money(r.needed)} at retirement. The 4% rule says ${money(r.fourPercentRule)}.`;
  const lasts = r.runsOutAge === null ? 'That lasts for good at this spending' : `That lasts until about age ${ageText(r.runsOutAge)}`;
  const line3 = `On your current plan you'll have about ${money(r.have)}. ${lasts}.`;
  const gapLine = r.gap > 0 ? `Gap: about ${money(r.gap)} short.` : `Surplus: about ${money(r.surplus)} more than you need.`;

  const n = (min: number, max: number) => ({
    valueAsNumber: true as const,
    required: 'Required',
    min: { value: min, message: `${min} or more` },
    max: { value: max, message: `${max} or less` },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">How Many Years Must Your Money Last?</h1>
        <p className="text-ink-body">Your money has to last as long as you do. Pick a number of years and see what it takes.</p>
        <p className="text-sm text-ink-muted">Free, no account, no email. Runs in your browser and nothing is saved.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Your age" step="1" register={register('age', n(AGE_MIN, AGE_MAX))} error={formState.errors.age} />
            <div className="flex flex-col gap-1">
              <InputField
                label="Plan to age"
                step="1"
                register={register('planToAge', {
                  ...n(PLAN_TO_MIN, PLAN_TO_MAX),
                  validate: (x) => Number.isInteger(x) || 'Whole years only',
                })}
                error={formState.errors.planToAge}
              />
              <p className="text-xs text-ink-muted">Use a lifespan estimate or just pick a safe age. Many planners use 90 to 95.</p>
            </div>
            <InputField label="Retire at age" step="1" register={register('retireAge', n(RETIRE_MIN, RETIRE_MAX))} error={formState.errors.retireAge} />
            <InputField label="Yearly spending in retirement" step="1" register={register('spending', n(0, 1e9))} error={formState.errors.spending} />
            <InputField label="Savings today" step="1" register={register('savings', n(0, 1e10))} error={formState.errors.savings} />
            <InputField label="Saving per year until retirement" step="1" register={register('yearlySaving', n(0, 1e9))} error={formState.errors.yearlySaving} />
            <InputField label="Real return (after inflation)" step="0.1" suffix="%" register={register('realReturnPct', n(0, RETURN_MAX_PCT))} error={formState.errors.realReturnPct} />
          </div>
          <p className="text-xs text-ink-muted">Amounts are in whatever currency you use. Returns are after inflation, so all figures are in today&apos;s money.</p>
        </div>

        <div className="card space-y-4" aria-live="polite">
          <p className="text-sm font-semibold text-ink-body">Result</p>
          {valid ? (
            <>
          <ol className="list-decimal space-y-3 pl-5 text-white">
            <li data-testid="line1">{line1}</li>
            <li data-testid="line2">
              {line2} <span className="text-sm text-ink-muted">(The 4% rule assumes about 30 years.)</span>
            </li>
            <li data-testid="line3">
              {line3} <span className="font-semibold text-primary">{gapLine}</span>
            </li>
            <li data-testid="line4">Change &lsquo;Plan to age&rsquo; to see how much the number moves.</li>
          </ol>
          <BalanceChart ages={r.balances.map((p) => p.age)} balances={r.balances.map((p) => Math.round(p.balance))} planToAge={planToAge} />
            </>
          ) : (
            <p data-testid="invalid" className="text-white">Fix the highlighted fields to see your result.</p>
          )}
        </div>
      </div>

      <div className="card space-y-3 text-sm text-ink-body">
        <p className="font-semibold text-white">Related calculators</p>
        <ul className="flex flex-wrap gap-4">
          <li><Link className="text-primary hover:underline" href="/calculators/fire">FIRE Calculator</Link></li>
          <li><Link className="text-primary hover:underline" href="/calculators/retirement">Retirement Calculator (4% rule withdrawal)</Link></li>
        </ul>
        <p>
          Not sure what age to plan to?{' '}
          <a className="text-primary hover:underline" href="https://longevitymodeler.com" rel="noreferrer">
            Get a free lifespan estimate at Longevity Modeler.
          </a>
        </p>
        <p className="text-xs text-ink-muted">Educational only. Not financial advice.</p>
      </div>
    </div>
  );
}
