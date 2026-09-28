import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('dirt-savings-interest');

export default function DirtSavingsInterestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="dirt-savings-interest" />
      {children}
    </>
  );
}
