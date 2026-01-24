import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";
import { ESLint } from "eslint";

const fixupReactHooks = (plugin: unknown): ESLint.Plugin => {
  return fixupPluginRules(plugin as ESLint.Plugin);
};

export default defineConfig(
  {
    ignores: ["node_modules", "build", "dist", "public"],
  },
  [
    {
      files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 2020,
        globals: { ...globals.browser, ...globals.node },
      },
    },
    {
      // Frontend specific rules
      files: ["**/*.{ts,tsx}"],
      plugins: {
        "react-hooks": fixupReactHooks(reactHooks),
        "react-refresh": reactRefresh,
      },
      rules: {
        ...reactHooks.configs["recommended-latest"].rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
        "react/react-in-jsx-scope": "off",
      },
      settings: {
        react: {
          version: "detect", // Automatically detect React version
        },
      },
    },
  ]
);
