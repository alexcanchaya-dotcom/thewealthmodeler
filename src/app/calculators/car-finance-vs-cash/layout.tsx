import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('car-finance-vs-cash');

export default function CarFinanceVsCashLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="car-finance-vs-cash" />
      {children}
    </>
  );
}
