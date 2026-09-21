import { amortisingMonthlyPayment, monthlyRateFromAnnualPercent } from '@/lib/mortgage-repayment';

export const DEFAULT_REMAINING_BALANCE = 250000;
export const DEFAULT_CURRENT_RATE_PERCENT = 4.5;
export const DEFAULT_NEW_RATE_PERCENT = 3.8;
export const DEFAULT_REMAINING_TERM_YEARS = 25;
export const DEFAULT_SWITCH_FEES = 2500;

export const EMPTY_HEADLINE = 'Enter a balance to see a figure';
export const COSTS_MORE_HEADLINE = 'New deal costs more each month';

export interface MortgageSwitchBreakEvenInputs {
  remainingBalance: number;
  currentRatePercent: number;
  newRatePercent: number;
  remainingTermYears: number;
  switchFees: number;
}

export interface MortgageSwitchBreakEvenResult {
  currentMonthly: number;
  newMonthly: number;
  monthlySaving: number;
  breakEvenMonths: number | null;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function switchBreakEvenHeadline(
  remainingBalance: number,
  monthlySaving: number,
  breakEvenMonths: number | null
): string {
  if (Math.max(finiteNumber(remainingBalance), 0) <= 0) return EMPTY_HEADLINE;
  if (monthlySaving <= 0 || breakEvenMonths === null) return COSTS_MORE_HEADLINE;
  return `Break-even in about ${breakEvenMonths.toFixed(1)} months`;
}

export function calculateMortgageSwitchBreakEven(
  inputs: MortgageSwitchBreakEvenInputs
): MortgageSwitchBreakEvenResult {
  const remainingBalance = Math.max(finiteNumber(inputs.remainingBalance), 0);
  const currentRatePercent = Math.max(finiteNumber(inputs.currentRatePercent), 0);
  const newRatePercent = Math.max(finiteNumber(inputs.newRatePercent), 0);
  const remainingTermYears = Math.max(finiteNumber(inputs.remainingTermYears), 0);
  const switchFees = Math.max(finiteNumber(inputs.switchFees), 0);

  const currentMonthly = amortisingMonthlyPayment(
    remainingBalance,
    monthlyRateFromAnnualPercent(currentRatePercent),
    remainingTermYears
  );
  const newMonthly = amortisingMonthlyPayment(
    remainingBalance,
    monthlyRateFromAnnualPercent(newRatePercent),
    remainingTermYears
  );
  const monthlySaving = currentMonthly - newMonthly;
  const breakEvenMonths = monthlySaving > 0 ? switchFees / monthlySaving : null;

  return {
    currentMonthly,
    newMonthly,
    monthlySaving,
    breakEvenMonths,
  };
}
