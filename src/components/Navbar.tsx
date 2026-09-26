'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, CalculatorIcon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  {
    name: 'Calculators',
    href: '/calculators/compound-interest',
    icon: CalculatorIcon,
    children: [
      { name: 'Compound Interest', href: '/calculators/compound-interest' },
      { name: 'FIRE', href: '/calculators/fire' },
      { name: 'Retirement', href: '/calculators/retirement' },
      { name: 'Irish Take-Home → FIRE', href: '/calculators/irish-take-home-fire' },
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
    ],
  },
  { name: 'About', href: '/about', icon: InformationCircleIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-night/70 text-white backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          The Wealth Modeler
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              {item.children ? (
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 text-sm font-medium text-white/85 transition hover:text-white',
                    pathname === item.href && 'text-white'
                  )}
                >
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              )}

              {item.children && isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute right-0 mt-3 w-64 rounded-xl border border-glass-line bg-night/95 p-3 text-white shadow-xl backdrop-blur-xl"
                >
                  <div className="flex flex-col space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-glass-subtle"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <button
          className="rounded-lg p-2 hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-b border-glass-line bg-night/95 px-4 pb-4 pt-2 text-white shadow-lg backdrop-blur-xl">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-glass-line pb-2">
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </span>
                      <span className="text-xs text-ink-muted">Tap to expand</span>
                    </summary>
                    <div className="mt-2 space-y-1 pl-7">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-body transition hover:bg-glass-subtle"
                          onClick={() => setIsOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 py-2 text-sm font-semibold text-white transition hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
