import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Overpay vs Cash (Ireland) | The Wealth Modeler',
  description:
    'If you overpay the mortgage, how much interest you save and how many months sooner you finish versus keeping that cash liquid. Example figures — change them. Not advice.',
};

export default function MortgageOverpayVsCashLayout({ children }: { children: React.ReactNode }) {
  return children;
}
