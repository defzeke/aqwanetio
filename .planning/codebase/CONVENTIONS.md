# Coding Conventions

**Analysis Date:** 2026-07-22

## Naming Patterns

**Files:**
- kebab-case for all files (`layout.tsx`, `page.tsx`, `button.tsx`, `card.tsx`, `code.tsx`)
- PascalCase.tsx for React component files (`button.tsx` — note the ui package uses kebab-case for component files, not PascalCase)
- `.tsx` extension for React/TypeScript component files
- `.ts` extension for TypeScript-only files (config files, `next.config.ts`)
- `.dart` extension for all Dart files (Flutter app)
- `.mjs` extension for ESM config files (`eslint.config.mjs`, `postcss.config.mjs`)
- `.js` extension for CommonJS config packages (`base.js`, `next.js`, `react-internal.js`)

**Functions:**
- camelCase for all functions (`createState`, `_incrementCounter`, `build`)
- Named function declarations preferred in Flutter/Dart (`void main()`, `Widget build`)
- Arrow functions used in React/TypeScript (`export const Button = (...) =>`)
- Default exports for page components in Next.js App Router (`export default function Home`, `export default function RootLayout`)
- Named exports for shared components (`export const Button`, `export function Card`)

**Variables:**
- camelCase for variables (`geistSans`, `geistMono`, `_counter`, `children`, `className`)
- `camelCase` with underscore prefix for private Dart members (`_counter`, `_incrementCounter`, `_MyHomePageState`)
- No underscore prefix in TypeScript (even for internal variables)

**Types:**
- PascalCase for interfaces and type aliases (`Metadata`, `NextConfig`, `ButtonProps`, `JSX`)
- No `I` prefix for interfaces (`ButtonProps`, not `IButtonProps`)
- Inline type annotations for simple props in TypeScript (e.g., `Card` component uses inline `{ className?: string; title: string; ... }`)
- Separate `interface` for complex/used-more-than-once props (`ButtonProps`)
- PascalCase for Dart class names (`MyApp`, `MyHomePage`, `State`, `WidgetTester`)

## Code Style

**Formatting:**
- Prettier v3.7.4 for formatting (root `package.json` script: `"format": "prettier --write \"**/*.{ts,tsx,md}\""`)
- No `.prettierrc` config file detected — uses Prettier defaults
- Semicolons required in TypeScript
- Single quotes for import statements in TypeScript (e.g., `import type { Metadata } from "next"` — note: Next.js scaffold uses double quotes; Prettier default handles this)
- Double quotes in TypeScript (Prettier default; observed: `"next"`, `"react"` in imports)
- 2 space indentation (Prettier default)
- Dart: uses Dart formatter (dartfmt) with 2-space indentation, no semicolons optional in Dart 3

**Linting:**
- ESLint v9 with flat config format (`eslint.config.mjs`)
- Root lint command: `turbo run lint`
- Shared config `@repo/eslint-config` with three profiles:
  - `base.js`: ESLint recommended + typescript-eslint recommended + prettier + turbo plugin + only-warn plugin
  - `next.js`: extends base + React recommended + Next.js recommended + core-web-vitals + react-hooks
  - `react-internal.js`: extends base + React recommended + react-hooks (used by `@repo/ui`)
