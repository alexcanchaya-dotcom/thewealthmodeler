import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DIRT on Savings Interest (Ireland) | The Wealth Modeler',
  description:
    'If your deposit earns this interest, how much DIRT is taken and what you keep. Example figures — change them. Not advice.',
};

export default function DirtSavingsInterestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
