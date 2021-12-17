const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'react/prop-types': 0,
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
      },
    ],
    'default-param-last': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-await-in-loop': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-boolean-value': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
  },
};
