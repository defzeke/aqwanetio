# Codebase Structure

**Analysis Date:** 2026-07-22

## Directory Layout

```
aqwanetio/
├── apps/                   # Deployable application projects
│   ├── aqwanetio_app/     # Flutter mobile application (Dart)
│   └── aqwanetio_website/ # Next.js website (TypeScript)
├── packages/               # Shared libraries and configs
│   ├── eslint-config/     # Shared ESLint configuration presets
│   ├── typescript-config/ # Shared TypeScript compiler presets
│   └── ui/                # Shared React component library
├── .planning/              # Project planning documents (GSD)
│   └── codebase/          # Codebase analysis documents
├── node_modules/           # Root-level dependencies
├── .turbo/                 # Turborepo cache (auto-generated)
├── package.json            # Root workspace manifest
├── pnpm-workspace.yaml     # pnpm workspace definition
├── turbo.json              # Turborepo task configuration
├── pnpm-lock.yaml          # Dependency lockfile
├── .npmrc                  # npm/pnpm configuration (empty)
├── .gitignore              # Git exclusion rules
└── README.md               # Turborepo starter documentation
```

## Directory Purposes

**apps/aqwanetio_website/:**
- Purpose: Public marketing / user-facing website for the aqwanetio project
- Contains: Next.js 16 app with App Router, Tailwind CSS v4, TypeScript
- Key files:
  - `app/page.tsx` — Homepage route (server component, boilerplate)
  - `app/layout.tsx` — Root layout with Geist font and global styles
  - `app/globals.css` — Tailwind CSS entry point with theme variables
  - `next.config.ts` — Next.js config (reactCompiler: true)
  - `postcss.config.mjs` — PostCSS config for Tailwind
  - `eslint.config.mjs` — ESLint flat config using `eslint-config-next`
  - `tsconfig.json` — TypeScript config with `@/*` path alias
- Subdirectories:
  - `app/` — Next.js App Router routes (file-system based routing)
  - `components/` — Empty directory, intended for reusable React components
  - `features/` — Empty directory, intended for feature-specific code
  - `public/` — Static assets (SVG logos from starter template)
  - `.next/` — Build output (gitignored)

**apps/aqwanetio_app/:**
- Purpose: Cross-platform mobile application for aquaculture monitoring
- Contains: Flutter project (Dart) targeting Android, iOS, Web, Windows, macOS, Linux
- Key files:
  - `lib/main.dart` — Application entry point (default counter demo)
  - `test/widget_test.dart` — Default widget test for counter
  - `pubspec.yaml` — Flutter project manifest and dependencies
  - `analysis_options.yaml` — Dart linter configuration (flutter_lints)
  - `package.json` — Workspace stub for Turborepo integration (dev script only)
- Subdirectories:
  - `lib/` — Dart source code (single file currently)
  - `test/` — Flutter widget/integration tests
  - `android/` — Android platform project
  - `ios/` — iOS platform project
  - `web/` — Web platform project
  - `linux/` — Linux desktop platform project
  - `macos/` — macOS desktop platform project
  - `windows/` — Windows desktop platform project
  - `build/` — Build outputs (gitignored)

**packages/ui/:**
- Purpose: Shared React component library used by apps
- Contains: TypeScript React components with typed props
- Key files:
  - `src/button.tsx` — `<Button>` component (client component with `"use client"` directive)
  - `src/card.tsx` — `<Card>` component (link card with title, children, href)
  - `src/code.tsx` — `<Code>` component (inline code wrapper)
  - `package.json` — Package manifest with subpath exports (`@repo/ui/*`)
  - `tsconfig.json` — Extends `@repo/typescript-config/react-library.json`
  - `eslint.config.mjs` — ESLint config using `@repo/eslint-config/react-internal`

**packages/eslint-config/:**
- Purpose: Reusable ESLint flat config presets for the monorepo
- Contains: JavaScript ESLint config files
- Key files:
  - `base.js` — Shared base config (TypeScript-ESLint, Prettier, Turbo plugin, only-warn)
  - `next.js` — Next.js-specific config (React, React Hooks, Next plugin, globals)
  - `react-internal.js` — Internal React library config (React, React Hooks, browser globals)
  - `package.json` — Package manifest with multi-export entries (`@repo/eslint-config/*`)

**packages/typescript-config/:**
- Purpose: Reusable TypeScript compiler presets for the monorepo
- Contains: JSON tsconfig files with named exports
- Key files:
  - `base.json` — Base config (strict mode, ES2022, NodeNext module resolution)
  - `nextjs.json` — Next.js variant (extends base, adds JSX preserve, noEmit)
  - `react-library.json` — React library variant (extends base, adds react-jsx)
  - `package.json` — Package manifest (no dependencies, configuration-only)

## Key File Locations

**Entry Points:**
- `apps/aqwanetio_website/app/page.tsx` — Website homepage (route `/`)
- `apps/aqwanetio_website/app/layout.tsx` — Website root layout (wraps all pages)
- `apps/aqwanetio_app/lib/main.dart` — Flutter app `main()` entry point
- `apps/aqwanetio_app/package.json` — Flutter workspace stub (scripts.dev = `flutter run`)

