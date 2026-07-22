# Architecture

**Analysis Date:** 2026-07-22

## Pattern Overview

**Overall:** Turborepo Monorepo — Multi-platform application shell with shared packages.

**Key Characteristics:**
- Monorepo managed by Turborepo v2 with pnpm workspaces
- Two independent application targets: Next.js website and Flutter mobile app
- Shared packages for UI components, ESLint configs, and TypeScript configs
- No backend or API layer yet — all code is client-side or build-time only
- Default starter boilerplate throughout — no domain-specific architecture has been established yet

## System Overview

```text
┌────────────────────────────────────────────────────────────────┐
│                        Turborepo Root                          │
│               `package.json` / `turbo.json`                     │
├────────────────────────┬───────────────────────────────────────┤
│    apps/                │    packages/                          │
│  ┌──────────────────┐   │  ┌──────────────────────────────┐    │
│  │  aqwanetio_website│   │  │  ui                          │    │
│  │  (Next.js 16)     │   │  │  (React components)          │    │
│  │  `apps/*/`        │   │  │  `packages/ui/src/`          │    │
│  ├──────────────────┤   │  ├──────────────────────────────┤    │
│  │  aqwanetio_app   │   │  │  eslint-config                │    │
│  │  (Flutter/Dart)  │   │  │  (Shared ESLint configs)      │    │
│  │  `apps/*/`       │   │  │  `packages/eslint-config/`    │    │
│  └──────────────────┘   │  ├──────────────────────────────┤    │
│                         │  │  typescript-config            │    │
│                         │  │  (Shared tsconfig presets)    │    │
│                         │  │  `packages/typescript-config/`│    │
│                         │  └──────────────────────────────┘    │
└────────────────────────┴───────────────────────────────────────┘
```

## Layers

**Monorepo Root Layer:**
- Purpose: Orchestrate builds, linting, and dev across all packages and apps
- Location: Root `package.json`, `turbo.json`, `pnpm-workspace.yaml`
- Contains: Workspace config, task definitions, global devDependencies (Turborepo, Prettier, TypeScript)
- Depends on: pnpm, Node.js >=18
- Used by: All workspace packages and apps

**Application Layer (apps/):**
- Purpose: Deployable frontends with their own routing, rendering, and build pipeline
- Contains: Page/route components, platform-specific config, static assets
- Depends on: Shared packages (`@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`)
- Used by: End users (browser/mobile)

**Shared Package Layer (packages/):**
- Purpose: Reusable configs and components consumed by apps
- Contains: UI component library, ESLint config profiles, TypeScript compiler presets
- Depends on: Core dev dependencies (React, TypeScript, ESLint)
- Used by: All apps and other packages

## Data Flow

**Website Request Lifecycle (Next.js App Router):**

1. User requests URL (e.g., `GET /`)
2. Next.js server resolves route via App Router (`app/` directory)
3. Server component (`app/page.tsx`) renders HTML with Tailwind CSS
4. Response streamed to browser — no API calls, no data fetching
5. Client-side hydration for interactive elements (if any)

**State Management:**
- Website: Stateless server rendering — no persistent client or server state
- Flutter App: In-memory widget-local state via `setState()` (counter demo pattern)
- Authentication: Not implemented
- Data storage: Not configured

## Key Abstractions

**Next.js App Router Route (website):**
- Purpose: File-system based routing where each file in `app/` directory maps to a URL path
- Examples: `app/page.tsx` (route `/`), `app/layout.tsx` (root layout)
- Pattern: Next.js file-convention routing with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

**React Server Component (website):**
- Purpose: Components that render on the server with zero client-side JavaScript
- Examples: `app/page.tsx` — runs entirely on server by default
- Pattern: Default export from page files, async components allowed

**Flutter Widget (app):**
- Purpose: Composable UI building blocks forming the widget tree
- Examples: `lib/main.dart` — `MyApp` (StatelessWidget root), `MyHomePage` (StatefulWidget with `_MyHomePageState`)
- Pattern: Flutter widget composition with `StatefulWidget`/`StatelessWidget` base classes

**Shared React Component (packages/ui):**
- Purpose: Reusable UI primitives shared across apps
- Examples: `packages/ui/src/button.tsx`, `packages/ui/src/card.tsx`, `packages/ui/src/code.tsx`
- Pattern: Standard React components with typed props interfaces

**Workspace Package Reference:**
- Purpose: Internal dependency resolution across monorepo packages
- Examples: `"@repo/ui": "workspace:*"`, `"@repo/eslint-config": "workspace:*"`
- Pattern: pnpm workspace protocol with `@repo/*` npm scope

## Entry Points

**Root Workspace Commands:**
- Location: Root `package.json` scripts
- Triggers: `pnpm dev`, `pnpm build`, `pnpm lint` (delegates to `turbo run`)
- Responsibilities: Orchestrate parallel tasks across all workspace packages

**Website Dev/Production:**
- Location: `apps/aqwanetio_website/`
- Triggers: `turbo run dev` starts Next.js dev server on `localhost:3000`; `turbo run build` produces static output
- Responsibilities: Serve pages, handle routing, server rendering

**Flutter App Entry:**
- Location: `apps/aqwanetio_app/lib/main.dart` (`main()` function)
- Triggers: `flutter run` (or `turbo run dev` for this app)
- Responsibilities: Initialize widget tree, start Flutter engine

**Package Entry Points:**
- `packages/ui/package.json` — exports: `"./*": "./src/*.tsx"` (each file becomes a subpath export)
- `packages/eslint-config/package.json` — exports: `./base`, `./next-js`, `./react-internal`
- `packages/typescript-config/` — exported via JSON files: `base.json`, `nextjs.json`, `react-library.json`

## Error Handling

**Strategy:** Default framework error handling — no custom error boundaries or middleware implemented

**Patterns:**
- Next.js `error.tsx` convention available but not yet created
- Flutter default red-screen-of-debug for uncaught errors
- No custom error types, no error logging service configured

## Cross-Cutting Concerns

**Logging:**
- Not configured beyond framework defaults (no structured logging, no external service)
- Website uses standard console/terminal output from Next.js

**Validation:**
- Not implemented at any layer — no schema validation, no input sanitization
- Flutter counter app has no forms or user input

**Authentication:**
- Not implemented — no auth middleware, no login flows, no session management

**Styling (Website):**
- Tailwind CSS v4 applied via PostCSS (`@tailwindcss/postcss` plugin)
- CSS custom properties for theme (`globals.css` with `@theme inline` block)
- Geist font family via next/font/google
- Dark mode via `prefers-color-scheme` media query

**Styling (Flutter):**
- Material Design via Flutter SDK (`MaterialApp` with default theme)
- Cupertino Icons package available

---

*Architecture analysis: 2026-07-22*
*Update when major patterns change*
