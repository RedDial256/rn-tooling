// Import ordering via eslint-plugin-perfectionist's `sort-imports`, chosen over
// simple-import-sort because its named custom groups can be extended by
// consumers (aliases, "all of expo", "all of react-navigation", ...) without
// rewriting the whole group list.
//
// Layout (blank line between blocks, none between lines of the same block;
// everything alphabetical inside a line, `import type` sorted with its package):
//
//   10  react, then react-native, then expo       <- one block, three lines
//   20  libraries (node builtins, packages)
//   30  aliases (`@/`, `~/`)
//   40  parent files  (../)
//   50  sibling files (./)
//
// Blocks are keyed by priority, in steps of 10, so a consumer can slot a new
// block anywhere: `createImportsConfig({ groups: { 15: ['^@react-navigation/'] } })`.
import perfectionist from 'eslint-plugin-perfectionist';

/**
 * A line is either a list of regexes matched against the module path, or a
 * list of perfectionist selectors (`external`, `parent`, ...).
 *
 * A block is a `string[]` (one line of regexes) or `{ lines }` (several lines
 * kept together, in this order, with no blank line between them).
 *
 * @typedef {string[] | { selectors: string[] }} ImportLine
 * @typedef {string[] | { lines: ImportLine[] }} ImportBlock
 */

/** @type {Record<number, ImportBlock>} */
export const defaultGroups = {
  10: {
    lines: [
      ['^react($|/)'],
      ['^(react-native($|/)|@react-native/)'],
      ['^(expo($|[-/])|@expo/)'],
    ],
  },
  20: { lines: [{ selectors: ['builtin', 'external', 'subpath'] }] },
  30: { lines: [{ selectors: ['internal'] }] },
  40: { lines: [{ selectors: ['parent'] }] },
  50: { lines: [{ selectors: ['sibling', 'index'] }] },
};

/**
 * @param {object} [options]
 * @param {Record<number, ImportBlock | null>} [options.groups] Blocks keyed by
 *   priority. A key that already exists in `defaultGroups` replaces that block,
 *   `null` removes it, a new key adds a block. Blocks are emitted in ascending
 *   priority. Custom blocks win over the defaults when a path matches both.
 * @param {string[]} [options.internalPattern] Regexes that make an import
 *   "internal" (the default block 30). Defaults to `@/` and `~/` aliases.
 * @returns {import('eslint').Linter.Config[]}
 */
export function createImportsConfig({
  groups = {},
  internalPattern = ['^@/', '^~/'],
} = {}) {
  const merged = { ...defaultGroups, ...groups };
  const priorities = Object.keys(merged)
    .map(Number)
    .filter((priority) => merged[priority] != null)
    .sort((a, b) => a - b);

  const groupList = [];
  const customGroups = [];

  priorities.forEach((priority, blockIndex) => {
    const block = merged[priority];
    const lines = Array.isArray(block) ? [block] : block.lines;

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) {
        groupList.push({ newlinesBetween: 0 });
      }

      if (!Array.isArray(line)) {
        groupList.push(line.selectors.length === 1 ? line.selectors[0] : line.selectors);
        return;
      }

      const groupName = `p${priority}-${lineIndex}`;
      groupList.push(groupName);
      customGroups.push({
        groupName,
        anyOf: line.map((pattern) => ({ elementNamePattern: pattern })),
        // Consumer-supplied blocks are matched before the built-in ones.
        _custom: !(priority in defaultGroups) || merged[priority] !== defaultGroups[priority],
      });
    });

    if (blockIndex < priorities.length - 1) {
      groupList.push({ newlinesBetween: 1 });
    }
  });

  customGroups.sort((a, b) => Number(b._custom) - Number(a._custom));
  customGroups.forEach((group) => delete group._custom);

  return [
    {
      plugins: { perfectionist },
      rules: {
        'perfectionist/sort-imports': [
          'warn',
          {
            type: 'alphabetical',
            order: 'asc',
            ignoreCase: true,
            newlinesInside: 0,
            internalPattern,
            groups: groupList,
            customGroups,
          },
        ],
        'perfectionist/sort-named-imports': ['warn', { type: 'alphabetical', ignoreCase: true }],
        'perfectionist/sort-exports': ['warn', { type: 'alphabetical', ignoreCase: true }],
        'perfectionist/sort-named-exports': ['warn', { type: 'alphabetical', ignoreCase: true }],
      },
    },
  ];
}

export default createImportsConfig();
