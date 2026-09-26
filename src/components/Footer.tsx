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

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-glass-line bg-glass backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">The Wealth Modeler</h3>
          <p className="text-sm text-ink-body">Free tools for financial independence and retirement planning.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-ink-body">
          {footerLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-primary">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="text-sm text-ink-muted">© {new Date().getFullYear()} The Wealth Modeler</div>
      </div>
    </footer>
  );
}
