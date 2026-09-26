import { CalculatorJsonLd } from '@/components/JsonLd';
import { calcMetadata } from '@/lib/calculator-registry';

export const metadata = calcMetadata('emergency-fund-months');

export default function EmergencyFundMonthsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CalculatorJsonLd slug="emergency-fund-months" />
      {children}
    </>
  );
}
