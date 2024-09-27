/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    // jsx 支持
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  rules: {
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index'],
      },
    ],
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        tabWidth: 2,
        singleQuote: true,
        printWidth: 100,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
  },
}
