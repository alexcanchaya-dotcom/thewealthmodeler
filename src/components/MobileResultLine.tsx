import { ReactNode } from 'react';

interface MobileResultLineProps {
  children: ReactNode;
}

/**
 * One short live result line shown under the page title on phones only (< 768px),
 * so the answer is visible without scrolling past the inputs. It only displays a value
 * the page has already worked out; the full result cards stay where they are.
 * Hidden from md (768px) up via CSS, so desktop is unchanged.
 */
export default function MobileResultLine({ children }: MobileResultLineProps) {
  return (
    <p
      aria-live="polite"
      data-mobile-result-line=""
      className="mt-3 rounded-xl border border-primary/40 bg-primary/15 px-4 py-2.5 text-base font-semibold text-white md:hidden"
    >
      {children}
    </p>
  );
}
