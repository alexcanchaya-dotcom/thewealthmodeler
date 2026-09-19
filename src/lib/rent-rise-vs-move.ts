export const EVEN_THRESHOLD_EUR = 50;

export type ComparisonWinner = 'stay' | 'move' | 'even';

export interface RentRiseVsMoveInputs {
  currentRent: number;
  newRent: number;
  moveCost: number;
  horizonMonths: number;
  newPlaceRent: number;
}

export interface RentRiseVsMoveResult {
  extraPerMonth: number;
  stayCost: number;
  moveCostOneTime: number;
  moveCostOverHorizon: number;
  newPlaceExtraOverHorizon: number;
  winner: ComparisonWinner;
  difference: number;
  breakEvenMonths: number | null;
  horizonMonths: number;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Extra rent if you stay: newRent − currentRent. Can be zero or negative (no rise / cut). */
export function extraRentPerMonth(newRent: number, currentRent: number): number {
  return finiteNumber(newRent) - finiteNumber(currentRent);
}

export function stayCostOverHorizon(extraPerMonth: number, horizonMonths: number): number {
  const months = Math.max(Math.round(finiteNumber(horizonMonths)), 0);
  return finiteNumber(extraPerMonth) * months;
}

/**
 * Incremental move cost vs staying on current rent:
 * one-time move cost + any extra at the new place (never a credit if cheaper).
 */
export function moveCostOverHorizon(
  moveCost: number,
  newPlaceRent: number,
  currentRent: number,
  horizonMonths: number
): number {
  const oneTime = Math.max(finiteNumber(moveCost), 0);
  const months = Math.max(Math.round(finiteNumber(horizonMonths)), 0);
  const newPlaceExtra = Math.max(0, (finiteNumber(newPlaceRent) - finiteNumber(currentRent)) * months);
  return oneTime + newPlaceExtra;
}

/** Break-even months = moveCost ÷ extra. Null when extra ≤ 0 to avoid divide-by-zero. */
export function breakEvenMonths(moveCost: number, extraPerMonth: number): number | null {
  if (!Number.isFinite(extraPerMonth) || extraPerMonth <= 0) return null;
  const oneTime = Math.max(finiteNumber(moveCost), 0);
  return oneTime / extraPerMonth;
}

export function compareStayVsMove(
  stayCost: number,
  moveCost: number,
  evenThreshold = EVEN_THRESHOLD_EUR
): { winner: ComparisonWinner; amount: number } {
  const stay = finiteNumber(stayCost);
  const move = finiteNumber(moveCost);
  const difference = stay - move;
  if (Math.abs(difference) < evenThreshold) {
    return { winner: 'even', amount: Math.abs(difference) };
  }
  if (difference > 0) {
    return { winner: 'move', amount: difference };
  }
  return { winner: 'stay', amount: -difference };
}

export function comparisonHeadline(
  winner: ComparisonWinner,
  amount: number,
  horizonMonths: number,
  formatEur: (value: number) => string
): string {
  const months = Math.max(Math.round(finiteNumber(horizonMonths)), 0);
  const monthLabel = months === 1 ? '1 month' : `${months} months`;
  if (winner === 'even') return 'About even';
  if (winner === 'stay') return `Staying costs ${formatEur(amount)} less over ${monthLabel}`;
  return `Moving costs ${formatEur(amount)} less over ${monthLabel}`;
}

export function breakEvenCopy(extraPerMonth: number, months: number | null): string {
  if (!(extraPerMonth > 0) || months === null) {
    if (extraPerMonth < 0) {
      return 'Rent is going down — staying has no rise to pay back';
    }
    return 'No rent rise — moving does not pay back';
  }
  const rounded = Math.round(months);
  return `Move pays back after ~${rounded} months of the rise`;
}

export function calculateRentRiseVsMove(inputs: RentRiseVsMoveInputs): RentRiseVsMoveResult {
  const currentRent = Math.max(finiteNumber(inputs.currentRent), 0);
  const newRent = Math.max(finiteNumber(inputs.newRent), 0);
  const oneTime = Math.max(finiteNumber(inputs.moveCost), 0);
  const horizonMonths = Math.max(Math.round(finiteNumber(inputs.horizonMonths)), 0);
  const newPlaceRent = Math.max(finiteNumber(inputs.newPlaceRent), 0);

  const extraPerMonth = extraRentPerMonth(newRent, currentRent);
  const stayCost = stayCostOverHorizon(extraPerMonth, horizonMonths);
  const newPlaceExtraOverHorizon = Math.max(0, (newPlaceRent - currentRent) * horizonMonths);
  const moveTotal = oneTime + newPlaceExtraOverHorizon;
  const comparison = compareStayVsMove(stayCost, moveTotal);

  return {
    extraPerMonth,
    stayCost,
    moveCostOneTime: oneTime,
    moveCostOverHorizon: moveTotal,
    newPlaceExtraOverHorizon,
    winner: comparison.winner,
    difference: comparison.amount,
    breakEvenMonths: breakEvenMonths(oneTime, extraPerMonth),
    horizonMonths,
  };
}
