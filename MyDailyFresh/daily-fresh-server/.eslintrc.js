module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-unused-vars': 2,
    'no-use-before-define': 2,
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
      },
    ],
    indent: ['error', 2],
    quotes: [
      'error',
      'single',
    ],
    'no-console': 'off',
  },
};
