import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Fund Months (Ireland) | The Wealth Modeler',
  description:
    'How many months of essential expenses your rainy-day cash covers. Example figures — change them. Not advice.',
};

export default function EmergencyFundMonthsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
