import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mortgage vs Rent (Ireland) | The Wealth Modeler',
  description:
    'Same home, same month — is renting or buying cheaper this month using Irish-style numbers. Example figures — change them. Not advice.',
};

export default function MortgageVsRentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
