import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Importa los plugins necesarios
import unusedImports from "eslint-plugin-unused-imports";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

// Configuración para eliminar código no utilizado
const unusedCodeRules = {
  // Detectar y eliminar importaciones no utilizadas
  "unused-imports/no-unused-imports": "error",
  
  // Detectar variables declaradas pero no utilizadas
  "no-unused-vars": "off", // Desactivamos la regla estándar para evitar duplicados
  "unused-imports/no-unused-vars": [
    "warn",
    { 
      vars: "all", 
      varsIgnorePattern: "^_", 
      args: "after-used", 
      argsIgnorePattern: "^_" 
    }
  ],
  
  // Reglas TypeScript para detectar código no utilizado
  "@typescript-eslint/no-unused-vars": [
    "warn",
    {
      vars: "all",
      varsIgnorePattern: "^_",
      args: "after-used",
      argsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    }
  ],
};

const eslintConfig = [
  // Configuraciones base
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Configuración para TypeScript
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      ...unusedCodeRules,
    },
  },
  
  // Configuración para JavaScript
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { 
          vars: "all", 
          varsIgnorePattern: "^_", 
          args: "after-used", 
          argsIgnorePattern: "^_" 
        }
      ],
    },
  },
];

export default eslintConfig;