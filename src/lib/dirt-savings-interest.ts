export const DEFAULT_DEPOSIT = 10000;
export const DEFAULT_GROSS_RATE_PERCENT = 3.0;
export const DEFAULT_DIRT_RATE_PERCENT = 33;

export const EMPTY_DEPOSIT_HEADLINE = 'Enter a deposit to see a figure';
export const EMPTY_RATE_HEADLINE = 'Enter a rate to see a figure';

export interface DirtSavingsInterestInputs {
  deposit: number;
  grossRatePercent: number;
  dirtRatePercent: number;
}

export interface DirtSavingsInterestResult {
  deposit: number;
  grossRatePercent: number;
  dirtRatePercent: number;
  grossInterest: number;
  dirtTax: number;
  netInterest: number;
  effectiveRatePercent: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function dirtHeadline(
  deposit: number,
  grossRatePercent: number,
  netInterest: number,
  formatEuro: (value: number) => string
): string {
  if (Math.max(finiteNumber(deposit), 0) <= 0) return EMPTY_DEPOSIT_HEADLINE;
  if (Math.max(finiteNumber(grossRatePercent), 0) <= 0) return EMPTY_RATE_HEADLINE;
  return `About ${formatEuro(Math.round(finiteNumber(netInterest)))} left after DIRT`;
}

export function calculateDirtSavingsInterest(inputs: DirtSavingsInterestInputs): DirtSavingsInterestResult {
  const deposit = Math.max(finiteNumber(inputs.deposit), 0);
  const grossRatePercent = Math.max(finiteNumber(inputs.grossRatePercent), 0);
  const dirtRatePercent = Math.max(finiteNumber(inputs.dirtRatePercent), 0);
  const grossInterest = deposit * (grossRatePercent / 100);
  const dirtTax = grossInterest * (dirtRatePercent / 100);
  const netInterest = grossInterest - dirtTax;
  const effectiveRatePercent = grossRatePercent * (1 - dirtRatePercent / 100);

  return {
    deposit,
    grossRatePercent,
    dirtRatePercent,
    grossInterest,
    dirtTax,
    netInterest,
    effectiveRatePercent,
  };
}
