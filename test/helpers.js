import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';

const tsFiles = { files: ['**/*.{ts,tsx}'] };

/** Lint `code` with `config`, applying fixes; returns fixed source + messages. */
export async function lint(code, { config, filePath = 'src/sample.tsx', cwd = process.cwd() }) {
  const eslint = new ESLint({
    cwd,
    fix: true,
    overrideConfigFile: true,
    overrideConfig: [tsFiles, tseslint.configs.base, ...config],
  });
  const [result] = await eslint.lintText(code, { filePath });
  return { output: result.output ?? code, messages: result.messages };
}

export async function resolvedConfig(config, filePath = 'src/sample.tsx') {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [tsFiles, tseslint.configs.base, ...config],
  });
  return eslint.calculateConfigForFile(filePath);
}
