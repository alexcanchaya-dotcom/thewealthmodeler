interface AffiliateProduct {
  name: string;
  description: string;
  href: string;
  tag: string;
}

const PRODUCTS: Record<string, AffiliateProduct[]> = {
  'compound-interest': [
    {
      name: 'Fidelity',
      description: 'Commission-free investing with zero account minimums. Great for index funds.',
      href: 'https://www.fidelity.com', // Replace with your affiliate link
      tag: 'Brokerage',
    },
    {
      name: 'M1 Finance',
      description: 'Automated portfolio investing with no trading fees.',
      href: 'https://www.m1finance.com', // Replace with your affiliate link
      tag: 'Robo-Advisor',
    },
    {
      name: 'The Simple Path to Wealth',
      description: "JL Collins' definitive guide to index fund investing and financial independence.",
      href: 'https://www.amazon.com/Simple-Path-Wealth-financial-independence/dp/1533667926', // Replace with affiliate link
      tag: 'Book',
    },
  ],
  fire: [
    {
      name: 'Empower (Personal Capital)',
      description: 'Track your net worth, spending, and investments all in one free dashboard.',
      href: 'https://www.empower.com', // Replace with affiliate link
      tag: 'Net Worth Tracker',
    },
    {
      name: 'YNAB',
      description: 'Zero-based budgeting to maximise your savings rate and reach FIRE faster.',
      href: 'https://www.ynab.com', // Replace with affiliate link
      tag: 'Budgeting',
    },
    {
      name: 'Your Money or Your Life',
      description: 'The book that started the FIRE movement. A must-read for every aspiring early retiree.',
      href: 'https://www.amazon.com/Your-Money-Life-Transforming-Relationship/dp/0143115766', // Replace with affiliate link
      tag: 'Book',
    },
  ],
  retirement: [
    {
      name: 'Vanguard',
      description: 'Low-cost index funds and IRAs from the pioneer of passive investing.',
      href: 'https://www.vanguard.com', // Replace with affiliate link
      tag: 'Brokerage / IRA',
    },
    {
      name: 'Charles Schwab',
      description: 'No-fee IRAs and a wide range of low-cost investment options.',
      href: 'https://www.schwab.com', // Replace with affiliate link
      tag: 'IRA Provider',
    },
    {
      name: 'Die With Zero',
      description: "Bill Perkins' guide to spending your money for maximum life experiences before it's too late.",
      href: 'https://www.amazon.com/Die-Zero-Getting-Your-Money/dp/0358567297', // Replace with affiliate link
      tag: 'Book',
    },
  ],
};

interface AffiliateLinksProps {
  calculator: keyof typeof PRODUCTS;
}

export default function AffiliateLinks({ calculator }: AffiliateLinksProps) {
  const products = PRODUCTS[calculator] ?? [];

  return (
    <div className="card space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase text-primary">Sponsored Resources</p>
        <h3 className="text-lg font-semibold text-gray-900">Recommended Tools &amp; Books</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <a
            key={product.name}
            href={product.href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-primary hover:bg-blue-50"
          >
            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-primary">
              {product.tag}
            </span>
            <p className="mt-2 text-sm font-bold text-gray-900 group-hover:text-primary">{product.name}</p>
            <p className="mt-1 text-xs text-gray-600">{product.description}</p>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        * Some links are affiliate links. We may earn a small commission at no extra cost to you.
      </p>
    </div>
  );
}
