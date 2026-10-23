// "How many years must the money last?" maths. Pure functions, no imports,
// so the unit tests can load this file directly.

export interface RemainingYearsInputs {
  age: number;
  planToAge: number;
  retireAge: number;
  spending: number;
  savings: number;
  yearlySaving: number;
  /** Real return as a decimal, e.g. 0.04 for 4%. */
  realReturn: number;
}

export interface BalancePoint {
  age: number;
  balance: number;
}

export interface RemainingYearsResult {
  /** Age money starts being drawn: the later of retire age and current age. */
  retirementStartAge: number;
  yearsInRetirement: number;
  yearsToRetirement: number;
  needed: number;
  fourPercentRule: number;
  have: number;
  gap: number;
  surplus: number;
  /** Years "have" lasts at this spending. Infinity if it never runs out. */
  runwayYears: number;
  /** Age money runs out, or null if it never runs out. */
  runsOutAge: number | null;
  balances: BalancePoint[];
}

export const PLAN_TO_MIN = 50;
export const PLAN_TO_MAX = 110;

/** Reads `?to=NN` safely. Integer 50..110 only, anything else is ignored. */
export function parsePlanTo(raw: string | null | undefined): number | null {
  if (raw == null) return null;
  const s = String(raw).trim();
  if (!/^\d{2,3}$/.test(s)) return null;
  const n = Number(s);
  return n >= PLAN_TO_MIN && n <= PLAN_TO_MAX ? n : null;
}

export const AGE_MIN = 18;
export const AGE_MAX = 100;
export const RETIRE_MIN = 18;
export const RETIRE_MAX = 110;
export const RETURN_MAX_PCT = 8;

export interface RawFormValues {
  age: number;
  planToAge: number;
  retireAge: number;
  spending: number;
  savings: number;
  yearlySaving: number;
  realReturnPct: number;
}

/** True only when every input is a finite number inside its allowed range. */
export function isValidInput(v: RawFormValues): boolean {
  const ok = (x: number, min: number, max: number) => Number.isFinite(x) && x >= min && x <= max;
  return (
    ok(v.age, AGE_MIN, AGE_MAX) &&
    ok(v.planToAge, PLAN_TO_MIN, PLAN_TO_MAX) &&
    Number.isInteger(v.planToAge) &&
    ok(v.retireAge, RETIRE_MIN, RETIRE_MAX) &&
    ok(v.spending, 0, 1e9) &&
    ok(v.savings, 0, 1e10) &&
    ok(v.yearlySaving, 0, 1e9) &&
    ok(v.realReturnPct, 0, RETURN_MAX_PCT)
  );
}

/** Present value of `spending` a year for `years` years at rate r. */
export function moneyNeeded(spending: number, r: number, years: number): number {
  if (years <= 0 || spending <= 0) return 0;
  if (r === 0) return spending * years;
  return (spending * (1 - Math.pow(1 + r, -years))) / r;
}

export function fourPercentRule(spending: number): number {
  return Math.max(spending, 0) * 25;
}

/** Future value of savings plus yearly saving after y years at rate r. */
export function moneyAtRetirement(savings: number, yearlySaving: number, r: number, years: number): number {
  const y = Math.max(years, 0);
  if (r === 0) return savings + yearlySaving * y;
  const g = Math.pow(1 + r, y);
  return savings * g + (yearlySaving * (g - 1)) / r;
}

/** NPER: years a balance lasts when `spending` is taken each year at rate r. */
export function runwayYears(balance: number, spending: number, r: number): number {
  if (balance <= 0) return 0;
  if (spending <= 0) return Infinity;
  if (r === 0) return balance / spending;
  const ratio = (balance * r) / spending;
  if (ratio >= 1) return Infinity; // returns cover spending forever
  return -Math.log(1 - ratio) / Math.log(1 + r);
}

function finite(n: number, fallback = 0): number {
  return Number.isFinite(n) ? n : fallback;
}

export function calculateRemainingYears(raw: RemainingYearsInputs): RemainingYearsResult {
  const age = finite(raw.age);
  const planToAge = finite(raw.planToAge);
  const retireAge = finite(raw.retireAge);
  const spending = Math.max(finite(raw.spending), 0);
  const savings = Math.max(finite(raw.savings), 0);
  const yearlySaving = Math.max(finite(raw.yearlySaving), 0);
  const r = finite(raw.realReturn);

  // If the retire age is already past, retirement starts now (current age).
  const startRetire = Math.max(retireAge, age);
  const yearsInRetirement = Math.max(planToAge - startRetire, 0);
  const yearsToRetirement = Math.max(retireAge - age, 0);
  const needed = moneyNeeded(spending, r, yearsInRetirement);
  const have = moneyAtRetirement(savings, yearlySaving, r, yearsToRetirement);
  const diff = needed - have;
  const runway = runwayYears(have, spending, r);

  // Balance by age: grow with saving until retirement, then grow and withdraw at
  // year end (same timing as the annuity and NPER formulas above).
  const balances: BalancePoint[] = [];
  const endAge = Math.max(planToAge, startRetire) + 5;
  let bal = savings;
  for (let a = age; a <= endAge && a - age <= 120; a++) {
    balances.push({ age: a, balance: Math.max(bal, 0) });
    if (a < startRetire) bal = bal * (1 + r) + yearlySaving;
    else bal = bal * (1 + r) - spending;
  }

  return {
    retirementStartAge: startRetire,
    yearsInRetirement,
    yearsToRetirement,
    needed,
    fourPercentRule: fourPercentRule(spending),
    have,
    gap: Math.max(diff, 0),
    surplus: Math.max(-diff, 0),
    runwayYears: runway,
    runsOutAge: Number.isFinite(runway) ? startRetire + runway : null,
    balances,
  };
}
