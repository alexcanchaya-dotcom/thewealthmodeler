import type { Metadata } from 'next';

// Canonical site origin. The apex (thewealthmodeler.com) redirects to www.
export const SITE_URL = 'https://www.thewealthmodeler.com';
export const SITE_NAME = 'The Wealth Modeler';

/** Metadata for a non-calculator page: title, description, canonical, Open Graph. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website' },
  };
}

/** Non-calculator public pages, listed in the sitemap. */
export const STATIC_PAGES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/about', priority: 0.5 },
  { path: '/privacy', priority: 0.3 },
];
