import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('state-pension-prsi-gap');

export default function StatePensionPrsiGapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="state-pension-prsi-gap" />
      {children}
    </>
  );
}
