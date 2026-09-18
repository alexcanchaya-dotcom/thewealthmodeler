/**
 * Simplified Irish PAYE / USC / PRSI for a single Class A employee.
 * Educational only — not Revenue advice. Figures are a 2026-shaped approximation.
 *
 * Worked example (gross €55,000, 5% employee pension):
 * - Pension €2,750; PAYE/USC base €52,250
 * - PAYE ≈ €8,100 after €4,000 credits
 * - USC ≈ €1,100; PRSI ≈ €2,310 (4.2% of gross)
 * - Take-home ≈ €40,740
 */

export const IRELAND_TAX_YEAR_LABEL = '2026 tax year (simplified)';

export const IRELAND_TAX_ASSUMPTIONS = {
  filingStatus: 'Single PAYE employee, PRSI Class A',
  standardRateBand: 44_000,
  standardRate: 0.2,
  higherRate: 0.4,
  personalTaxCredit: 2_000,
  employeeTaxCredit: 2_000,
  uscExemptLimit: 13_000,
  uscBands: [
    { upTo: 12_012, rate: 0.005 },
    { upTo: 28_700, rate: 0.02 },
    { upTo: 70_044, rate: 0.03 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.08 },
  ],
  /** Year-round 4.2%. Employee PRSI is scheduled to rise to 4.35% from 1 Oct 2026. */
  prsiRate: 0.042,
  /** About €352/week — below this, many employees pay no PRSI. */
  prsiExemptLimit: 18_304,
} as const;

export interface IrishTakeHomeResult {
  grossSalary: number;
  pensionContribution: number;
  taxablePay: number;
  paye: number;
  usc: number;
  prsi: number;
  totalTaxAndPrsi: number;
  takeHome: number;
}

function safeAmount(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function taxOnBands(income: number, bands: ReadonlyArray<{ upTo: number; rate: number }>): number {
  let previousCap = 0;
  let remaining = Math.max(income, 0);
  let tax = 0;

  for (const band of bands) {
    const slice = Math.min(remaining, band.upTo - previousCap);
    if (slice <= 0) break;
    tax += slice * band.rate;
    remaining -= slice;
    previousCap = band.upTo;
    if (remaining <= 0) break;
  }

  return tax;
}

export function calculateIrishTakeHome(grossSalary: number, employeePensionPercent = 0): IrishTakeHomeResult {
  const gross = safeAmount(grossSalary);
  const pensionRate = Number.isFinite(employeePensionPercent) ? Math.min(Math.max(employeePensionPercent, 0), 100) / 100 : 0;
  const pensionContribution = gross * pensionRate;
  const taxablePay = Math.max(gross - pensionContribution, 0);

  const rawPaye =
    taxablePay <= IRELAND_TAX_ASSUMPTIONS.standardRateBand
      ? taxablePay * IRELAND_TAX_ASSUMPTIONS.standardRate
      : IRELAND_TAX_ASSUMPTIONS.standardRateBand * IRELAND_TAX_ASSUMPTIONS.standardRate +
        (taxablePay - IRELAND_TAX_ASSUMPTIONS.standardRateBand) * IRELAND_TAX_ASSUMPTIONS.higherRate;
  const taxCredits = IRELAND_TAX_ASSUMPTIONS.personalTaxCredit + IRELAND_TAX_ASSUMPTIONS.employeeTaxCredit;
  const paye = Math.max(0, rawPaye - taxCredits);

  const usc = taxablePay <= IRELAND_TAX_ASSUMPTIONS.uscExemptLimit ? 0 : taxOnBands(taxablePay, IRELAND_TAX_ASSUMPTIONS.uscBands);
  const prsi = gross <= IRELAND_TAX_ASSUMPTIONS.prsiExemptLimit ? 0 : gross * IRELAND_TAX_ASSUMPTIONS.prsiRate;
  const totalTaxAndPrsi = paye + usc + prsi;
  const takeHome = Math.max(0, gross - totalTaxAndPrsi - pensionContribution);

  return {
    grossSalary: gross,
    pensionContribution,
    taxablePay,
    paye,
    usc,
    prsi,
    totalTaxAndPrsi,
    takeHome,
  };
}
