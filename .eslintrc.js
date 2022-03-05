module.exports = {
  root: true,
  parser: 'babel-eslint',
  'plugins': [
    'react',
    'react-hooks'
  ],
  env: {
    browser: true,
    node: true,
    jest: true,
    'shared-node-browser': true
  },
  extends: [
    require.resolve('eslint-config-standard'),
    require.resolve('eslint-config-standard-react'),
    'plugin:security/recommended',
    'plugin:react/recommended',
    'eslint:recommended'
  ],
  rules: {
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],
    'security/detect-non-literal-fs-filename': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'security/detect-object-injection': 'off',
    'security/detect-non-literal-regexp': 'off'
  },
  ignorePatterns: [
    '**/node_modules/',
    '**/client/',
    '**/public/',
    '**/dist/',
    '**/build/',
    '**/coverage/'
  ]
}
