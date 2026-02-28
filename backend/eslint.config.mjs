import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslint from 'typescript-eslint';
import typescriptConfig from '@siemens/eslint-config-typescript';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default typescriptEslint.config(
  {
    ignores: ['.wrangler/**', 'drizzle/**', 'drizzle-flat/**', 'worker-configuration.d.ts']
  },
  {
    extends: [...typescriptConfig],
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'e2e/tsconfig.json'],
        tsconfigRootDir: __dirname
      }
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // Allow PascalCase for specific Cloudflare/Hono binding property names
          selector: 'typeProperty',
          filter: {
            regex: '^(DB|Bindings)$',
            match: true
          },
          format: ['PascalCase']
        }
      ]
    }
  }
);
