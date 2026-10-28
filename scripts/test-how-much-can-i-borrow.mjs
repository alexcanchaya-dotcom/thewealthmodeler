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

test('second-time buyer changes only the income cap', () => {
  const a = m.calculateHowMuchCanIBorrow({ ...base, ltiMultiple: m.ltiForBuyerType('first') });
  const b = m.calculateHowMuchCanIBorrow({ ...base, ltiMultiple: m.ltiForBuyerType('second') });
  assert.equal(b.incomeCap, 192500);
  assert.equal(b.borrowable, 192500);
  assert.equal(b.impliedProperty, 227500);
  assert.equal(b.ltvCap, a.ltvCap);
  assert.equal(b.totalIncome, a.totalIncome);
});

test('hint copy reflects selected type', () => {
  assert.match(m.ltiHint('first'), /First-time buyer limit: 4x/);
  assert.match(m.ltiHint('second'), /Second-time buyer limit: 3.5x/);
  assert.match(m.CENTRAL_BANK_MORTGAGE_MEASURES_URL, /^https:\/\/www\.centralbank\.ie\//);
});
