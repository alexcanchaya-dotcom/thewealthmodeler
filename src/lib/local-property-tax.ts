export const DEFAULT_PROPERTY_VALUE = 350000;
export const DEFAULT_LOCAL_ADJUSTMENT_PERCENT = 0;
export const MIN_LOCAL_ADJUSTMENT_PERCENT = -15;
export const MAX_LOCAL_ADJUSTMENT_PERCENT = 15;

export const EMPTY_HEADLINE = 'Enter a property value to see a figure';
export const OVER_FORMULA_LABEL = 'over €2.1m formula';

/** 2026–2030 residential valuation bands and basic €/year (Revenue). */
export const LPT_BANDS_2026_2030 = [
  { band: 1, min: 1, max: 240_000, basic: 95 },
  { band: 2, min: 240_001, max: 315_000, basic: 235 },
  { band: 3, min: 315_001, max: 420_000, basic: 333 },
  { band: 4, min: 420_001, max: 525_000, basic: 428 },
  { band: 5, min: 525_001, max: 630_000, basic: 523 },
  { band: 6, min: 630_001, max: 735_000, basic: 618 },
  { band: 7, min: 735_001, max: 840_000, basic: 713 },
  { band: 8, min: 840_001, max: 945_000, basic: 808 },
  { band: 9, min: 945_001, max: 1_050_000, basic: 903 },
  { band: 10, min: 1_050_001, max: 1_155_000, basic: 998 },
  { band: 11, min: 1_155_001, max: 1_260_000, basic: 1_094 },
  { band: 12, min: 1_260_001, max: 1_365_000, basic: 1_272 },
  { band: 13, min: 1_365_001, max: 1_470_000, basic: 1_535 },
  { band: 14, min: 1_470_001, max: 1_575_000, basic: 1_797 },
  { band: 15, min: 1_575_001, max: 1_680_000, basic: 2_060 },
  { band: 16, min: 1_680_001, max: 1_785_000, basic: 2_322 },
  { band: 17, min: 1_785_001, max: 1_890_000, basic: 2_585 },
  { band: 18, min: 1_890_001, max: 1_995_000, basic: 2_847 },
  { band: 19, min: 1_995_001, max: 2_100_000, basic: 3_110 },
] as const;

const OVER_THRESHOLD = 2_100_000;
const FIRST_SLICE = 1_260_000;
const SECOND_SLICE_END = 2_100_000;
const RATE_FIRST = 0.0906 / 100;
const RATE_MID = 0.25 / 100;
const RATE_ABOVE = 0.3 / 100;

export interface LocalPropertyTaxInputs {
  propertyValue: number;
  localAdjustmentPercent: number;
}

export interface LocalPropertyTaxResult {
  propertyValue: number;
  localAdjustmentPercent: number;
  band: number | null;
  bandLabel: string;
  usesOverFormula: boolean;
  basic: number;
  yearly: number;
  monthly: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function clampLocalAdjustmentPercent(value: number): number {
  const n = finiteNumber(value, 0);
  return Math.min(MAX_LOCAL_ADJUSTMENT_PERCENT, Math.max(MIN_LOCAL_ADJUSTMENT_PERCENT, n));
}

/** Basic LPT above €2.1m is not a band: 0.0906% of first €1.26m + 0.25% of €1.26m–€2.1m + 0.3% above €2.1m. */
export function basicChargeAboveThreshold(propertyValue: number): number {
  const value = Math.max(finiteNumber(propertyValue), 0);
  const first = RATE_FIRST * FIRST_SLICE;
  const mid = RATE_MID * (SECOND_SLICE_END - FIRST_SLICE);
  const above = RATE_ABOVE * Math.max(0, value - OVER_THRESHOLD);
  return first + mid + above;
}

export function basicChargeForValue(propertyValue: number): { band: number | null; basic: number; usesOverFormula: boolean } {
  const value = Math.max(finiteNumber(propertyValue), 0);
  if (value <= 0) return { band: null, basic: 0, usesOverFormula: false };
  if (value > OVER_THRESHOLD) {
    return { band: null, basic: basicChargeAboveThreshold(value), usesOverFormula: true };
  }

  for (const row of LPT_BANDS_2026_2030) {
    if (value <= row.max && value >= 1) {
      return { band: row.band, basic: row.basic, usesOverFormula: false };
    }
  }

  return { band: null, basic: 0, usesOverFormula: false };
}

export function bandLabelForResult(band: number | null, usesOverFormula: boolean): string {
  if (usesOverFormula) return OVER_FORMULA_LABEL;
  if (band === null) return '';
  return `Band ${band}`;
}

export function lptHeadline(
  propertyValue: number,
  yearly: number,
  formatEuro: (value: number) => string
): string {
  if (Math.max(finiteNumber(propertyValue), 0) <= 0) return EMPTY_HEADLINE;
  return `About ${formatEuro(yearly)} a year`;
}

export function calculateLocalPropertyTax(inputs: LocalPropertyTaxInputs): LocalPropertyTaxResult {
  const propertyValue = Math.max(finiteNumber(inputs.propertyValue), 0);
  const localAdjustmentPercent = clampLocalAdjustmentPercent(inputs.localAdjustmentPercent);
  const { band, basic, usesOverFormula } = basicChargeForValue(propertyValue);
  const yearlyRaw = basic * (1 + localAdjustmentPercent / 100);
  const yearly = Math.round(yearlyRaw);
  const monthly = yearly / 12;

  return {
    propertyValue,
    localAdjustmentPercent,
    band,
    bandLabel: bandLabelForResult(band, usesOverFormula),
    usesOverFormula,
    basic,
    yearly,
    monthly,
  };
}
