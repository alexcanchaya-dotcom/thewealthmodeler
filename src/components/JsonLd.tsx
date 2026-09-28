import { calculatorJsonLd } from '@/lib/calculator-registry';

// Renders schema.org JSON-LD. Invisible: a <script> tag only.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function CalculatorJsonLd({ slug }: { slug: string }) {
  return <JsonLd data={calculatorJsonLd(slug)} />;
}
