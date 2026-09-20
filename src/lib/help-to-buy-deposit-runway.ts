export const MONTHLY_SAVE_GUARD_MESSAGE = 'Enter a monthly save amount';
export const ENOUGH_HEADLINE = 'You already have enough';

export const DEFAULT_HOME_PRICE = 350000;
export const DEFAULT_DEPOSIT_PERCENT = 10;
export const DEFAULT_ALREADY_SAVED = 5000;
export const DEFAULT_MONTHLY_SAVE = 800;
export const DEFAULT_HTB_BOOST = 0;

export interface HelpToBuyDepositInputs {
  homePrice: number;
  depositPercent: number;
  alreadySaved: number;
  monthlySave: number;
  htbBoost: number;
}

export interface HelpToBuyDepositResult {
  targetDeposit: number;
  gap: number;
  months: number | null;
  alreadyEnough: boolean;
  htbBoost: number;
  monthlySave: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Target deposit = price × deposit% / 100 */
export function targetDeposit(homePrice: number, depositPercent: number): number {
  return Math.max(0, finiteNumber(homePrice) * finiteNumber(depositPercent) / 100);
}

/** Gap = max(0, target − alreadySaved − htbBoost) */
export function depositGap(target: number, alreadySaved: number, htbBoost: number): number {
  const saved = Math.max(finiteNumber(alreadySaved), 0);
  const boost = Math.max(finiteNumber(htbBoost), 0);
  return Math.max(0, finiteNumber(target) - saved - boost);
}

/** Whole months of saving needed. Null when there is a gap but no monthly save. */
export function monthsToDeposit(gap: number, monthlySave: number): number | null {
  const safeGap = Math.max(finiteNumber(gap), 0);
  if (safeGap <= 0) return 0;
  const save = finiteNumber(monthlySave);
  if (!(save > 0)) return null;
  return Math.ceil(safeGap / save);
}

export function headlineForResult(result: HelpToBuyDepositResult): string {
  if (result.alreadyEnough) return ENOUGH_HEADLINE;
  if (result.months === null) return MONTHLY_SAVE_GUARD_MESSAGE;
  return `About ${result.months} months to your deposit`;
}

export function addCalendarMonths(from: Date, months: number): Date {
  const next = new Date(from.getTime());
  next.setMonth(next.getMonth() + Math.max(Math.round(finiteNumber(months)), 0));
  return next;
}

export function formatRoughMonthYear(date: Date): string {
  return date.toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
}

export function calculateHelpToBuyDeposit(inputs: HelpToBuyDepositInputs): HelpToBuyDepositResult {
  const homePrice = Math.max(finiteNumber(inputs.homePrice), 0);
  const depositPercent = Math.max(finiteNumber(inputs.depositPercent), 0);
  const alreadySaved = Math.max(finiteNumber(inputs.alreadySaved), 0);
  const monthlySave = finiteNumber(inputs.monthlySave);
  const htbBoost = Math.max(finiteNumber(inputs.htbBoost), 0);

  const target = targetDeposit(homePrice, depositPercent);
  const gap = depositGap(target, alreadySaved, htbBoost);
  const months = monthsToDeposit(gap, monthlySave);

  return {
    targetDeposit: target,
    gap,
    months,
    alreadyEnough: gap <= 0,
    htbBoost,
    monthlySave,
  };
}
