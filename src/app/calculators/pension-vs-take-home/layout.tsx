import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('pension-vs-take-home');

export default function PensionVsTakeHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="pension-vs-take-home" />
      {children}
    </>
  );
}
