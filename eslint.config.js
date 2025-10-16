// ESLint 9+ flat config
export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'out/**'],
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        setInterval: 'readonly',
        clearTimeout: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
      },
    },
    rules: {
      // Possible Problems
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',

      // Suggestions
      'prefer-const': 'warn',
      'no-var': 'error',
      'prefer-arrow-callback': 'warn',
      'prefer-template': 'warn',

      // Stylistic
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['warn', 'always'],
      'comma-dangle': ['warn', 'es5'],
      'indent': ['warn', 2, { SwitchCase: 1 }],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always'],
    },
  },
];
