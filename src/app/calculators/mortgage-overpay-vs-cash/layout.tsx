import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('mortgage-overpay-vs-cash');

export default function MortgageOverpayVsCashLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="mortgage-overpay-vs-cash" />
      {children}
    </>
  );
}
