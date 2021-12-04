const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierOptions],
    'no-underscore-dangle': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'no-param-reassign': 0,
    'no-await-in-loop': 0,
    'no-use-before-define': 0,
    'no-restricted-syntax': 0,
    'global-require': 0,
    'linebreak-style': 0,
    'no-console': 0,
  },
};
