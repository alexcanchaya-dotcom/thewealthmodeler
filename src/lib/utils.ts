export function formatCurrency(value: number, maximumFractionDigits = 0, currency: 'USD' | 'EUR' = 'USD') {
  return value.toLocaleString(currency === 'EUR' ? 'en-IE' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits,
  });
}

export function formatNumber(value: number, maximumFractionDigits = 1) {
  return value.toLocaleString('en-US', {
    maximumFractionDigits,
  });
}

export function calculateSavingsRate(income: number, expenses: number) {
  if (income <= 0) return 0;
  const savings = Math.max(income - expenses, 0);
  return savings / income;
}
