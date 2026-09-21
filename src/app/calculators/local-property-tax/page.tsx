'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '@/components/InputField';
import {
  EXAMPLE_NUMBERS_LINE,
  LOCAL_PROPERTY_TAX_BADGE,
  LOCAL_PROPERTY_TAX_FOOTNOTE,
  LOCAL_PROPERTY_TAX_LOCAL_HINT,
  LOCAL_PROPERTY_TAX_VALUE_HINT,
  LONGEVITY_LINK_HREF,
  LONGEVITY_LINK_TEXT,
} from '@/lib/irish-copy';
import {
  DEFAULT_LOCAL_ADJUSTMENT_PERCENT,
  DEFAULT_PROPERTY_VALUE,
  MAX_LOCAL_ADJUSTMENT_PERCENT,
  MIN_LOCAL_ADJUSTMENT_PERCENT,
  calculateLocalPropertyTax,
  lptHeadline,
} from '@/lib/local-property-tax';
import { formatCurrency } from '@/lib/utils';

interface FormValues {
  propertyValue: number;
  localAdjustmentPercent: number;
}

const defaultValues: FormValues = {
  propertyValue: DEFAULT_PROPERTY_VALUE,
  localAdjustmentPercent: DEFAULT_LOCAL_ADJUSTMENT_PERCENT,
};

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function formatEuro(value: number, digits = 0) {
  return formatCurrency(value, digits, 'EUR');
}

export default function LocalPropertyTaxPage() {
  const { register, watch, formState } = useForm<FormValues>({ defaultValues });
  const values = watch();

  const propertyValue = Math.max(finiteNumber(values.propertyValue), 0);
  const localAdjustmentPercent = finiteNumber(values.localAdjustmentPercent);

  const result = useMemo(
    () =>
      calculateLocalPropertyTax({
        propertyValue,
        localAdjustmentPercent,
      }),
    [propertyValue, localAdjustmentPercent]
  );

  const headline = lptHeadline(propertyValue, result.yearly, (value) => formatEuro(value));
  const showBasicBeforeLocal = result.localAdjustmentPercent !== 0;
  const monthlyLine = propertyValue > 0 ? `≈ ${formatEuro(result.monthly, 2)} / month` : null;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="card space-y-4">
        <div className="space-y-3">
          <span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            {LOCAL_PROPERTY_TAX_BADGE}
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Local Property Tax</h1>
          <p className="mt-1 text-sm text-gray-700">{EXAMPLE_NUMBERS_LINE}</p>
          <p className="text-sm text-gray-600">
            About how much Local Property Tax you might pay from property market value. Numbers update as you type.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <InputField
              label="Property market value (€)"
              step="1"
              register={register('propertyValue', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Must be >= 0' },
              })}
              error={formState.errors.propertyValue}
              suffix="€"
            />
            <p className="text-xs text-gray-500">{LOCAL_PROPERTY_TAX_VALUE_HINT}</p>
          </div>
          <div className="space-y-2">
            <InputField
              label="Local adjustment (%)"
              step="0.1"
              register={register('localAdjustmentPercent', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: MIN_LOCAL_ADJUSTMENT_PERCENT, message: 'Must be >= -15' },
                max: { value: MAX_LOCAL_ADJUSTMENT_PERCENT, message: 'Must be <= 15' },
              })}
              error={formState.errors.localAdjustmentPercent}
              suffix="%"
            />
            <p className="text-xs text-gray-500">{LOCAL_PROPERTY_TAX_LOCAL_HINT}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500">{LOCAL_PROPERTY_TAX_FOOTNOTE}</p>
      </div>

      <div className="space-y-4">
        <div className="card space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">Result</p>
            <p className="mt-1 text-3xl font-bold text-primary">{headline}</p>
            {result.bandLabel ? <p className="mt-2 text-sm text-gray-700">{result.bandLabel}</p> : null}
            {monthlyLine ? <p className="mt-1 text-sm text-gray-700">{monthlyLine}</p> : null}
            {showBasicBeforeLocal ? (
              <p className="mt-1 text-sm text-gray-700">
                Basic {formatEuro(result.basic)} / year before local adjustment
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Yearly</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.yearly)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-sm font-semibold text-gray-600">Monthly</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatEuro(result.monthly, 2)}</p>
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
      </div>
    </div>
  );
}
