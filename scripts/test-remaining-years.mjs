// Unit tests for src/lib/remaining-years.ts. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import ts from 'typescript';

const src = readFileSync('src/lib/remaining-years.ts', 'utf8');
const out = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const file = join(mkdtempSync(join(tmpdir(), 'ry-')), 'remaining-years.mjs');
writeFileSync(file, out);
const m = await import(file);

const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b}`);
const defaults = { age: 40, planToAge: 90, retireAge: 65, spending: 40000, savings: 100000, yearlySaving: 10000, realReturn: 0.04 };

test('money needed uses annuity formula', () => {
  close(m.moneyNeeded(40000, 0.04, 25), 624883.20, 0.01);
  assert.equal(m.moneyNeeded(40000, 0, 25), 1000000);
  assert.equal(m.moneyNeeded(40000, 0.04, 0), 0);
});

test('4% rule is spending x 25', () => {
  assert.equal(m.fourPercentRule(40000), 1000000);
});

test('money at retirement = FV of savings plus yearly saving', () => {
  close(m.moneyAtRetirement(100000, 10000, 0.04, 25), 100000 * 1.04 ** 25 + 10000 * (1.04 ** 25 - 1) / 0.04);
  assert.equal(m.moneyAtRetirement(100000, 10000, 0, 25), 350000);
  assert.equal(m.moneyAtRetirement(100000, 10000, 0.04, 0), 100000);
});

test('runway is NPER and matches needed for exactly N years', () => {
  const need = m.moneyNeeded(40000, 0.04, 25);
  close(m.runwayYears(need, 40000, 0.04), 25, 1e-6);
  assert.equal(m.runwayYears(100000, 40000, 0), 2.5);
  assert.equal(m.runwayYears(1000000, 40000, 0.04), Infinity);
  assert.equal(m.runwayYears(0, 40000, 0.04), 0);
  assert.equal(m.runwayYears(1000, 0, 0.04), Infinity);
});

test('full calculation with spec defaults', () => {
  const r = m.calculateRemainingYears(defaults);
  assert.equal(r.yearsInRetirement, 25);
  assert.equal(r.yearsToRetirement, 25);
  close(r.needed, 624883.20, 0.01);
  close(r.have, 683042.72, 0.01);
  assert.equal(r.gap, 0);
  close(r.surplus, r.have - r.needed);
  assert.ok(r.runsOutAge > 90 || r.runsOutAge === null);
  assert.equal(r.balances[0].age, 40);
  assert.equal(r.balances[0].balance, 100000);
});

test('changing plan-to age moves the numbers', () => {
  const a = m.calculateRemainingYears(defaults);
  const b = m.calculateRemainingYears({ ...defaults, planToAge: 100 });
  assert.equal(b.yearsInRetirement, 35);
  assert.ok(b.needed > a.needed);
  assert.ok(b.gap > 0);
  assert.equal(b.balances.at(-1).age, 105);
});

test('gap shown when short; runs-out age = retire + runway', () => {
  const r = m.calculateRemainingYears({ ...defaults, savings: 0, yearlySaving: 5000 });
  assert.ok(r.gap > 0);
  assert.equal(r.surplus, 0);
  close(r.runsOutAge, 65 + r.runwayYears, 1e-9);
  assert.ok(r.runsOutAge < 90);
});

test('balance chart hits ~zero at runs-out age', () => {
  const r = m.calculateRemainingYears({ ...defaults, planToAge: 90, savings: 0, yearlySaving: 0 });
  assert.equal(r.have, 0);
  assert.equal(r.runsOutAge, 65);
  assert.ok(r.balances.every((p) => p.balance >= 0));
});

test('?to= parsing: only integers 50..110', () => {
  assert.equal(m.parsePlanTo('88'), 88);
  assert.equal(m.parsePlanTo('50'), 50);
  assert.equal(m.parsePlanTo('110'), 110);
  for (const junk of [null, undefined, '', '49', '111', '88.5', 'abc', '88abc', '-90', '1e2', ' ', '0090']) {
    assert.equal(m.parsePlanTo(junk), null, String(junk));
  }
});

test('junk numeric inputs do not throw or produce NaN', () => {
  const r = m.calculateRemainingYears({ ...defaults, spending: NaN, savings: Infinity });
  assert.ok(Number.isFinite(r.needed));
  assert.ok(Number.isFinite(r.have));
});

const form = { age: 40, planToAge: 90, retireAge: 65, spending: 40000, savings: 100000, yearlySaving: 10000, realReturnPct: 4 };

test('(a) results held back when any input is out of range', () => {
  assert.equal(m.isValidInput(form), true);
  for (const bad of [
    { age: 17 }, { age: 101 }, { age: NaN },
    { planToAge: 49 }, { planToAge: 111 }, { planToAge: 88.5 }, { planToAge: NaN },
    { retireAge: 111 }, { realReturnPct: 9 }, { realReturnPct: -1 }, { spending: -1 }, { savings: NaN },
  ]) {
    assert.equal(m.isValidInput({ ...form, ...bad }), false, JSON.stringify(bad));
  }
  assert.equal(m.isValidInput({ ...form, age: 18, planToAge: 50 }), true);
  assert.equal(m.isValidInput({ ...form, age: 100, planToAge: 110 }), true);
});

test('(b) retire age below current age: retirement starts at current age', () => {
  const r = m.calculateRemainingYears({ ...defaults, age: 70, retireAge: 65, planToAge: 90 });
  assert.equal(r.retirementStartAge, 70);
  assert.equal(r.yearsInRetirement, 20);
  assert.equal(r.yearsToRetirement, 0);
  assert.equal(r.have, defaults.savings);
  const normal = m.calculateRemainingYears(defaults);
  assert.equal(normal.retirementStartAge, 65);
});
