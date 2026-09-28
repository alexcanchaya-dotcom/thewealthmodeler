import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('mortgage-vs-rent');

export default function MortgageVsRentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="mortgage-vs-rent" />
      {children}
    </>
  );
}
