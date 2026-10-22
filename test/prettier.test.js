import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import prettierConfig from '../prettier/index.js';

test('prettier config sets the expected core options', () => {
  assert.equal(prettierConfig.semi, true);
  assert.equal(prettierConfig.singleQuote, true);
  assert.equal(prettierConfig.endOfLine, 'lf');
});

test('oxfmt.json is valid JSON', () => {
  const raw = readFileSync(new URL('../prettier/oxfmt.json', import.meta.url), 'utf8');
  assert.doesNotThrow(() => JSON.parse(raw));
});
