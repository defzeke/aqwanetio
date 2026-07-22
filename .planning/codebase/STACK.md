# Technology Stack

**Analysis Date:** 2026-07-22

## Languages

**Primary:**
- TypeScript 5.9 — All web application and shared library code
- Dart 3.12+ — Flutter mobile application

**Secondary:**
- JavaScript — ESLint config files (`.mjs`), PostCSS config
- CSS — Tailwind stylesheets (`globals.css`)

## Runtime

**Environment:**
- Node.js >=18 — Web application server and build tooling
- Dart SDK ^3.12.2 — Flutter app runtime
- Flutter SDK (implicit, no pinned version in repo)

**Package Manager:**
- pnpm 9.0.0 — Monorepo dependency management (root)
- npm — Present in `apps/aqwanetio_website/package-lock.json` (leftover from `create-next-app`, not actively used)
- pub.dev — Dart package registry for Flutter app

Lockfiles:
- `pnpm-lock.yaml` present (root, authoritative)
- `package-lock.json` present (`apps/aqwanetio_website/`)
- `pubspec.lock` present (`apps/aqwanetio_app/`)

## Frameworks

**Core:**
- Next.js 16.2.10 — Web application framework (App Router) at `apps/aqwanetio_website`
- React 19.2.4 — UI component library
- React DOM 19.2.4 — React rendering for web
- Flutter (latest stable) — Mobile application framework at `apps/aqwanetio_app`

**Styling:**
- Tailwind CSS v4 — CSS utility framework
- PostCSS — CSS transformation pipeline

**Testing:**
- Not detected — No test framework configured at repository level
- `flutter_test` (SDK) — Available in Flutter app but no tests written

**Build/Dev:**
- Turborepo 2.10.5 — Monorepo task orchestration
- TypeScript 5.9.2 — Type checking and compilation
- Next.js build — Web app bundling (built-in with Next.js)
- Flutter build — Mobile app compilation (Dart native compiler)
- React Compiler 1.0.0 (`babel-plugin-react-compiler`) — Automatic memoization (enabled via `reactCompiler: true` in `next.config.ts`)

## Key Dependencies

**Critical:**
- `next` 16.2.10 — Web application framework at `apps/aqwanetio_website/package.json`
- `react` 19.2.4 / `react-dom` 19.2.4 — UI foundation at `apps/aqwanetio_website/package.json`
- `flutter` (SDK) — Mobile app framework at `apps/aqwanetio_app/pubspec.yaml`

**Infrastructure:**
- `turbo` 2.10.5 — Monorepo orchestration at `package.json`
- `@tailwindcss/postcss` v4 — Tailwind CSS PostCSS plugin at `apps/aqwanetio_website/package.json`
- `tailwindcss` v4 — CSS framework at `apps/aqwanetio_website/package.json`
- `eslint` v9 — Linting across all packages
- `prettier` ^3.7.4 — Code formatting at `package.json`
- `babel-plugin-react-compiler` 1.0.0 — React compiler Babel plugin at `apps/aqwanetio_website/package.json`
- `typescript-eslint` ^8.50.0 — TypeScript ESLint integration at `packages/eslint-config/package.json`

**Flutter (boilerplate):**
- `cupertino_icons` ^1.0.8 — iOS-style icons at `apps/aqwanetio_app/pubspec.yaml`
- `flutter_lints` ^6.0.0 — Dart lint rules at `apps/aqwanetio_app/pubspec.yaml`

## Configuration

**Environment:**
- No `.env` files present in repository
- `.env`, `.env.local`, `.env.*.local` patterns are gitignored (`.gitignore`)
- Environment variables are undeclared — no `.env.example` or `.env.template` exists

**Build:**
- `turbo.json` — Turborepo task pipeline configuration (root)
- `next.config.ts` — Next.js configuration (uses `reactCompiler: true`)
- `tsconfig.json` — TypeScript configs per app/package (extend `@repo/typescript-config`)
- `postcss.config.mjs` — PostCSS with Tailwind plugin
- `pnpm-workspace.yaml` — Workspace definition (`apps/*`, `packages/*`)

**TypeScript Config Packages:**
- `packages/typescript-config/base.json` — Shared base: ES2022 target, NodeNext module, strict mode
- `packages/typescript-config/nextjs.json` — Next.js preset: extends base, ESNext module, Bundler resolution
- `packages/typescript-config/react-library.json` — React library preset: extends base, `react-jsx` JSX transform

**ESLint Config Packages:**
- `packages/eslint-config/base.js` — Base: `@eslint/js` recommended, Prettier, Turbo plugin, TypeScript-ESLint
- `packages/eslint-config/next.js` — Next.js: base config + Next.js plugin + React + React Hooks
- `packages/eslint-config/react-internal.js` — Internal React library: base config + React + React Hooks

## Platform Requirements

**Development:**
- Node.js >=18 (any platform)
- pnpm 9.0.0 (or corepack-enabled)
- Flutter SDK + Dart SDK ^3.12.2 (for mobile development)
- Platform-specific Flutter toolchain: Android SDK (Android), Xcode (iOS/macOS), Visual Studio (Windows), Linux toolchain (Linux)

**Production:**
- Not specified — no deployment configuration present
- Vercel implicit target (Next.js default, `.vercel` in `.gitignore`)
- No Dockerfile, CI/CD config, or platform config files present

---

*Stack analysis: 2026-07-22*
*Update after major dependency changes*
