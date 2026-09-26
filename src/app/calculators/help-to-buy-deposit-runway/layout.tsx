import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('help-to-buy-deposit-runway');

export default function HelpToBuyDepositRunwayLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="help-to-buy-deposit-runway" />
      {children}
    </>
  );
}
