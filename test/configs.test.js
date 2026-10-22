import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import base from '../eslint/base.js';
import index from '../eslint/index.js';
import typescript from '../eslint/typescript.js';
import strict from '../eslint/typescript-strict.js';
import { lint, resolvedConfig } from './helpers.js';

const eslintDir = fileURLToPath(new URL('../eslint/', import.meta.url));
const tsProject = fileURLToPath(new URL('./fixtures/ts-project/', import.meta.url));

test('every eslint/*.js default-exports a non-empty flat config array', async () => {
  const files = readdirSync(eslintDir).filter((file) => file.endsWith('.js'));
  assert.ok(files.length > 0);
  for (const file of files) {
    const { default: config } = await import(pathToFileURL(eslintDir + file).href);
    assert.ok(Array.isArray(config) && config.length > 0, file);
  }
});

test('default entry lints plain JSX without crashing or parse errors', async () => {
  const code = `import { View } from 'react-native';\nexport const A = () => <View />;\n`;
  const { messages } = await lint(code, { config: index, filePath: 'src/a.jsx' });
  assert.equal(messages.filter((m) => m.fatal).length, 0);
});

test('base fixes var and flags loose equality', async () => {
  const { output, messages } = await lint('var a = 1;\nexport const b = a == 2;\n', {
    config: base,
    filePath: 'src/a.js',
  });
  assert.ok(output.startsWith('const a = 1;'));
  assert.ok(messages.some((m) => m.ruleId === 'eqeqeq'));
});

for (const [name, config] of [
  ['typescript', typescript],
  ['typescript-strict', strict],
]) {
  test(`${name}: consistent-type-imports is a warning`, async () => {
    const resolved = await resolvedConfig(config);
    assert.equal(resolved.rules['@typescript-eslint/consistent-type-imports'][0], 1);
  });
}

test('typescript-strict: no-misused-spread is an error', async () => {
  const resolved = await resolvedConfig(strict);
  assert.equal(resolved.rules['@typescript-eslint/no-misused-spread'][0], 2);
});

test('typescript-strict reports spreading a function into an object', async () => {
  const code = `const fn = () => 1;\nexport const style = { ...fn };\n`;
  const { messages } = await lint(code, {
    config: strict,
    filePath: 'src/spread.ts',
    cwd: tsProject,
  });
  assert.ok(messages.some((m) => m.ruleId === '@typescript-eslint/no-misused-spread'));
});

test('typescript tier does not need type information', async () => {
  const code = `import { Foo } from './foo';\nexport const x: Foo = {} as Foo;\n`;
  const { messages } = await lint(code, { config: typescript, filePath: 'src/a.ts' });
  assert.equal(messages.filter((m) => m.fatal).length, 0);
});
