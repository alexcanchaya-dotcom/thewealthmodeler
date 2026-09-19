export const EVEN_THRESHOLD_EUR = 100;

export type ComparisonWinner = 'cash' | 'finance' | 'even';

export interface CarFinanceVsCashInputs {
  price: number;
  deposit: number;
  termMonths: number;
  aprPercent: number;
  balloon: number;
}

export interface CarFinanceVsCashResult {
  amountFinanced: number;
  monthlyPayment: number;
  balloonUsed: number;
  totalPaidFinance: number;
  totalPaidCash: number;
  financeInterest: number;
  cashUpfrontAfterDeposit: number;
  winner: ComparisonWinner;
  difference: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Amount financed = max(0, price − deposit). Deposit is the same on either path. */
export function amountFinanced(price: number, deposit: number): number {
  const safePrice = Math.max(finiteNumber(price), 0);
  const safeDeposit = Math.max(finiteNumber(deposit), 0);
  return Math.max(0, safePrice - safeDeposit);
}

/**
 * Convert APR percent to an effective monthly rate: (1 + APR)^(1/12) − 1.
 * Same conversion as the mortgage calculator — this is not APR / 12.
 */
export function monthlyRateFromApr(aprPercent: number): number {
  if (!Number.isFinite(aprPercent) || aprPercent <= 0) return 0;
  return (1 + aprPercent / 100) ** (1 / 12) - 1;
}

/**
 * Standard balloon amortisation.
 *
 * Monthly payments reduce principal so that the remaining balance at the end of
 * `termMonths` equals the balloon (Guaranteed Future Value / optional final
 * payment). Equivalently: amortise (L − PV(balloon)) over the term.
 *
 *   P = r × (L × (1+r)^n − B) / ((1+r)^n − 1)
 *
 * When B = 0 this is a standard amortising loan. When r = 0, P = (L − B) / n.
 * Balloon is clamped to L so the payment cannot go negative.
 */
export function balloonMonthlyPayment(loan: number, monthlyRate: number, termMonths: number, balloon: number): number {
  if (!Number.isFinite(loan) || loan <= 0) return 0;
  const months = Math.round(finiteNumber(termMonths));
  if (months <= 0) return 0;
  const residual = Math.min(Math.max(finiteNumber(balloon), 0), loan);
  if (!Number.isFinite(monthlyRate) || monthlyRate <= 0) {
    return (loan - residual) / months;
  }
  const factor = (1 + monthlyRate) ** months;
  return (monthlyRate * (loan * factor - residual)) / (factor - 1);
}

export function totalPaidOnFinance(monthlyPayment: number, termMonths: number, balloon: number, deposit: number): number {
  const months = Math.max(Math.round(finiteNumber(termMonths)), 0);
  const payment = Math.max(finiteNumber(monthlyPayment), 0);
  const residual = Math.max(finiteNumber(balloon), 0);
  const down = Math.max(finiteNumber(deposit), 0);
  return payment * months + residual + down;
}

export function compareTotals(
  totalFinance: number,
  totalCash: number,
  evenThreshold = EVEN_THRESHOLD_EUR
): { winner: ComparisonWinner; amount: number } {
  const finance = Math.max(finiteNumber(totalFinance), 0);
  const cash = Math.max(finiteNumber(totalCash), 0);
  const difference = finance - cash;
  if (Math.abs(difference) < evenThreshold) {
    return { winner: 'even', amount: Math.abs(difference) };
  }
  if (difference > 0) {
    return { winner: 'cash', amount: difference };
  }
  return { winner: 'finance', amount: -difference };
}

export function comparisonHeadline(
  winner: ComparisonWinner,
  amount: number,
  formatEur: (value: number) => string
): string {
  if (winner === 'even') return 'About even';
  if (winner === 'cash') return `Cash costs ${formatEur(amount)} less over the term`;
  return `Finance costs ${formatEur(amount)} less over the term`;
}

export function calculateCarFinanceVsCash(inputs: CarFinanceVsCashInputs): CarFinanceVsCashResult {
  const price = Math.max(finiteNumber(inputs.price), 0);
  const deposit = Math.min(Math.max(finiteNumber(inputs.deposit), 0), price);
  const termMonths = Math.max(Math.round(finiteNumber(inputs.termMonths)), 0);
  const aprPercent = Math.max(finiteNumber(inputs.aprPercent), 0);
  const financed = amountFinanced(price, deposit);
  const balloonUsed = Math.min(Math.max(finiteNumber(inputs.balloon), 0), financed);
  const monthlyPayment = balloonMonthlyPayment(financed, monthlyRateFromApr(aprPercent), termMonths, balloonUsed);
  const totalPaidFinance = totalPaidOnFinance(monthlyPayment, termMonths, balloonUsed, deposit);
  const totalPaidCash = price;
  const financeInterest = Math.max(0, totalPaidFinance - price);
  const comparison = compareTotals(totalPaidFinance, totalPaidCash);

  return {
    amountFinanced: financed,
    monthlyPayment,
    balloonUsed,
    totalPaidFinance,
    totalPaidCash,
    financeInterest,
    cashUpfrontAfterDeposit: financed,
    winner: comparison.winner,
    difference: comparison.amount,
  };
}
