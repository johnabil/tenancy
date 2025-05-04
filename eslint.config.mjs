import globals from "globals";
import tseslint from "typescript-eslint";
import {defineConfig} from "eslint/config";
import nodePlugin from 'eslint-plugin-node';

const tsBase = tseslint.configs.recommended.find(c => c.plugins !== null);
const tsRecommendedConfig = {
  files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
  languageOptions: tsBase.languageOptions,
  plugins: tsBase.plugins,
  rules: {
    'constructor-super': 'off',
    'getter-return': 'off',
    'no-class-assign': 'off',
    'no-const-assign': 'off',
    'no-dupe-args': 'off',
    'no-dupe-class-members': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-new-symbol': 'off',
    'no-obj-calls': 'off',
    'no-redeclare': 'off',
    'no-setter-return': 'off',
    'no-this-before-super': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'no-unsafe-negation': 'off',
    'no-var': 'error',
    'no-with': 'off',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    '@typescript-eslint/ban-ts-comment': 'error',
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-unsafe-function-type': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-wrapper-object-types': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    '@typescript-eslint/triple-slash-reference': 'error'
  }
}

export default defineConfig([
  tsRecommendedConfig,
  {ignores: ['examples/**', 'dist/**', 'node_modules/**']},
  {files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: {globals: globals.browser}},
  {
    files: ["**/*.js"], languageOptions: {sourceType: "commonjs", ecmaVersion: 2022},
    plugins: nodePlugin,
    rules: {
      // Enforce 2-space indentation
      indent: ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {body: 1, parameters: 1},
        FunctionExpression: {body: 1, parameters: 1},
        CallExpression: {arguments: 1},
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        offsetTernaryExpressions: true,
        ignoreComments: false,
      }],
    }
  },
]);
