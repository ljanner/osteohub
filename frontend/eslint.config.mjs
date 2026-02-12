import path from 'path';
import { fileURLToPath } from 'url';
import typescriptEslint from 'typescript-eslint';
import angularTypescriptConfig from '@siemens/eslint-config-angular';
import angularTemplateConfig from '@siemens/eslint-config-angular/template';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tsConfig = typescriptEslint.config({
  extends: [...angularTypescriptConfig],
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      project: ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'e2e/tsconfig.json'],
      tsconfigRootDir: __dirname,
    },
  },
  rules: {
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'app',
        style: 'camelCase',
      },
    ],
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'app',
        style: 'kebab-case',
      },
    ],
  },
});

const templateConfig = typescriptEslint.config({
  extends: [...angularTemplateConfig],
  files: ['**/*.html'],
});

export default typescriptEslint.config(...tsConfig, ...templateConfig);
