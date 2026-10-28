import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('exit-tax-etf-ireland');

export default function ExitTaxEtfIrelandLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="exit-tax-etf-ireland" />
      {children}
    </>
  );
}
