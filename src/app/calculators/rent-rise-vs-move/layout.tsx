import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rent Rise vs Move (Ireland) | The Wealth Modeler',
  description:
    'Landlord raises rent — is staying or moving cheaper over a chosen horizon using Irish-style numbers. Example figures — change them. Not advice.',
};

export default function RentRiseVsMoveLayout({ children }: { children: React.ReactNode }) {
  return children;
}
