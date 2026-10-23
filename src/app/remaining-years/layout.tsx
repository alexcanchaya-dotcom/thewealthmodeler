import type { Metadata } from 'next';

// Branch-only draft: kept out of the calculator registry (so not in the
// sitemap) and out of the nav, and marked noindex until it is approved.
export const metadata: Metadata = {
  title: 'How Many Years Must Your Money Last?',
  description:
    'Free estimate. Pick an age your money must last to and see how much you need at retirement, how much you are on track to have, and when it runs out.',
  robots: { index: false, follow: false },
};

export default function RemainingYearsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
