import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'State Savings vs Bank (DIRT) | The Wealth Modeler',
  description:
    'Compare Irish State Savings (tax-free) with a bank deposit after 33% DIRT. Example figures — change them. Not advice.',
};

export default function StateSavingsVsBankLayout({ children }: { children: React.ReactNode }) {
  return children;
}
