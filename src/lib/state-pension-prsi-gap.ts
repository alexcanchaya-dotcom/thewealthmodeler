export const DEFAULT_TARGET_MONTHLY = 2500;
export const DEFAULT_WEEKLY_STATE_PENSION = 289.3;
export const DEFAULT_COMPLETENESS_PERCENT = 100;
export const DEFAULT_OTHER_INCOME_MONTHLY = 0;

export const COVERED_HEADLINE = 'State Pension + other covers your target';

export interface StatePensionPrsiGapInputs {
  targetMonthly: number;
  weeklyStatePension: number;
  completenessPercent: number;
  otherIncomeMonthly: number;
}

export interface StatePensionPrsiGapResult {
  statePensionMonthly: number;
  coveredMonthly: number;
  gapMonthly: number;
  gapAnnual: number;
  covered: boolean;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Monthly State Pension ≈ (weekly × 52 / 12) × (completeness% / 100) */
export function monthlyStatePension(weeklyStatePension: number, completenessPercent: number): number {
  const weekly = Math.max(finiteNumber(weeklyStatePension), 0);
  const completeness = Math.max(finiteNumber(completenessPercent), 0);
  return (weekly * 52 / 12) * (completeness / 100);
}

export function gapHeadline(gapMonthly: number, formatEuro: (value: number) => string): string {
  if (gapMonthly <= 0) return COVERED_HEADLINE;
  return `You need about ${formatEuro(gapMonthly)} / month more than the State Pension covers`;
}

export function calculateStatePensionPrsiGap(inputs: StatePensionPrsiGapInputs): StatePensionPrsiGapResult {
  const targetMonthly = Math.max(finiteNumber(inputs.targetMonthly), 0);
  const otherIncomeMonthly = Math.max(finiteNumber(inputs.otherIncomeMonthly), 0);
  const statePensionMonthly = monthlyStatePension(inputs.weeklyStatePension, inputs.completenessPercent);
  const coveredMonthly = statePensionMonthly + otherIncomeMonthly;
  const gapMonthly = Math.max(0, targetMonthly - coveredMonthly);

  return {
    statePensionMonthly,
    coveredMonthly,
    gapMonthly,
    gapAnnual: gapMonthly * 12,
    covered: gapMonthly <= 0,
  };
}
