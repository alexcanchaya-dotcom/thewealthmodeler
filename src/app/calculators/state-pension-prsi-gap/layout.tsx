import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'State Pension / PRSI Gap (Ireland) | The Wealth Modeler',
  description:
    'How much of your retirement spend the State Pension covers, and the monthly gap to fill from savings. Example figures — change them. Not advice.',
};

export default function StatePensionPrsiGapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
