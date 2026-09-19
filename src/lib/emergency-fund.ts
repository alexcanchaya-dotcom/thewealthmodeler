export const BAND_MIN_MONTHS = 3;
export const BAND_MAX_MONTHS = 6;
export const EXPENSES_GUARD_MESSAGE = 'Enter monthly expenses';

export type EmergencyFundBand = 'under' | 'inside' | 'above';

export interface EmergencyFundInputs {
  monthlyExpenses: number;
  cash: number;
  monthlySurplus: number;
}

export interface EmergencyFundResult {
  monthsCovered: number;
  shortfallToThree: number;
  monthsToSix: number | null;
  band: EmergencyFundBand;
}

function finiteNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

/** Months of expenses covered, rounded to 1 decimal place. */
export function monthsCovered(cash: number, monthlyExpenses: number): number | null {
  if (!(monthlyExpenses > 0) || !Number.isFinite(monthlyExpenses) || !Number.isFinite(cash)) {
    return null;
  }
  return Math.round((Math.max(cash, 0) / monthlyExpenses) * 10) / 10;
}

export function bandForMonths(months: number): EmergencyFundBand {
  if (months < BAND_MIN_MONTHS) return 'under';
  if (months <= BAND_MAX_MONTHS) return 'inside';
  return 'above';
}

/** Euro shortfall to reach the 3-month floor. */
export function shortfallToThreeMonths(cash: number, monthlyExpenses: number): number {
  const safeCash = Math.max(finiteNumber(cash), 0);
  const safeExpenses = finiteNumber(monthlyExpenses);
  return Math.max(0, Math.round(BAND_MIN_MONTHS * safeExpenses - safeCash));
}

/** Whole months of surplus needed to reach 6 months of expenses. */
export function monthsToReachSix(cash: number, monthlyExpenses: number, monthlySurplus: number): number | null {
  if (!(monthlyExpenses > 0) || !(monthlySurplus > 0)) return null;
  const covered = monthsCovered(cash, monthlyExpenses);
  if (covered === null || covered >= BAND_MAX_MONTHS) return null;
  const remaining = BAND_MAX_MONTHS * monthlyExpenses - Math.max(finiteNumber(cash), 0);
  if (remaining <= 0) return null;
  return Math.ceil(remaining / monthlySurplus);
}

export function calculateEmergencyFund(inputs: EmergencyFundInputs): EmergencyFundResult | { error: string } {
  const monthlyExpenses = finiteNumber(inputs.monthlyExpenses);
  if (monthlyExpenses <= 0) {
    return { error: EXPENSES_GUARD_MESSAGE };
  }

  const cash = Math.max(finiteNumber(inputs.cash), 0);
  const monthlySurplus = finiteNumber(inputs.monthlySurplus);
  const covered = monthsCovered(cash, monthlyExpenses);

  if (covered === null) {
    return { error: EXPENSES_GUARD_MESSAGE };
  }

  return {
    monthsCovered: covered,
    shortfallToThree: shortfallToThreeMonths(cash, monthlyExpenses),
    monthsToSix: monthsToReachSix(cash, monthlyExpenses, monthlySurplus),
    band: bandForMonths(covered),
  };
}
