import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Much Can I Borrow (Ireland) | The Wealth Modeler',
  description:
    'Roughly how much mortgage you could borrow from income and deposit, using a simple LTI and LTV cap. Example figures — change them. Not advice.',
};

export default function HowMuchCanIBorrowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