- Website uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` directly
- `@repo/ui` uses the shared react-internal config
- Flutter app uses `flutter_lints` with `package:flutter_lints/flutter.yaml` (configured in `analysis_options.yaml`)
- Flutter lint rules: currently default only, with commented-out examples of `avoid_print` and `prefer_single_quotes`
- ESLint ignores: `dist/**`, `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

## Import Organization

**Order (TypeScript):**
1. External packages (from node_modules): `import { Metadata } from "next"`
2. Internal/cross-package imports: `import { config } from "@repo/eslint-config/react-internal"`
3. Local imports: `import "./globals.css"`
4. Type imports: `import type { Metadata } from "next"` / `import { type JSX } from "react"`

**Grouping:**
- No blank lines enforced between groups currently
- No explicit sorting rules (relies on Prettier/linter defaults)
- Inline type imports used: `import { type JSX } from "react"` (observed in `card.tsx`, `code.tsx`)

**Path Aliases:**
- `@/` maps to project root in the Next.js website app (`tsconfig.json` `paths: { "@/*": ["./*"] }`)
- `@repo/` workspace aliases for monorepo packages (`@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`)
- No other aliases defined

**Order (Dart):**
1. SDK packages first: `import 'package:flutter/material.dart'`
2. Test framework: `import 'package:flutter_test/flutter_test.dart'`
3. App-level imports: `import 'package:aqwanetio_app/main.dart'`

## Error Handling

**Patterns:**
- TypeScript: Currently no explicit error handling patterns established (boilerplate code only)
- Only error-like patterns: `onClick={() => alert(...)}` in ui `button.tsx` — not production-grade
- No custom error classes defined
- No try/catch patterns present

**Dart:**
- Flutter app uses standard Flutter error handling patterns (no custom handlers yet)
- `analysis_options.yaml` has `avoid_print` lint rule in default set — print statements should be avoided in production

**Async Error Handling:**
- No async error handling patterns detected (no async functions beyond framework callbacks)
- `testWidgets` callback in `widget_test.dart` is async with `await`

## Logging

**Framework:**
- Not currently configured in TypeScript packages
- No logging library installed (no pino, winston, etc.)
- No structured logging patterns

**Flutter:**
- Default Flutter debug printing only
- `avoid_print` lint rule active (part of `flutter_lints`)
- Recommendation: use `debugPrint()` for debug logging, or a proper logging package for production

## Comments

**When to Comment:**
- TypeScript: Minimal comments, mostly generated boilerplate
- `AGENTS.md` and `CLAUDE.md` files present for agent instructions (`apps/aqwanetio_website/`)
- Dart/Flutter: Heavy boilerplate comments from `create flutter` scaffold — these are instructional, should be removed for production
- JSDoc/TSDoc: Not used in this codebase

**TODO Comments:**
- None detected in the codebase

## Function Design

**Size:**
- Functions are currently small (generated scaffold)
- `RootLayout` in `layout.tsx`: 33 lines (imports + component)
- `Home` page in `page.tsx`: 65 lines (mostly JSX)
- Dart `main.dart`: 122 lines (single file, large boilerplate comments inflating count)

**Parameters:**
- React components use destructured props: `({ children, className, appName }: ButtonProps)`
- Inline prop type definitions used for single-use components (`Card`, `Code`)
- Separate `interface` for reused prop shapes (`ButtonProps`)
- Dart constructors use `{super.key, required this.title}` with named parameters

**Return Values:**
- TypeScript: `export default function` returns JSX elements
- Type annotations on return types: `function Card(...): JSX.Element` (used in `card.tsx`, `code.tsx`)
- Dart: `Widget build(BuildContext context)` returns widgets
- Arrow functions implicitly return JSX

## Module Design

**Exports:**
- Named exports for reusable components: `export const Button`, `export function Card`, `export function Code`
- Default exports for page/layout components in Next.js App Router
- Dart: Classes are public by default, no explicit export control

**Barrel Files:**
- No `index.ts` barrel files detected in the codebase
- `@repo/ui` uses `package.json` `exports` map instead: `"./*": "./src/*.tsx"` — each component importable directly
- Config packages use explicit exports in `package.json`

**Monorepo Structure:**
- Apps in `apps/`, shared packages in `packages/`
- Workspace protocol `"workspace:*"` for inter-package dependencies
- pnpm workspace with lockfile (`pnpm-lock.yaml`)
- Turborepo orchestrates builds with dependency ordering (`dependsOn: ["^build"]`)

---

*Convention analysis: 2026-07-22*
*Update when patterns change*
