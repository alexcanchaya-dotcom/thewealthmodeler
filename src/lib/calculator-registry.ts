// Single SEO registry for every calculator under src/app/calculators/<slug>.
// Adding a calculator = add ONE entry here, then in its layout.tsx use
//   export const metadata = calcMetadata('<slug>');
// and render <CalculatorJsonLd slug="<slug>" />. The sitemap, title, meta
// description, canonical URL, Open Graph tags and WebApplication JSON-LD are
// all derived from this entry. `npm test` (also run before `npm run build`)
// fails if a calculator folder has no entry here.
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL } from '@/lib/site';

// 'ireland' = Irish model (badge "Ireland"); 'us' = US model badge.
export type CalculatorRegion = 'ireland' | 'us';

export interface CalculatorSeo {
  slug: string;
  /** Short name used in the <title>, before "calculator (Ireland|US)". */
  name: string;
  region: CalculatorRegion;
  /** Plain-words meta description of the free result. No sign-up talk. */
  description: string;
}

export const calculatorRegistry: CalculatorSeo[] = [
  {
    slug: 'compound-interest',
    name: 'Compound interest',
    region: 'us',
    description:
      'Free compound interest calculator. See how your investments grow with monthly contributions and annual compounding: final amount, total contributions, interest earned and a yearly breakdown.',
  },
  {
    slug: 'fire',
    name: 'FIRE',
    region: 'us',
    description:
      'Free FIRE calculator. Find your FIRE number, years and age until financial independence, your savings rate and how much to save each month, with Coast FIRE and Barista FIRE scenarios.',
  },
  {
    slug: 'retirement',
    name: 'Retirement',
    region: 'us',
    description:
      'Free retirement calculator. Estimate your retirement balance, monthly income using the 4% rule, and how many years your savings may last.',
  },
  {
    slug: 'irish-take-home-fire',
    name: 'Irish take-home to FIRE',
    region: 'ireland',
    description:
      'Free Irish take-home pay and FIRE calculator. See your take-home after PAYE, USC, PRSI and pension, then how many years until financial independence using Irish numbers.',
  },
  {
    slug: 'how-much-can-i-borrow',
    name: 'How much can I borrow',
    region: 'ireland',
    description:
      'Free Irish mortgage borrowing calculator. See roughly how much you could borrow from your income and deposit, using the lower of a simple loan-to-income and loan-to-value cap.',
  },
  {
    slug: 'mortgage-repayment',
    name: 'Mortgage repayment',
    region: 'ireland',
    description:
      'Free Irish mortgage repayment calculator. See what a mortgage costs per month at your quoted rate, plus a check at a higher stress rate.',
  },
  {
    slug: 'state-savings-vs-bank',
    name: 'State Savings vs bank',
    region: 'ireland',
    description:
      'Free calculator comparing Irish State Savings (tax-free) with a bank deposit after 33% DIRT, so you can see which leaves you with more.',
  },
  {
    slug: 'mortgage-vs-rent',
    name: 'Mortgage vs rent',
    region: 'ireland',
    description:
      'Free mortgage vs rent calculator. For the same home, see whether renting or buying is cheaper each month using Irish-style numbers.',
  },
  {
    slug: 'emergency-fund-months',
    name: 'Emergency fund months',
    region: 'ireland',
    description:
      'Free emergency fund calculator. See how many months of essential expenses your rainy-day cash covers.',
  },
  {
    slug: 'pension-vs-take-home',
    name: 'Pension vs take-home',
    region: 'ireland',
    description:
      'Free Irish pension contribution calculator. See how much your take-home pay drops after tax relief if you pay more into your pension, and how much more goes into the pot.',
  },
  {
    slug: 'car-finance-vs-cash',
    name: 'Car finance vs cash',
    region: 'ireland',
    description:
      'Free car finance vs cash calculator. For the same car, see whether monthly finance or paying cash costs less over the term, using a simple Irish-style APR model.',
  },
  {
    slug: 'rent-rise-vs-move',
    name: 'Rent rise vs move',
    region: 'ireland',
    description:
      'Free rent increase calculator. If your landlord raises the rent, see whether staying or moving is cheaper over the time frame you choose.',
  },
  {
    slug: 'mortgage-overpay-vs-cash',
    name: 'Mortgage overpay vs cash',
    region: 'ireland',
    description:
      'Free mortgage overpayment calculator. See how much interest you save and how many months sooner you finish if you overpay, compared with keeping that cash.',
  },
  {
    slug: 'help-to-buy-deposit-runway',
    name: 'Help to Buy deposit runway',
    region: 'ireland',
    description:
      'Free house deposit calculator. See how many months until you have your deposit, and how much sooner an optional Help to Buy boost gets you there.',
  },
  {
    slug: 'state-pension-prsi-gap',
    name: 'State Pension / PRSI gap',
    region: 'ireland',
    description:
      'Free State Pension gap calculator. See how much of your retirement spending the Irish State Pension covers, and the monthly gap to fill from savings.',
  },
  {
    slug: 'local-property-tax',
    name: 'Local Property Tax',
    region: 'ireland',
    description:
      'Free Local Property Tax (LPT) calculator. Get an estimate of the LPT you might pay from your property market value and an optional local adjustment.',
  },
  {
    slug: 'dirt-savings-interest',
    name: 'DIRT on savings interest',
    region: 'ireland',
    description:
      'Free DIRT calculator. See how much DIRT is taken from the interest on your savings and how much interest you keep.',
  },
];

const REGION_LABEL: Record<CalculatorRegion, string> = { ireland: 'Ireland', us: 'US' };

export function getCalculator(slug: string): CalculatorSeo {
  const calc = calculatorRegistry.find((c) => c.slug === slug);
  if (!calc) throw new Error(`No calculator registry entry for "${slug}" (src/lib/calculator-registry.ts)`);
  return calc;
}

export const calculatorPath = (slug: string) => `/calculators/${slug}`;

/** "<Name> calculator (Ireland)" — the <title> without the site suffix. */
export function calculatorHeading(calc: CalculatorSeo): string {
  return `${calc.name} calculator (${REGION_LABEL[calc.region]})`;
}

export function calcMetadata(slug: string): Metadata {
  const calc = getCalculator(slug);
  const title = `${calculatorHeading(calc)} | ${SITE_NAME}`;
  const path = calculatorPath(slug);
  return {
    title,
    description: calc.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: calc.description,
      url: path,
      siteName: SITE_NAME,
      type: 'website',
    },
  };
}

export function calculatorJsonLd(slug: string) {
  const calc = getCalculator(slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: calculatorHeading(calc),
    description: calc.description,
    url: `${SITE_URL}${calculatorPath(slug)}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}
