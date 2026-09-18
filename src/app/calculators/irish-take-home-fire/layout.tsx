import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Irish Take-Home → FIRE Calculator | The Wealth Modeler',
  description:
    'Rough Irish take-home from salary (simplified PAYE, USC, PRSI), then years to FIRE. Educational numbers — not Revenue or financial advice.',
};

export default function IrishTakeHomeFireLayout({ children }: { children: React.ReactNode }) {
  return children;
}
