// Fails if a calculator folder is missing from the SEO registry, or its
// layout.tsx does not use calcMetadata / CalculatorJsonLd. Runs as `npm test`
// and before `npm run build`, so a new calculator can't ship without SEO.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/app/calculators';
const registry = readFileSync('src/lib/calculator-registry.ts', 'utf8');
const registered = new Set([...registry.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]));
const errors = [];

for (const slug of readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  if (!existsSync(join(dir, slug, 'page.tsx'))) continue;
  if (!registered.has(slug)) errors.push(`${slug}: add an entry to src/lib/calculator-registry.ts`);
  const layout = join(dir, slug, 'layout.tsx');
  const src = existsSync(layout) ? readFileSync(layout, 'utf8') : '';
  if (!src.includes(`calcMetadata('${slug}')`)) errors.push(`${slug}: layout.tsx must export metadata = calcMetadata('${slug}')`);
  if (!src.includes(`<CalculatorJsonLd slug="${slug}"`)) errors.push(`${slug}: layout.tsx must render <CalculatorJsonLd slug="${slug}" />`);
}
for (const slug of registered) {
  if (!existsSync(join(dir, slug, 'page.tsx'))) errors.push(`${slug}: in the registry but src/app/calculators/${slug}/page.tsx does not exist`);
}

if (errors.length) {
  console.error('SEO registry check failed:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`SEO registry check passed (${registered.size} calculators).`);
