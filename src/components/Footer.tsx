import Link from 'next/link';

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Calculators', href: '/calculators/compound-interest' },
  { name: 'FIRE', href: '/calculators/fire' },
  { name: 'Ireland FIRE', href: '/calculators/irish-take-home-fire' },
  { name: 'State Savings vs bank', href: '/calculators/state-savings-vs-bank' },
  { name: 'Mortgage vs rent', href: '/calculators/mortgage-vs-rent' },
  { name: 'Emergency fund months', href: '/calculators/emergency-fund-months' },
  { name: 'Pension vs take-home', href: '/calculators/pension-vs-take-home' },
  { name: 'Car finance vs cash', href: '/calculators/car-finance-vs-cash' },
  { name: 'Rent rise vs move', href: '/calculators/rent-rise-vs-move' },
  { name: 'Mortgage overpay vs cash', href: '/calculators/mortgage-overpay-vs-cash' },
  { name: 'Help to Buy deposit runway', href: '/calculators/help-to-buy-deposit-runway' },
  { name: 'State Pension / PRSI gap', href: '/calculators/state-pension-prsi-gap' },
  { name: 'How much can I borrow', href: '/calculators/how-much-can-i-borrow' },
  { name: 'Mortgage repayment', href: '/calculators/mortgage-repayment' },
  { name: 'Local Property Tax', href: '/calculators/local-property-tax' },
  { name: 'DIRT on savings interest', href: '/calculators/dirt-savings-interest' },
  { name: 'Retirement', href: '/calculators/retirement' },
  { name: 'About', href: '/about' },
  { name: 'Privacy', href: '/privacy' },
];

// Single shared footer (rendered once in the root layout) = single source for the copyright year.
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-glass-line bg-glass backdrop-blur">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[16rem_minmax(0,1fr)_auto] md:items-start md:gap-12">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">The Wealth Modeler</h3>
          <p className="text-sm text-ink-body">Free tools for financial independence and retirement planning.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-ink-body">
          {footerLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-primary">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="whitespace-nowrap text-sm text-ink-muted">© {new Date().getFullYear()} The Wealth Modeler</div>
      </div>
    </footer>
  );
}
