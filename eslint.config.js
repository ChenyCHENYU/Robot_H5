import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let autoImportGlobals = {};
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const autoImportPath = path.resolve(__dirname, 'types', '.eslintrc-auto-import.json');
try {
    if (fs.existsSync(autoImportPath)) {
        const autoImportConfig = JSON.parse(fs.readFileSync(autoImportPath, 'utf8'));
        autoImportGlobals = autoImportConfig.globals || {};
    }
} catch (error) {
    console.warn('Failed to read auto-import config:', error.message);
}

export default [
    {
        ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'],
    },
    {
        files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true, tsx: true },
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            'no-var': 'error',
            'no-multiple-empty-lines': ['warn', { max: 1 }],
            'no-unexpected-multiline': 'error',
            'no-useless-escape': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/prefer-ts-expect-error': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/semi': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
        },
    },
    {
        plugins: { prettier: eslintPluginPrettier },
        rules: {
            ...eslintConfigPrettier.rules,
            'prettier/prettier': 'error',
        },
    },
    eslintConfigPrettier,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tsParser,
                ecmaVersion: 'latest',
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-mutating-props': 'off',
            'vue/attribute-hyphenation': 'off',
        },
    },
    {
        languageOptions: {
            globals: { ...autoImportGlobals },
        },
    },
];
