import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('state-savings-vs-bank');

export default function StateSavingsVsBankLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="state-savings-vs-bank" />
      {children}
    </>
  );
}
