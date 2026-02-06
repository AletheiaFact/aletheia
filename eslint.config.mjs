import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "dist/*",
    "coverage/*",
    "**/*.d.ts",
    "src/types/",
    "**/bak/**/*",
    "**/bin/**/*",
    "**/config/**/*",
    "**/dist/**/*",
    "**/doc/**/*",
    "**/node_modules/**/*",
    "**/public/**/*",
    "**/report/**/*",
    "**/webpack.config*.js",
    "**/docs/**/*",
    "migrations/**/*",
    "**/migrate-mongo-config.ts",
]), {
    extends: fixupConfigRules(compat.extends("plugin:@next/next/recommended")),

    languageOptions: {
        globals: {
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "array-bracket-spacing": 0,
        "arrow-parens": 0,
        camelcase: 0,
        "comma-dangle": 0,
        "comma-spacing": 0,
        "computed-property-spacing": 0,
        indent: 0,
        "key-spacing": 0,
        "max-statements-per-line": 0,
        "no-multi-spaces": 0,
        "no-underscore-dangle": 0,
        "no-unused-expressions": 0,
        "no-restricted-syntax": 0,
        "no-unused-vars": 0,
        "one-var": 0,
        "operator-linebreak": 0,
        "space-before-function-paren": 0,
        "space-in-parens": 0,
        "valid-jsdoc": 0,
        "jsx-a11y/anchor-is-valid": 0,
    },
}]);