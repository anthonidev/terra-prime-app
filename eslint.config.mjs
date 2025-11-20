import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Disable incompatible library warnings for React Hook Form and TanStack Table
      "react-hooks/incompatible-library": "off",
      // Disable set-state-in-effect for legitimate use cases
      "react-hooks/set-state-in-effect": "off",
      // Disable static-components - too restrictive for our component patterns
      "react-hooks/static-components": "off",
      // Disable preserve-manual-memoization - conflicts with our memoization patterns
      "react-hooks/preserve-manual-memoization": "off",
      // Allow any type when necessary (downgrade to warning)
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
