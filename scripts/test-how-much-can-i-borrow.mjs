// Unit tests for src/lib/how-much-can-i-borrow.ts. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';

const src = readFileSync('src/lib/how-much-can-i-borrow.ts', 'utf8');
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const file = join(mkdtempSync(join(tmpdir(), 'hb-')), 'hb.mjs');
writeFileSync(file, out);
const m = await import(file);

const base = { grossAnnualIncome: 55000, otherAnnualIncome: 0, deposit: 35000, maxLtvPercent: 90 };


test('buyer type multiples: first 4x (default), second 3.5x', () => {
  assert.equal(m.DEFAULT_BUYER_TYPE, 'first');
  assert.equal(m.ltiForBuyerType('first'), 4);
  assert.equal(m.ltiForBuyerType('second'), 3.5);
  assert.equal(m.DEFAULT_LTI_MULTIPLE, 4);
});

test('default first-time buyer result', () => {
  const r = m.calculateHowMuchCanIBorrow({ ...base, ltiMultiple: m.ltiForBuyerType('first') });
  assert.equal(r.incomeCap, 220000);
  assert.equal(r.ltvCap, 315000);
  assert.equal(r.borrowable, 220000);
  assert.equal(r.impliedProperty, 255000);
  assert.equal(r.binding, 'income');
});

test('buyer type LTV: first 90% (default), second 80%', () => {
  assert.equal(m.ltvForBuyerType('first'), 90);
  assert.equal(m.ltvForBuyerType('second'), 80);
  assert.equal(m.DEFAULT_MAX_LTV_PERCENT, 90);
});

test('second-time buyer: 3.5x income and 80% LTV, LTV binds', () => {
  const b = m.calculateHowMuchCanIBorrow({ ...base, ltiMultiple: m.ltiForBuyerType('second'), maxLtvPercent: m.ltvForBuyerType('second') });
  assert.equal(b.incomeCap, 192500);
  assert.equal(b.ltvCap, 140000);
  assert.equal(b.borrowable, 140000);
  assert.equal(b.impliedProperty, 175000);
  assert.equal(b.binding, 'ltv');
});

test('hint copy reflects selected type', () => {
  assert.match(m.ltiHint('first'), /First-time buyer limit: 4x/);
  assert.match(m.ltiHint('second'), /Second-time buyer limit: 3.5x/);
  assert.equal(m.LTV_HINT, 'Central Bank limit: first-time buyers can borrow up to 90% of the price, second-time buyers up to 80%.');
  assert.doesNotMatch(m.LTV_HINT, /LTV/);
  assert.match(m.CENTRAL_BANK_MORTGAGE_MEASURES_URL, /^https:\/\/www\.centralbank\.ie\//);
});
