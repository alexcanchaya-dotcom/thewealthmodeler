import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('mortgage-repayment');

export default function MortgageRepaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="mortgage-repayment" />
      {children}
    </>
  );
}
