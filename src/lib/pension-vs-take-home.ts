export const RELIEF_RATE_STANDARD = 0.2;
export const RELIEF_RATE_HIGHER = 0.4;
export const RELIEF_RATES = [RELIEF_RATE_STANDARD, RELIEF_RATE_HIGHER] as const;
export type ReliefRate = (typeof RELIEF_RATES)[number];
export type ContributionDirection = 'increase' | 'decrease' | 'unchanged';

export interface PensionVsTakeHomeInputs {
  grossMonthly: number;
  currentPercent: number;
  newPercent: number;
  reliefRate: number;
  employerMatchPercent: number;
}

export interface PensionVsTakeHomeResult {
  extraContribution: number;
  netTakeHomeHit: number;
  extraIntoPot: number;
  annualisedNetCost: number;
  direction: ContributionDirection;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function asRate(value: number): number {
  const rate = finiteNumber(value);
  if (rate > 1) return rate / 100;
  return Math.min(Math.max(rate, 0), 1);
}

/** Extra employee contribution / month = gross × (new% − current%) / 100 */
export function extraContribution(grossMonthly: number, currentPercent: number, newPercent: number): number {
  const gross = Math.max(finiteNumber(grossMonthly), 0);
  const current = finiteNumber(currentPercent);
  const next = finiteNumber(newPercent);
  return (gross * (next - current)) / 100;
}

/** Net take-home hit / month = extra × (1 − reliefRate) */
export function netTakeHomeChange(extra: number, reliefRate: number): number {
  return extra * (1 - asRate(reliefRate));
}

/** Extra into pot / month = extra + (gross × employerMatch% / 100) */
export function extraIntoPot(extra: number, grossMonthly: number, employerMatchPercent: number): number {
  const gross = Math.max(finiteNumber(grossMonthly), 0);
  const matchPercent = Math.max(finiteNumber(employerMatchPercent), 0);
  return extra + (gross * matchPercent) / 100;
}

export function contributionDirection(extra: number): ContributionDirection {
  if (extra > 0) return 'increase';
  if (extra < 0) return 'decrease';
  return 'unchanged';
}

export function calculatePensionVsTakeHome(inputs: PensionVsTakeHomeInputs): PensionVsTakeHomeResult {
  const extra = extraContribution(inputs.grossMonthly, inputs.currentPercent, inputs.newPercent);
  const netHit = netTakeHomeChange(extra, inputs.reliefRate);
  return {
    extraContribution: extra,
    netTakeHomeHit: netHit,
    extraIntoPot: extraIntoPot(extra, inputs.grossMonthly, inputs.employerMatchPercent),
    annualisedNetCost: netHit * 12,
    direction: contributionDirection(extra),
  };
}

export function takeHomeHeadline(
  direction: ContributionDirection,
  netTakeHomeHit: number,
  formatEur: (value: number) => string
): string {
  const amount = formatEur(Math.abs(netTakeHomeHit));
  if (direction === 'decrease') {
    return `Take-home rises by ${amount} / month after relief`;
  }
  if (direction === 'unchanged') {
    return 'Take-home is unchanged after relief';
  }
  return `Take-home drops by ${amount} / month after relief`;
}
