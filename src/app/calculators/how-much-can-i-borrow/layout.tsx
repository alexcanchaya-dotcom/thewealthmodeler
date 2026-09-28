import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('how-much-can-i-borrow');

export default function HowMuchCanIBorrowLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="how-much-can-i-borrow" />
      {children}
    </>
  );
}
