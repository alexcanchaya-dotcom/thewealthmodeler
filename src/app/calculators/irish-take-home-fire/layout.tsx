import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Irish Take-Home → FIRE Calculator | The Wealth Modeler',
  description:
    'Ireland take-home and FIRE using Irish numbers. Example figures — change them. Not advice.',
};

export default function IrishTakeHomeFireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
