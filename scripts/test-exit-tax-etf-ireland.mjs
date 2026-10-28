// Unit tests for src/lib/exit-tax-etf-ireland.ts. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';

const src = readFileSync('src/lib/exit-tax-etf-ireland.ts', 'utf8');
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const file = join(mkdtempSync(join(tmpdir(), 'et-')), 'exit-tax.mjs');
writeFileSync(file, out);
const m = await import(file);

const base = { amount: 10000, growthPercent: 7, years: 8 };

test('defaults at 35%', () => {
  const r = m.calculateExitTax({ ...base, ratePercent: 35 });
  assert.equal(r.finalValue, 17181.86);
  assert.equal(r.gain, 7181.86);
  assert.equal(r.totalTax, 2513.65);
  assert.equal(r.leftAfterTax, 14668.21);
  assert.equal(r.deemedDisposals.length, 0);
  const eur = (v) => '€' + Math.round(v).toLocaleString('en-IE');
  assert.equal(m.exitTaxHeadline(10000, r.leftAfterTax, eur), 'About €14,668 left after exit tax');
});

test('defaults at 38%', () => {
  const r = m.calculateExitTax({ ...base, ratePercent: 38 });
  assert.equal(r.totalTax, 2729.11);
  assert.equal(r.leftAfterTax, 14452.75);
});

test('16 years: deemed disposal at year 8 is credited on sale', () => {
  const r = m.calculateExitTax({ ...base, years: 16, ratePercent: 35 });
  assert.equal(r.deemedDisposals.length, 1);
  assert.equal(r.deemedDisposals[0].year, 8);
  assert.equal(r.deemedDisposals[0].tax, 2513.65);
  assert.equal(r.finalValue, 29521.64);
  assert.equal(r.gain, 19521.64);
  assert.equal(r.taxAtSale, 4318.92);
  assert.equal(r.totalTax, 6832.57);
  assert.equal(r.leftAfterTax, 22689.06);
});

test('fall after deemed disposal gives refund note, tax floored at 0', () => {
  // Value grows then the sale value is below the year-8 value.
  const r = m.calculateExitTax({ amount: 10000, growthPercent: -1, years: 16, ratePercent: 35 });
  assert.equal(r.taxAtSale, 0);
  assert.equal(r.totalTax, 0);
});
