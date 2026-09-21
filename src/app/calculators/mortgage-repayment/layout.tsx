import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Repayment (Ireland) | The Wealth Modeler',
  description:
    'What would this mortgage cost per month at your quoted rate, plus a higher stress-rate check. Example figures — change them. Not advice.',
};

export default function MortgageRepaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
