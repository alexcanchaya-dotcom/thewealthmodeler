import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Car Finance vs Cash (Ireland) | The Wealth Modeler',
  description:
    'Same car — does monthly finance or paying cash cost less over the term using a simple Irish-style APR model. Example figures — change them. Not advice.',
};

export default function CarFinanceVsCashLayout({ children }: { children: React.ReactNode }) {
  return children;
}
