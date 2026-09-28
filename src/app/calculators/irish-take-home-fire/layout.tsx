import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('irish-take-home-fire');

export default function IrishTakeHomeFireLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="irish-take-home-fire" />
      {children}
    </>
  );
}
