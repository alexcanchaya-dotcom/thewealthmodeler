import Link from 'next/link';

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Calculators', href: '/calculators/compound-interest' },
  { name: 'FIRE', href: '/calculators/fire' },
  { name: 'Retirement', href: '/calculators/retirement' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Privacy', href: '/privacy' },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">The Wealth Modeler</h3>
          <p className="text-sm text-gray-600">Free tools for financial independence and retirement planning.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-gray-700">
          {footerLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-primary">
              {link.name}
            </Link>
          ))}
        </div>
        <div className="text-sm text-gray-500">© {new Date().getFullYear()} The Wealth Modeler</div>
      </div>
    </footer>
  );
}
