module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['@typescript-eslint', 'import', 'jest'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from
    'standard',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    curly: ['error', 'all'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    complexity: ['error', { max: 17 }],
    '@typescript-eslint/camelcase': [
      'error',
      { allow: ['is_show', 'created_at', 'updated_at'] },
    ],
    'max-statements': [
      'error',
      {
        max: 50,
      },
    ],
    // 'max-params': ['error', 5],
    'max-lines': [
      'error',
      {
        max: 500,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'no-else-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-console': 'error',
    'prefer-const': 'error',
    radix: 'error',
    'block-scoped-var': 'error',
    'jest/expect-expect': 'error',
    'jest/prefer-spy-on': 'error',
    'jest/no-test-callback': 'error',
    'jest/consistent-test-it': [
      'error',
      {
        fn: 'it',
        withinDescribe: 'it',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
    'no-useless-constructor': 'off',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.d.ts'],
      },
    },
  },
}
