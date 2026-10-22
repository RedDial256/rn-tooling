import assert from 'node:assert/strict';
import { test } from 'node:test';

import imports, { createImportsConfig, defaultGroups } from '../eslint/imports.js';
import { lint } from './helpers.js';

const messy = `import { z } from 'zod';
import { Button } from './Button';
import type { Foo } from '../foo';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { api } from '@/api';
import { Stack } from 'expo-router';
import axios from 'axios';
import type { Bar } from './bar';
import { helper } from '../../helper';
import { acme } from '@acme/ui';
`;

const defaultOrder = `import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';

import { acme } from '@acme/ui';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { z } from 'zod';

import { api } from '@/api';

import { helper } from '../../helper';
import type { Foo } from '../foo';

import type { Bar } from './bar';
import { Button } from './Button';
`;

test('default export is a flat config array equal to createImportsConfig()', () => {
  assert.ok(Array.isArray(imports));
  assert.deepEqual(imports, createImportsConfig());
});

test('default blocks use priorities in steps of 10', () => {
  assert.deepEqual(Object.keys(defaultGroups).map(Number), [10, 20, 30, 40, 50]);
});

test('default config orders react/rn/expo, libs, aliases, parents, siblings', async () => {
  const { output } = await lint(messy, { config: imports });
  assert.equal(output, defaultOrder);
});

test('named specifiers and re-exports are sorted', async () => {
  const code = `import { b, a } from 'react';\nexport { d, c } from './x';\n`;
  const { output } = await lint(code, { config: imports });
  assert.equal(output, `import { a, b } from 'react';\nexport { c, d } from './x';\n`);
});

test('consumer block is inserted at its priority', async () => {
  const config = createImportsConfig({
    groups: { 15: ['^@react-navigation/'], 35: ['^@acme/'] },
  });
  const { output } = await lint(messy, { config });
  assert.equal(
    output,
    `import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';

import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
import { z } from 'zod';

import { api } from '@/api';

import { acme } from '@acme/ui';

import { helper } from '../../helper';
import type { Foo } from '../foo';

import type { Bar } from './bar';
import { Button } from './Button';
`
  );
});

test('a block can be replaced; imports of a removed block go last', async () => {
  const config = createImportsConfig({
    groups: {
      10: { lines: [['^react($|/)'], ['^react-native($|/)']] },
      15: ['^expo'],
      30: null,
    },
  });
  const { output } = await lint(
    `import { api } from '@/api';\nimport { Stack } from 'expo-router';\nimport { View } from 'react-native';\nimport axios from 'axios';\n`,
    { config }
  );
  assert.equal(
    output,
    `import { View } from 'react-native';

import { Stack } from 'expo-router';

import axios from 'axios';

import { api } from '@/api';
`
  );
});

test('consumer blocks win over defaults when a path matches both', async () => {
  const config = createImportsConfig({ groups: { 15: ['^expo-router$'] } });
  const { output } = await lint(
    `import { Linking } from 'expo-linking';\nimport { Stack } from 'expo-router';\n`,
    { config }
  );
  assert.equal(
    output,
    `import { Linking } from 'expo-linking';\n\nimport { Stack } from 'expo-router';\n`
  );
});

test('rules are warnings, not errors', () => {
  for (const [name, entry] of Object.entries(imports[0].rules)) {
    assert.equal(entry[0], 'warn', name);
  }
});
