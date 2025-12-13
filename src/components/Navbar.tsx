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
    href: '/calculators/compound-interest',    icon: CalculatorIcon,
        icon: CalculatorIcon,
    children: [
      { name: 'Compound Interest', href: '/calculators/compound-interest' },
      { name: 'FIRE', href: '/calculators/fire' },
      { name: 'Retirement', href: '/calculators/retirement' },
    ],
  },
  { name: 'About', href: '/about', icon: InformationCircleIcon },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-primary text-white shadow-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
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
                  className="flex items-center gap-2 text-sm font-semibold transition hover:text-blue-100"
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-2 text-sm font-semibold transition hover:text-blue-100',
                    pathname === item.href && 'text-blue-100'
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
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-white p-3 text-gray-900 shadow-xl"
                >
                  <div className="flex flex-col space-y-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-gray-100"
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
          <div className="space-y-1 bg-white px-4 pb-4 pt-2 text-gray-800 shadow-lg">
            {navItems.map((item) => (
              <div key={item.name} className="border-b border-gray-100 pb-2">
                {item.children ? (
                  <details className="group">
                    <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 text-primary" />
                        {item.name}
                      </span>
                      <span className="text-xs text-gray-500">Tap to expand</span>
                    </summary>
                    <div className="mt-2 space-y-1 pl-7">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
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
                    className="flex items-center gap-2 py-2 text-sm font-semibold text-gray-800 transition hover:text-primary"
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
