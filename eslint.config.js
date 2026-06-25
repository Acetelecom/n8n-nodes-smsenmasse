const { FlatCompat } = require('@eslint/eslintrc')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const tsParser = require('@typescript-eslint/parser')

const compat = new FlatCompat({ baseDirectory: __dirname })

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', '**/__tests__/**', 'jest.config.js'],
  },
  ...compat.plugins('n8n-nodes-base'),
  ...compat.extends('plugin:n8n-nodes-base/nodes'),
  ...compat.extends('plugin:n8n-nodes-base/credentials'),
  ...compat.extends('plugin:n8n-nodes-base/community'),
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Community node uses a full HTTPS URL — the camelCase rule targets official n8n credentials only
      'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
      // Community node ships a PNG icon — SVG not available
      'n8n-nodes-base/node-class-description-icon-not-svg': 'off',
    },
  },
]
