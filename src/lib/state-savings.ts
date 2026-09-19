export const DIRT_RATE = 0.33;
export const EVEN_THRESHOLD_EUR = 50;

export const TERM_YEARS_OPTIONS = [3, 5, 6, 10] as const;
export type TermYears = (typeof TERM_YEARS_OPTIONS)[number];

export interface StateSavingsProduct {
  id: string;
  termYears: Exclude<TermYears, 6>;
  name: string;
  label: string;
  totalReturn: number;
  aer: number;
}

export const STATE_SAVINGS_PRODUCTS: readonly StateSavingsProduct[] = [
  {
    id: 'savings-bond-3',
    termYears: 3,
    name: '3-Year Savings Bond',
    label: '3-Year Savings Bond — 6% total return (1.96% AER)',
    totalReturn: 0.06,
    aer: 0.0196,
  },
  {
    id: 'savings-certificate-5',
    termYears: 5,
    name: '5-Year Savings Certificate',
    label: '5-Year Savings Certificate — 12% total (2.29% AER)',
    totalReturn: 0.12,
    aer: 0.0229,
  },
  {
    id: 'national-solidarity-bond-10',
    termYears: 10,
    name: '10-Year National Solidarity Bond',
    label: '10-Year National Solidarity Bond — 30% total (2.66% AER)',
    totalReturn: 0.3,
    aer: 0.0266,
  },
];

export const DEFAULT_STATE_SAVINGS_PRODUCT_ID = 'savings-certificate-5';

export const INSTALMENT_SAVINGS_NOTE =
  '6-Year Instalment Savings — 13.5% total (2.33% AER) is a monthly plan, so it is not in this lump-sum comparison.';

export function getStateSavingsProduct(id: string) {
  return STATE_SAVINGS_PRODUCTS.find((product) => product.id === id);
}

export function getStateSavingsProductByTerm(termYears: number) {
  return STATE_SAVINGS_PRODUCTS.find((product) => product.termYears === termYears);
}

/** Tax-free hold-to-term: lump × (1 + total return). */
export function calculateStateSavingsNet(lumpSum: number, totalReturn: number) {
  return lumpSum * (1 + totalReturn);
}

/**
 * Compound yearly at gross AER, then tax interest only at DIRT.
 * Bank net = principal + interest × (1 − DIRT).
 */
export function calculateBankNetAfterDirt(
  lumpSum: number,
  grossAerPercent: number,
  termYears: number,
  dirtRate = DIRT_RATE
) {
  const grossEnd = lumpSum * (1 + grossAerPercent / 100) ** termYears;
  const interest = grossEnd - lumpSum;
  return lumpSum + interest * (1 - dirtRate);
}

export type ComparisonWinner = 'state' | 'bank' | 'even';

export function compareBalances(stateNet: number, bankNet: number, evenThreshold = EVEN_THRESHOLD_EUR) {
  const difference = stateNet - bankNet;
  if (Math.abs(difference) < evenThreshold) {
    return { winner: 'even' as const, amount: Math.abs(difference) };
  }
  if (difference > 0) {
    return { winner: 'state' as const, amount: difference };
  }
  return { winner: 'bank' as const, amount: -difference };
}

export function comparisonHeadline(
  winner: ComparisonWinner,
  amount: number,
  formatEur: (value: number) => string
) {
  if (winner === 'even') return 'About even';
  if (winner === 'state') return `State Savings wins by ${formatEur(amount)}`;
  return `Bank wins by ${formatEur(amount)}`;
}