**Configuration:**
- `turbo.json` — Turborepo task orchestration (build, lint, check-types, dev)
- `pnpm-workspace.yaml` — Workspace package globs (`apps/*`, `packages/*`)
- `package.json` — Root scripts, devDependencies, packageManager, engines
- `apps/aqwanetio_website/next.config.ts` — Next.js framework config
- `apps/aqwanetio_website/tsconfig.json` — Website TypeScript config (`@/*` alias)
- `apps/aqwanetio_website/postcss.config.mjs` — PostCSS / Tailwind config
- `apps/aqwanetio_website/eslint.config.mjs` — Website ESLint flat config
- `apps/aqwanetio_app/pubspec.yaml` — Flutter manifest and dependencies
- `apps/aqwanetio_app/analysis_options.yaml` — Dart linter settings
- `packages/ui/tsconfig.json` — UI package TS config
- `packages/ui/eslint.config.mjs` — UI package ESLint config
- `packages/typescript-config/base.json` — Shared TS base compiler options
- `packages/typescript-config/nextjs.json` — Shared TS config for Next.js
- `packages/typescript-config/react-library.json` — Shared TS config for React libs
- `packages/eslint-config/base.js` — Shared ESLint base config
- `packages/eslint-config/next.js` — Shared ESLint for Next.js apps
- `packages/eslint-config/react-internal.js` — Shared ESLint for React libs
- `.gitignore` — Git ignore rules

**Core Logic:**
- `packages/ui/src/button.tsx` — Shared Button component
- `packages/ui/src/card.tsx` — Shared Card component
- `packages/ui/src/code.tsx` — Shared Code component
- `apps/aqwanetio_website/app/page.tsx` — Website homepage content
- `apps/aqwanetio_app/lib/main.dart` — Flutter app widget tree

**Testing:**
- `apps/aqwanetio_app/test/widget_test.dart` — Flutter counter smoke test

**Documentation:**
- `README.md` — Turborepo starter usage guide (not yet project-specific)
- `apps/aqwanetio_website/AGENTS.md` — Next.js version warning for AI agents
- `apps/aqwanetio_website/CLAUDE.md` — References AGENTS.md

## Naming Conventions

**Files:**
- `kebab-case.ts` / `kebab-case.tsx`: React components in `packages/ui/src/` (`button.tsx`, `card.tsx`, `code.tsx`)
- `kebab-case.js`: ESLint config files in `packages/eslint-config/` (`base.js`, `next.js`, `react-internal.js`)
- `kebab-case.json`: TypeScript configs in `packages/typescript-config/` (`base.json`, `nextjs.json`, `react-library.json`)
- `page.tsx`: Next.js App Router page convention
- `layout.tsx`: Next.js App Router layout convention
- `main.dart`: Dart entry point convention
- UPPERCASE.md: Convention for `AGENTS.md`, `CLAUDE.md`, `README.md`

**Directories:**
- `snake_case` or full words: App names (`aqwanetio_website`, `aqwanetio_app`)
- `kebab-case`: Shared package directory names (`eslint-config`, `typescript-config`)
- Short lowercase: Platform/standard directories (`app/`, `public/`, `lib/`, `test/`, `src/`)
- Plural nouns: Collection directories (`apps/`, `packages/`, `components/`, `features/`)

## Where to Add New Code

**New Feature (Website):**
- Route pages: `apps/aqwanetio_website/app/{route-name}/page.tsx`
- Shared components: `apps/aqwanetio_website/components/{ComponentName}.tsx`
- Feature modules: `apps/aqwanetio_website/features/{feature-name}/`
- Styles: Tailwind utility classes inline or `apps/aqwanetio_website/app/globals.css`

**New Feature (Flutter App):**
- Screens/pages: `apps/aqwanetio_app/lib/screens/{screen_name}.dart`
- Models: `apps/aqwanetio_app/lib/models/{model_name}.dart`
- Services: `apps/aqwanetio_app/lib/services/{service_name}.dart`
- Widgets: `apps/aqwanetio_app/lib/widgets/{widget_name}.dart`

**New Shared UI Component:**
- Implementation: `packages/ui/src/{component-name}.tsx` (lowercase kebab-case)
- The component is automatically exported via the subpath export pattern `@repo/ui/{component-name}`

**New ESLint Config Profile:**
- Implementation: `packages/eslint-config/{profile-name}.js`
- Add export entry to `packages/eslint-config/package.json`

**New TypeScript Config Preset:**
- Implementation: `packages/typescript-config/{preset-name}.json`
- Extends from `./base.json` following existing pattern

**New App (Monorepo Addition):**
- Create directory: `apps/{new-app-name}/`
- Add workspace reference: Uses same glob pattern (`apps/*`)
- Package name convention: `{name}` (matching the directory name)
- Apply shared configs: `@repo/typescript-config`, `@repo/eslint-config`, `@repo/ui`

**New Package:**
- Create directory: `packages/{new-package-name}/`
- npm scope: `@repo/{new-package-name}`
- Workspace reference: `"@repo/{new-package-name}": "workspace:*"`
- Configure exports in `package.json`

## Special Directories

**.turbo/:**
- Purpose: Turborepo task cache (build artifacts, computed outputs)
- Source: Auto-generated by `turbo build/dev`
- Committed: No (in `.gitignore`)

**.next/:**
- Purpose: Next.js build output and development artifacts
- Source: Auto-generated by `next build` / `next dev`
- Committed: No (in `.gitignore`)

**apps/aqwanetio_app/build/:**
- Purpose: Flutter build output (compiled binaries)
- Source: Auto-generated by `flutter build`
- Committed: No (in `.gitignore`)

**apps/aqwanetio_app/android/, ios/, web/, linux/, macos/, windows/:**
- Purpose: Platform-specific project files for Flutter's multi-platform compilation
- Source: Generated by `flutter create`, modified by platform configuration
- Committed: Yes (required for platform builds)

**node_modules/:**
- Purpose: Installed npm package dependencies (root workspace + hoisted)
- Source: `pnpm install`
- Committed: No (in `.gitignore`)

**.planning/:**
- Purpose: GSD (Get Shit Done) project planning documents and codebase maps
- Source: Created by `/gsd-map-codebase` and `/gsd-plan-phase` commands
- Committed: Yes (shared developer context)

---

*Structure analysis: 2026-07-22*
*Update when directory structure changes*
