import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Property Tax (Ireland) | The Wealth Modeler',
  description:
    'About how much Local Property Tax you might pay from property market value and an optional local adjustment. Example figures — change them. Not advice.',
};

export default function LocalPropertyTaxLayout({ children }: { children: React.ReactNode }) {
  return children;
}
