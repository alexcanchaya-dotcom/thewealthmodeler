export interface YearlyBalance {
  year: number;
  balance: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: YearlyBalance[];
}
