/** Standard monthly rate: AER% / 12. This is not (1 + AER)^(1/12) − 1. */
export function monthlyRateFromAer(aerPercent: number): number {
  if (!Number.isFinite(aerPercent) || aerPercent <= 0) return 0;
  return aerPercent / 100 / 12;
}

/**
 * Standard amortising monthly payment:
 * P = L × r × (1+r)^n / ((1+r)^n − 1)
 */
export function scheduledMonthlyPayment(balance: number, monthlyRate: number, termYears: number): number {
  if (!Number.isFinite(balance) || balance <= 0) return 0;
  if (!Number.isFinite(termYears) || termYears <= 0) return 0;
  const months = Math.round(termYears * 12);
  if (months <= 0) return 0;
  if (!Number.isFinite(monthlyRate) || monthlyRate <= 0) return balance / months;
  const factor = (1 + monthlyRate) ** months;
  return (balance * monthlyRate * factor) / (factor - 1);
}

export const DEFAULT_BALANCE = 280000;
export const DEFAULT_AER = 3.5;
export const DEFAULT_TERM_YEARS = 25;
export const DEFAULT_EXTRA = 200;
export const DEFAULT_CASH_AER = 1.25;
export const DEFAULT_SCHEDULED_PAYMENT = Math.round(
  scheduledMonthlyPayment(DEFAULT_BALANCE, monthlyRateFromAer(DEFAULT_AER), DEFAULT_TERM_YEARS)
);

/** 50-year cap so a payment that never covers interest cannot spin forever. */
export const MAX_AMORTISATION_MONTHS = 50 * 12;
export const PAYMENT_TOO_LOW_MESSAGE = 'Payment does not cover monthly interest — loan never pays off';

export interface AmortisationResult {
  totalInterest: number;
  payoffMonths: number;
  paidOff: boolean;
}

export interface MortgageOverpayInputs {
  balance: number;
  aerPercent: number;
  termYears: number;
  scheduledPayment: number;
  extraMonthly: number;
  cashAerPercent: number;
}

export interface MortgageOverpayResult {
  baseline: AmortisationResult;
  overpay: AmortisationResult;
  interestSaved: number;
  monthsCut: number;
  extraMonthly: number;
  cashPile: number;
  cashOpportunity: number;
  cashYears: number;
  cashAerPercent: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Month-by-month amortisation. Last payment can be smaller than `monthlyPayment`.
 * Stops if the payment does not cover that month's interest, or if the month cap is hit.
 */
export function runAmortisation(
  balance: number,
  monthlyRate: number,
  monthlyPayment: number,
  maxMonths = MAX_AMORTISATION_MONTHS
): AmortisationResult {
  const startBalance = Math.max(finiteNumber(balance), 0);
  const rate = Math.max(finiteNumber(monthlyRate), 0);
  const payment = Math.max(finiteNumber(monthlyPayment), 0);
  const cap = Math.max(Math.round(finiteNumber(maxMonths, MAX_AMORTISATION_MONTHS)), 0);

  if (startBalance <= 0) {
    return { totalInterest: 0, payoffMonths: 0, paidOff: true };
  }
  if (cap <= 0 || payment <= 0) {
    return { totalInterest: 0, payoffMonths: 0, paidOff: false };
  }

  let remaining = startBalance;
  let totalInterest = 0;
  let months = 0;

  while (remaining > 0 && months < cap) {
    const interest = remaining * rate;
    if (payment <= interest) {
      return { totalInterest, payoffMonths: months, paidOff: false };
    }
    const principal = Math.min(payment - interest, remaining);
    remaining -= principal;
    totalInterest += interest;
    months += 1;
    if (remaining < 0.005) {
      remaining = 0;
    }
  }

  return {
    totalInterest,
    payoffMonths: months,
    paidOff: remaining <= 0,
  };
}

/** S × ((1 + R)^years − 1) where S is the uncompounded pile of extras. */
export function cashOpportunityInterest(pile: number, aerPercent: number, years: number): number {
  const safePile = Math.max(finiteNumber(pile), 0);
  const safeYears = Math.max(finiteNumber(years), 0);
  const rate = finiteNumber(aerPercent) / 100;
  if (safePile <= 0 || safeYears <= 0) return 0;
  if (!Number.isFinite(rate) || rate === 0) return 0;
  return safePile * ((1 + rate) ** safeYears - 1);
}

export function overpayHeadline(
  interestSaved: number,
  monthsCut: number,
  formatEur: (value: number) => string
): string {
  const saved = Math.max(finiteNumber(interestSaved), 0);
  const cut = Math.max(Math.round(finiteNumber(monthsCut)), 0);
  return `Overpaying saves ${formatEur(saved)} interest and finishes ~${cut} months sooner`;
}

export function cashPileCopy(
  pile: number,
  aerPercent: number,
  opportunity: number,
  formatEur: (value: number) => string
): string {
  const rateLabel = Number.isFinite(aerPercent) ? String(aerPercent) : '0';
  return `Cash pile of extras (~${formatEur(Math.max(finiteNumber(pile), 0))}) at ${rateLabel}% AER ≈ ${formatEur(
    Math.max(finiteNumber(opportunity), 0)
  )} over that period`;
}

export function calculateMortgageOverpayVsCash(inputs: MortgageOverpayInputs): MortgageOverpayResult {
  const balance = Math.max(finiteNumber(inputs.balance), 0);
  const aerPercent = Math.max(finiteNumber(inputs.aerPercent), 0);
  const termYears = Math.max(finiteNumber(inputs.termYears), 0);
  const scheduledPayment = Math.max(finiteNumber(inputs.scheduledPayment), 0);
  const extraMonthly = Math.max(finiteNumber(inputs.extraMonthly), 0);
  const cashAerPercent = Math.max(finiteNumber(inputs.cashAerPercent), 0);
  const monthlyRate = monthlyRateFromAer(aerPercent);
  const termMonths = Math.max(Math.round(termYears * 12), 0);
  const cap = Math.max(termMonths, MAX_AMORTISATION_MONTHS);

  const baseline = runAmortisation(balance, monthlyRate, scheduledPayment, cap);
  const overpay = runAmortisation(balance, monthlyRate, scheduledPayment + extraMonthly, cap);

  const interestSaved = Math.max(0, baseline.totalInterest - overpay.totalInterest);
  const monthsCut = Math.max(0, baseline.payoffMonths - overpay.payoffMonths);
  const cashPile = extraMonthly * overpay.payoffMonths;
  const cashYears = overpay.payoffMonths / 12;
  const opportunity = cashOpportunityInterest(cashPile, cashAerPercent, cashYears);

  return {
    baseline,
    overpay,
    interestSaved,
    monthsCut,
    extraMonthly,
    cashPile,
    cashOpportunity: opportunity,
    cashYears,
    cashAerPercent,
  };
}
