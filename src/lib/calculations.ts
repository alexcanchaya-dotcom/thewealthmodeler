export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): {
  finalAmount: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: Array<{ year: number; balance: number }>;
} {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  const yearlyBreakdown: Array<{ year: number; balance: number }> = [{ year: 0, balance }];

  for (let month = 1; month <= years * 12; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      yearlyBreakdown.push({ year: month / 12, balance });
    }
  }

  const totalContributions = principal + monthlyContribution * years * 12;
  const totalInterest = balance - totalContributions;

  return {
    finalAmount: balance,
    totalContributions,
    totalInterest,
    yearlyBreakdown,
  };
}

export function calculateFIRENumber(annualExpenses: number, withdrawalRate: number = 0.04): number {
  return annualExpenses / withdrawalRate;
}

export function calculateYearsToFIRE(
  currentSavings: number,
  annualSavings: number,
  targetAmount: number,
  expectedReturn: number
): number {
  const monthlyRate = expectedReturn / 100 / 12;
  let balance = currentSavings;
  let months = 0;
  const monthlyContribution = annualSavings / 12;

  // Iterate up to 80 years of saving as a guardrail
  while (balance < targetAmount && months < 80 * 12) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months += 1;

    // Avoid infinite loops when contributions and growth are both zero
    if (monthlyContribution === 0 && monthlyRate === 0) {
      break;
    }
  }

  return months / 12;
}

export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  currentSavings: number,
  monthlyContribution: number,
  expectedReturn: number,
  annualSpending: number
): {
  retirementBalance: number;
  yearsOfRetirement: number;
  monthlyIncome: number;
} {
  const monthsToRetirement = Math.max(retirementAge - currentAge, 0) * 12;
  const monthlyRate = expectedReturn / 100 / 12;
  let balance = currentSavings;

  for (let month = 0; month < monthsToRetirement; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
  }

  const retirementBalance = balance;
  const monthlyIncome = retirementBalance * 0.04 / 12;
  const yearsOfRetirement = annualSpending > 0 ? retirementBalance / annualSpending : Number.POSITIVE_INFINITY;

  return {
    retirementBalance,
    yearsOfRetirement,
    monthlyIncome,
  };
}
