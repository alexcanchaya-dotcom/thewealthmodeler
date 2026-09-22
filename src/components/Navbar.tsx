'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, CalculatorIcon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {
  CAR_FINANCE_VS_CASH_BADGE,
  EMERGENCY_FUND_BADGE,
  HELP_TO_BUY_DEPOSIT_BADGE,
  HOW_MUCH_CAN_I_BORROW_BADGE,
  IRELAND_BADGE,
  LOCAL_PROPERTY_TAX_BADGE,
  MORTGAGE_OVERPAY_VS_CASH_BADGE,
  MORTGAGE_REPAYMENT_BADGE,
  STATE_PENSION_PRSI_GAP_BADGE,
  MORTGAGE_VS_RENT_BADGE,
  PENSION_VS_TAKE_HOME_BADGE,
  RENT_RISE_VS_MOVE_BADGE,
  STATE_SAVINGS_BADGE,
} from '@/lib/irish-copy';

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
  const irelandBadge =
    pathname === '/calculators/state-savings-vs-bank'
      ? STATE_SAVINGS_BADGE
      : pathname === '/calculators/irish-take-home-fire'
        ? IRELAND_BADGE
        : pathname === '/calculators/mortgage-vs-rent'
          ? MORTGAGE_VS_RENT_BADGE
          : pathname === '/calculators/emergency-fund-months'
            ? EMERGENCY_FUND_BADGE
            : pathname === '/calculators/pension-vs-take-home'
              ? PENSION_VS_TAKE_HOME_BADGE
              : pathname === '/calculators/car-finance-vs-cash'
                ? CAR_FINANCE_VS_CASH_BADGE
                : pathname === '/calculators/rent-rise-vs-move'
                  ? RENT_RISE_VS_MOVE_BADGE
                  : pathname === '/calculators/mortgage-overpay-vs-cash'
                    ? MORTGAGE_OVERPAY_VS_CASH_BADGE
                    : pathname === '/calculators/help-to-buy-deposit-runway'
                      ? HELP_TO_BUY_DEPOSIT_BADGE
                      : pathname === '/calculators/state-pension-prsi-gap'
                        ? STATE_PENSION_PRSI_GAP_BADGE
                        : pathname === '/calculators/how-much-can-i-borrow'
                          ? HOW_MUCH_CAN_I_BORROW_BADGE
                          : pathname === '/calculators/mortgage-repayment'
                            ? MORTGAGE_REPAYMENT_BADGE
                            : pathname === '/calculators/local-property-tax'
                              ? LOCAL_PROPERTY_TAX_BADGE
                              : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-mist/80 bg-white/90 text-text shadow-soft backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
            The Wealth Modeler
          </Link>
          <span className="w-fit rounded-full border border-mist bg-background px-2.5 py-0.5 text-[11px] font-medium leading-snug text-muted">
            {irelandBadge ?? 'US model — rules differ in Ireland & EU'}
          </span>
        </div>

        <nav className="hidden items-center space-x-5 md:flex">
          {navItems.map((item) => (
            <div key={item.name} className="relative">
              {item.children ? (
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-text transition hover:text-primary"
                >
                  <item.icon className="h-4 w-4 text-muted" />
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 text-sm font-medium transition hover:text-primary',
                    pathname === item.href ? 'text-primary' : 'text-text'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4 text-muted" />}
                  {item.name}
                </Link>
              )}

              {item.children && isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute right-0 mt-3 max-h-[70vh] w-72 overflow-y-auto rounded-card border border-mist bg-white p-3 text-text shadow-card"
                >
                  <div className="flex flex-col space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="rounded-xl px-3 py-2 text-sm font-medium text-text transition hover:bg-background"
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
          className="rounded-xl p-2 text-text hover:bg-background md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-mist bg-white px-4 pb-4 pt-2 text-text shadow-soft">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-mist/70 pb-2">
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium">
                      <span className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </span>
                      <span className="text-xs text-muted">Tap to expand</span>
                    </summary>
                    <div className="mt-2 space-y-1 pl-7">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-background hover:text-text"
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
                    className="flex items-center gap-2 py-2 text-sm font-medium text-text transition hover:text-primary"
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
