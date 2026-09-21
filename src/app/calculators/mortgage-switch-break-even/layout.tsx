import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage Switch Break-Even (Ireland) | The Wealth Modeler',
  description:
    'If you switch to a cheaper mortgage rate, how long until legal, valuation, and exit fees are paid back. Example figures — change them. Not advice.',
};

export default function MortgageSwitchBreakEvenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
