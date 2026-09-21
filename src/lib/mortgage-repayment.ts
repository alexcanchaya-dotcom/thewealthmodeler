/** Matches the how-much-can-I-borrow default so the funnel continues. */
export const DEFAULT_LOAN_AMOUNT = 192500;
export const DEFAULT_ANNUAL_RATE_PERCENT = 3.8;
export const DEFAULT_TERM_YEARS = 30;
export const DEFAULT_STRESS_RATE_PERCENT = 5.5;

export const EMPTY_HEADLINE = 'Enter a loan amount to see a figure';

export interface MortgageRepaymentInputs {
  loanAmount: number;
  annualRatePercent: number;
  termYears: number;
  stressRatePercent: number;
}

export interface MortgageRepaymentResult {
  months: number;
  monthlyRate: number;
  stressMonthlyRate: number;
  monthlyPayment: number;
  stressMonthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  stressTotalPaid: number;
  stressTotalInterest: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Monthly rate r = annual% / 100 / 12. */
export function monthlyRateFromAnnualPercent(annualPercent: number): number {
  if (!Number.isFinite(annualPercent) || annualPercent <= 0) return 0;
  return annualPercent / 100 / 12;
}

/**
 * Standard amortising monthly payment:
 * P = L × r(1+r)^n / ((1+r)^n − 1) when r > 0; else L / n.
 */
export function amortisingMonthlyPayment(loan: number, monthlyRate: number, termYears: number): number {
  if (!Number.isFinite(loan) || loan <= 0) return 0;
  if (!Number.isFinite(termYears) || termYears <= 0) return 0;
  const months = Math.round(termYears * 12);
  if (months <= 0) return 0;
  if (!Number.isFinite(monthlyRate) || monthlyRate <= 0) return loan / months;
  const factor = (1 + monthlyRate) ** months;
  return (loan * monthlyRate * factor) / (factor - 1);
}

export function repaymentHeadline(
  loanAmount: number,
  monthlyPayment: number,
  formatEuro: (value: number) => string
): string {
  if (Math.max(finiteNumber(loanAmount), 0) <= 0) return EMPTY_HEADLINE;
  return `About ${formatEuro(Math.max(finiteNumber(monthlyPayment), 0))} / month`;
}

export function calculateMortgageRepayment(inputs: MortgageRepaymentInputs): MortgageRepaymentResult {
  const loanAmount = Math.max(finiteNumber(inputs.loanAmount), 0);
  const annualRatePercent = Math.max(finiteNumber(inputs.annualRatePercent), 0);
  const termYears = Math.max(finiteNumber(inputs.termYears), 0);
  const stressRatePercent = Math.max(finiteNumber(inputs.stressRatePercent), 0);
  const months = termYears > 0 ? Math.round(termYears * 12) : 0;
  const monthlyRate = monthlyRateFromAnnualPercent(annualRatePercent);
  const stressMonthlyRate = monthlyRateFromAnnualPercent(stressRatePercent);
  const monthlyPayment = amortisingMonthlyPayment(loanAmount, monthlyRate, termYears);
  const stressMonthlyPayment = amortisingMonthlyPayment(loanAmount, stressMonthlyRate, termYears);
  const totalPaid = monthlyPayment * months;
  const stressTotalPaid = stressMonthlyPayment * months;

  return {
    months,
    monthlyRate,
    stressMonthlyRate,
    monthlyPayment,
    stressMonthlyPayment,
    totalPaid,
    totalInterest: Math.max(0, totalPaid - loanAmount),
    stressTotalPaid,
    stressTotalInterest: Math.max(0, stressTotalPaid - loanAmount),
  };
}
