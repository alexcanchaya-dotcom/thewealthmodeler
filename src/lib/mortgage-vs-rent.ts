export const EVEN_THRESHOLD_EUR = 25;

export type DepositMode = 'percent' | 'euro';
export type ComparisonWinner = 'rent' | 'buy' | 'even';

export function depositNeeded(price: number, depositInput: number, mode: DepositMode): number {
  if (!Number.isFinite(price) || price <= 0) return 0;
  if (!Number.isFinite(depositInput) || depositInput < 0) return 0;
  if (mode === 'percent') {
    return Math.min(price, (price * depositInput) / 100);
  }
  return Math.min(price, depositInput);
}

export function loanSize(price: number, deposit: number): number {
  const safePrice = Number.isFinite(price) ? Math.max(price, 0) : 0;
  const safeDeposit = Number.isFinite(deposit) ? Math.max(deposit, 0) : 0;
  return Math.max(0, safePrice - safeDeposit);
}

/**
 * Convert AER (annual equivalent rate) percent to an effective monthly rate:
 * (1 + AER)^(1/12) − 1. This is not AER / 12.
 */
export function monthlyRateFromAer(aerPercent: number): number {
  if (!Number.isFinite(aerPercent) || aerPercent <= 0) return 0;
  return (1 + aerPercent / 100) ** (1 / 12) - 1;
}

/**
 * Standard amortising monthly payment:
 * P = L × r × (1+r)^n / ((1+r)^n − 1)
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

export function buyMonthlyTotal(mortgagePayment: number, otherMonthlyCosts: number): number {
  const payment = Number.isFinite(mortgagePayment) ? Math.max(mortgagePayment, 0) : 0;
  const extras = Number.isFinite(otherMonthlyCosts) ? Math.max(otherMonthlyCosts, 0) : 0;
  return payment + extras;
}

export function totalInterestIfHeldToTerm(loan: number, monthlyPayment: number, termYears: number): number {
  if (!Number.isFinite(loan) || loan <= 0) return 0;
  if (!Number.isFinite(termYears) || termYears <= 0) return 0;
  const months = Math.round(termYears * 12);
  if (months <= 0) return 0;
  const payment = Number.isFinite(monthlyPayment) ? Math.max(monthlyPayment, 0) : 0;
  return Math.max(0, payment * months - loan);
}

export function compareMonthly(
  rentMonthly: number,
  buyMonthly: number,
  evenThreshold = EVEN_THRESHOLD_EUR
) {
  const rent = Number.isFinite(rentMonthly) ? Math.max(rentMonthly, 0) : 0;
  const buy = Number.isFinite(buyMonthly) ? Math.max(buyMonthly, 0) : 0;
  const difference = rent - buy;
  if (Math.abs(difference) < evenThreshold) {
    return { winner: 'even' as const, amount: Math.abs(difference) };
  }
  if (difference > 0) {
    return { winner: 'buy' as const, amount: difference };
  }
  return { winner: 'rent' as const, amount: -difference };
}

export function comparisonHeadline(
  winner: ComparisonWinner,
  amount: number,
  formatEur: (value: number) => string
) {
  if (winner === 'even') return 'About even';
  if (winner === 'rent') return `Renting is cheaper by ${formatEur(amount)} / month`;
  return `Buying is cheaper by ${formatEur(amount)} / month`;
}
