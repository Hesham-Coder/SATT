import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "backups/**",
      "uploads/**",
      "website/**",
      "admin/**",
      "routes/**",
      "middleware/**",
      "public/**/*.md",
      "public/**/*.html",
      "public/**/*.js",
      "lib/**/*.js",
      "data/**/*.json",
      "data/**/*.log",
      "scripts/**",
      "*.js",
    ],
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        afterEach: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly",
        jest: "readonly",
      },
    },
  },
  {
    files: ["e2e/**/*.ts"],
    languageOptions: {
      globals: {
        expect: "readonly",
        test: "readonly",
      },
    },
  },
];

export default eslintConfig;
