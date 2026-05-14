import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Wealth Modeler - Investment & FIRE Calculator',
  description:
    'Free investment calculators for retirement planning and FIRE strategies. Calculate compound interest, FIRE numbers, and retirement savings.',
  keywords: ['retirement calculator', 'FIRE calculator', 'investment calculator', 'compound interest', 'financial independence'],
  openGraph: {
    title: 'The Wealth Modeler',
    description: 'Model your financial future with free calculators',
    url: 'https://thewealthmodeler.com',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text`}>
        {/* Google AdSense — replace ca-pub-XXXXXXXXXXXXXXXX with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navbar />
        <main className="fade-in mx-auto max-w-6xl px-4 pb-12 pt-10 md:pt-14">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
