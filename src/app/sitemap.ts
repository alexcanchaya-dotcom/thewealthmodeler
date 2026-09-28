import type { MetadataRoute } from 'next';
import { calculatorPath, calculatorRegistry } from '@/lib/calculator-registry';
import { SITE_URL, STATIC_PAGES } from '@/lib/site';

// Built from the calculator registry, so every registered calculator is listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...STATIC_PAGES.map(({ path, priority }) => ({
      url: path === '/' ? SITE_URL : `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority,
    })),
    ...calculatorRegistry.map((calc) => ({
      url: `${SITE_URL}${calculatorPath(calc.slug)}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
