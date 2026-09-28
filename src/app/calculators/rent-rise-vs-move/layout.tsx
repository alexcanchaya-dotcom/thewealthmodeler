import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('rent-rise-vs-move');

export default function RentRiseVsMoveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="rent-rise-vs-move" />
      {children}
    </>
  );
}
