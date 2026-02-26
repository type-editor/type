import eslint from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';
import sortImports from 'eslint-plugin-simple-import-sort';


export default defineConfig(
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: __dirname,
                sourceType: 'module',
                ecmaVersion: 'latest',
                parser: '@typescript-eslint/parser',
            },
        },
        plugins: {
            'simple-import-sort': sortImports,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            // Enforce the use of single quotes for strings
            quotes: ['error', 'single'],
            // Enforce semicolons at the end of statements
            semi: ['error', 'always'],
            // Require the use of === and !== (no implicit type conversions)
            eqeqeq: ['error', 'always'],
            curly: [2],
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/restrict-template-expressions': ['error', {
                allowNumber: true,
            }],
            '@typescript-eslint/array-type': ['warn', {
                default: 'generic'
            }],
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/prefer-return-this-type': 'off',
            '@typescript-eslint/class-literal-property-style': 'off',

            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',

            '@typescript-eslint/no-unsafe-member-access': "error",
            '@typescript-eslint/no-unsafe-return': "error",
            '@typescript-eslint/no-unsafe-assignment': "error",
            '@typescript-eslint/no-unsafe-call': "error",
            '@typescript-eslint/no-unsafe-argument': "error",
            '@typescript-eslint/no-explicit-any': "error",
            'no-unused-vars': "off",
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }]
        },
    },
    globalIgnores([
        ".git/**/*",
        "node_modules/**/*",
        "build/**/*",
        "dist/**/*",
        "test/**/*",
        "test-browser/**/*",
    ]),
);
