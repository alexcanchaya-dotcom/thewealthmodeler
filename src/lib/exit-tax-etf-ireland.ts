// Exit tax on ETFs (Ireland), simplified model.
// Gain = final value - cost. Every 8 years held (before the sale year) a deemed
// disposal charges tax on the gain to date. On the final sale, tax already paid
// on deemed disposals is credited against the tax on the full gain.
export const DEFAULT_AMOUNT = 10000;
export const DEFAULT_GROWTH_PERCENT = 7;
export const DEFAULT_YEARS = 8;
export const RATE_FROM_2027 = 35;
export const RATE_2026 = 38;
export const DEEMED_DISPOSAL_YEARS = 8;

export interface ExitTaxInputs {
  amount: number;
  growthPercent: number;
  years: number;
  ratePercent: number;
}

export interface DeemedDisposal {
  year: number;
  value: number;
  gainToDate: number;
  tax: number;
}

export interface ExitTaxResult {
  finalValue: number;
  gain: number;
  totalTax: number;
  deemedDisposals: DeemedDisposal[];
  deemedTaxPaid: number;
  taxAtSale: number;
  refundDue: number;
  leftAfterTax: number;
}

const fin = (v: number) => (Number.isFinite(v) ? v : 0);
const round2 = (v: number) => Math.round(v * 100) / 100;

export function calculateExitTax(inputs: ExitTaxInputs): ExitTaxResult {
  const amount = Math.max(fin(inputs.amount), 0);
  const g = fin(inputs.growthPercent) / 100;
  const years = Math.max(Math.floor(fin(inputs.years)), 0);
  const rate = Math.max(fin(inputs.ratePercent), 0) / 100;
  const valueAt = (y: number) => amount * Math.pow(1 + g, y);

  const deemedDisposals: DeemedDisposal[] = [];
  let deemedTaxPaid = 0;
  for (let y = DEEMED_DISPOSAL_YEARS; y < years; y += DEEMED_DISPOSAL_YEARS) {
    const value = valueAt(y);
    const gainToDate = value - amount;
    // Tax on the full gain to date, less deemed-disposal tax already paid.
    const tax = Math.max(rate * gainToDate - deemedTaxPaid, 0);
    deemedTaxPaid += tax;
    deemedDisposals.push({ year: y, value: round2(value), gainToDate: round2(gainToDate), tax: round2(tax) });
  }

  const finalValue = valueAt(years);
  const gain = finalValue - amount;
  const raw = rate * Math.max(gain, 0) - deemedTaxPaid;
  const taxAtSale = Math.max(raw, 0);
  const refundDue = raw < 0 ? -raw : 0;
  const totalTax = deemedTaxPaid + taxAtSale - refundDue;
  return {
    finalValue: round2(finalValue),
    gain: round2(gain),
    totalTax: round2(totalTax),
    deemedDisposals,
    deemedTaxPaid: round2(deemedTaxPaid),
    taxAtSale: round2(taxAtSale),
    refundDue: round2(refundDue),
    leftAfterTax: round2(finalValue - totalTax),
  };
}

export function exitTaxHeadline(amount: number, left: number, fmt: (v: number) => string): string {
  if (!(amount > 0)) return 'Enter an amount to see a figure';
  return `About ${fmt(left)} left after exit tax`;
}
