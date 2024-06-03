module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs','/src/components/Editor/components/Editor/plugin/CommentPlugin/index.tsx'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-refresh', '@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 'error',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
