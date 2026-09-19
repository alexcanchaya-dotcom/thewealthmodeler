import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pension vs Take-Home (Ireland) | The Wealth Modeler',
  description:
    'If you put more into your pension, how much does take-home drop after tax relief, and how much more goes into the pot. Example figures — change them. Not advice.',
};

export default function PensionVsTakeHomeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
