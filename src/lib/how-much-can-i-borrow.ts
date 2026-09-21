export const DEFAULT_GROSS_ANNUAL_INCOME = 55000;
export const DEFAULT_OTHER_ANNUAL_INCOME = 0;
export const DEFAULT_LTI_MULTIPLE = 3.5;
export const DEFAULT_DEPOSIT = 35000;
export const DEFAULT_MAX_LTV_PERCENT = 90;

export const EMPTY_HEADLINE = 'Enter income and deposit to see a figure';

export interface HowMuchCanIBorrowInputs {
  grossAnnualIncome: number;
  otherAnnualIncome: number;
  ltiMultiple: number;
  deposit: number;
  maxLtvPercent: number;
}

export type BindingLimit = 'income' | 'ltv' | 'both';

export interface HowMuchCanIBorrowResult {
  totalIncome: number;
  incomeCap: number;
  /** Null when LTV% >= 100 — treat the LTV cap as unlimited. */
  ltvCap: number | null;
  borrowable: number;
  impliedProperty: number;
  binding: BindingLimit;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Total income = gross + other (floored at 0). */
export function totalIncome(grossAnnualIncome: number, otherAnnualIncome: number): number {
  return Math.max(finiteNumber(grossAnnualIncome), 0) + Math.max(finiteNumber(otherAnnualIncome), 0);
}

/** Max by income = total income × LTI. */
export function maxByIncome(income: number, ltiMultiple: number): number {
  return Math.max(finiteNumber(income), 0) * Math.max(finiteNumber(ltiMultiple), 0);
}

/**
 * Max by LTV = deposit × (LTV% / (100 − LTV%)) when LTV% < 100.
 * Otherwise the LTV cap is unlimited (`null`).
 */
export function maxByLtv(deposit: number, maxLtvPercent: number): number | null {
  const safeDeposit = Math.max(finiteNumber(deposit), 0);
  const ltv = finiteNumber(maxLtvPercent);
  if (!(ltv < 100)) return null;
  return safeDeposit * (ltv / (100 - ltv));
}

export function bindingLimit(incomeCap: number, ltvCap: number | null): BindingLimit {
  if (ltvCap === null) return 'income';
  if (incomeCap === ltvCap) return 'both';
  return incomeCap < ltvCap ? 'income' : 'ltv';
}

export function borrowHeadline(
  incomeCap: number,
  ltvCap: number | null,
  borrowable: number,
  formatEuro: (value: number) => string
): string {
  const bothCapsZero = incomeCap === 0 && ltvCap !== null && ltvCap === 0;
  if (bothCapsZero) return EMPTY_HEADLINE;
  return `You could borrow about ${formatEuro(borrowable)}`;
}

export function calculateHowMuchCanIBorrow(inputs: HowMuchCanIBorrowInputs): HowMuchCanIBorrowResult {
  const income = totalIncome(inputs.grossAnnualIncome, inputs.otherAnnualIncome);
  const incomeCap = maxByIncome(income, inputs.ltiMultiple);
  const ltvCap = maxByLtv(inputs.deposit, inputs.maxLtvPercent);
  const borrowable = ltvCap === null ? incomeCap : Math.min(incomeCap, ltvCap);
  const deposit = Math.max(finiteNumber(inputs.deposit), 0);

  return {
    totalIncome: income,
    incomeCap,
    ltvCap,
    borrowable,
    impliedProperty: borrowable + deposit,
    binding: bindingLimit(incomeCap, ltvCap),
  };
}
