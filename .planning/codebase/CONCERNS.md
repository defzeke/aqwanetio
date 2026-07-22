# Codebase Concerns

**Analysis Date:** 2026-07-22

## Tech Debt

### Entire codebase is default boilerplate — zero domain code

- **Issue:** Every source file in every package is the raw scaffold from `create-turborepo`, `create-next-app`, or `flutter create`. The README at `README.md` still says "This Turborepo starter is maintained by the Turborepo core team" and references `docs` and `web` apps that are not in this repo. The website page title (in `apps/aqwanetio_website/app/layout.tsx:16`) is `"Create Next App"`, and the homepage (`apps/aqwanetio_website/app/page.tsx`) displays "To get started, edit the page.tsx file." with Vercel marketing links. The Flutter app's `apps/aqwanetio_app/lib/main.dart:14` reads `title: 'Flutter Demo'`.
- **Files:** `README.md`, `apps/aqwanetio_website/app/layout.tsx`, `apps/aqwanetio_website/app/page.tsx`, `apps/aqwanetio_app/lib/main.dart`
- **Impact:** Zero actual aquaculture water quality monitoring code exists. The project name implies a real IoT/sensor platform, but there is no data model, no API, no sensor reading, no database, and no domain logic anywhere.
- **Fix approach:** Replace every boilerplate file with project-specific code. Define data models for water quality metrics (pH, temperature, turbidity, dissolved oxygen, etc.), create API routes, and build real UI components.

### Duplicate lockfiles — pnpm + npm conflict

- **Issue:** The monorepo uses pnpm (`pnpm-lock.yaml` at root, `packageManager: "pnpm@9.0.0"` in `package.json`), but `apps/aqwanetio_website/` contains an npm `package-lock.json` (233 KB). This means someone ran `npm install` (or `create-next-app` used npm) inside the Next.js directory, bypassing pnpm's workspace resolution. This can produce two different dependency trees and hidden version mismatches.
- **Files:** `pnpm-lock.yaml` (root), `apps/aqwanetio_website/package-lock.json`
- **Impact:** CI builds or other developers using only pnpm may encounter "Module not found" or unexpected behavior because the website's `node_modules` may resolve differently. Duplicate `next` and `react` versions can exist across the two lockfiles.
- **Fix approach:** Delete `apps/aqwanetio_website/package-lock.json` and `apps/aqwanetio_website/node_modules/`. Reinstall everything from root with `pnpm install`. Add `package-lock.json` to root `.gitignore` as a safety net.

### Duplicate dependency versions installed in pnpm store

- **Issue:** The pnpm virtual store at `node_modules/.pnpm/` contains multiple copies of the same packages at different versions. Specifically:
  - `next@16.2.0` and `next@16.2.10` both installed
  - `react@19.2.0` and `react@19.2.4` both installed
  - `react-dom@19.2.0` and `react-dom@19.2.4` both installed
  - `eslint@9.39.1` appears at least twice with different peer dependency chains
  - `eslint-plugin-react-hooks@5.2.0` and `eslint-plugin-react-hooks@7.1.1` both installed
  - Several other packages with dual versions
- **Files:** `node_modules/.pnpm/` (implicit — visible in lockfile and store layout)
- **Impact:** The website (`apps/aqwanetio_website`) depends on `next@16.2.10` and `react@19.2.4`, while the UI package (`packages/ui`) depends on `react@^19.2.0`. The lockfile resolves these differently, potentially bundling multiple React instances in the final build. This can cause "invalid hook call" errors and increased bundle size.
- **Fix approach:** Align all inter-package dependency versions. The workspace packages (`@repo/ui`, `@repo/eslint-config`) should use `workspace:*` or exact version references for shared dependencies like React.

### Flutter app not integrated into Turborepo pipeline

- **Issue:** The root `turbo.json` defines `build`, `lint`, `check-types`, and `dev` tasks, but the Flutter app (`apps/aqwanetio_app`) uses Dart/Flutter tooling, not npm scripts. The root `package.json:10` has `"clean": "turbo run clean && pnpm --filter aqwanetio_app exec flutter clean"`, which is the only Flutter-aware command. There is no turbo task for `flutter build`, `flutter test`, or `flutter analyze`.
- **Files:** `turbo.json`, `package.json`, `apps/aqwanetio_app/pubspec.yaml`
- **Impact:** Running `turbo build` or `turbo lint` from root does nothing for the mobile app. The Flutter app is effectively outside the monorepo build orchestration.
- **Fix approach:** Add `build`, `lint`, `test` tasks in `turbo.json` for the Flutter app using `dependsOn` and custom inputs. Or remove Turbo from the Flutter workflow if it remains a separate build concern.

## Known Bugs

### No known runtime bugs — zero domain code exists

- **Issue:** The codebase has no functional runtime code to have bugs in. All files are generated boilerplate.
- **Import:** This is not a good thing — it means the project has not started its actual engineering work.
- **Priority:** High — immediate domain implementation needed before bug tracking is meaningful.

## Security Considerations

### No environment variable documentation

- **Issue:** `.env`, `.env.local`, `.env.*.local` are in `.gitignore`, but there is no `.env.example` or documented list of required environment variables. Any future developer onboarding has no idea what environment configuration is needed. For an aquaculture project, this will eventually include API keys for sensor gateways, database credentials, and possibly MQTT broker URLs.
- **Files:** `.gitignore` (lines 9-13), `.npmrc` (empty file)
- **Current mitigation:** None. `.npmrc` at root exists but is empty.
- **Recommendations:** Create `.env.example` with documented placeholder values for every required environment variable. Add a `# Environment Variables` section to README.

### No secrets scanning or security testing

- **Issue:** There are no pre-commit hooks, no `.gitleaks.toml`, no GitHub secret scanning workflow, and no dependency vulnerability scanning (no `npm audit`, `pnpm audit`, or Dependabot config).
- **Files:** Not present — no `.husky/`, no `.gitleaks*`, no `Dependabot.yml`, no `.github/workflows/`
- **Current mitigation:** None.
- **Recommendations:** Add `pnpm audit` to the CI pipeline. Enable Dependabot or Renovate for automated dependency updates. Add pre-commit hooks with secret detection.

### AGENTS.md warns that Next.js version has breaking changes

- **Issue:** `apps/aqwanetio_website/AGENTS.md` explicitly states that Next.js 16.2.10 "has breaking changes — APIs, conventions, and file structure may all differ from your training data." This means the boilerplate was generated with a newer Next.js version that may have undocumented migration issues from prior versions, and AI-assisted development tools may produce incorrect code.
- **Files:** `apps/aqwanetio_website/AGENTS.md`, `apps/aqwanetio_website/CLAUDE.md`
- **Current mitigation:** The AGENTS.md file itself (a reference to consult `node_modules/next/dist/docs/` before writing code).
- **Recommendations:** Pin the Next.js version explicitly and document known breaking changes. Keep `node_modules/next/dist/docs/` accessible to developers.

## Performance Bottlenecks

### Bloat from generated boilerplate

- **Issue:** The Flutter app directory (`apps/aqwanetio_app/`) contains ~658 build artifact files totaling ~734 MB in `build/` and ~43 MB in `.dart_tool/`. The Next.js `.next/` directory contains ~316 files (~170 MB). While these are mostly excluded from git (`.dart_tool/` and `build/` are NOT explicitly in `.gitignore`), they consume significant local disk space and slow down editor indexing.
- **Files:** `apps/aqwanetio_app/build/` (658 files, ~734 MB), `apps/aqwanetio_app/.dart_tool/` (19 files, ~43 MB), `apps/aqwanetio_website/.next/` (316 files, ~170 MB)
- **Cause:** Generated build outputs from running Flutter and Next.js dev servers. The Flutter `build/` directory is not in the root `.gitignore`.
- **Improvement path:** Add `apps/aqwanetio_app/build/`, `apps/aqwanetio_app/.dart_tool/`, and `apps/aqwanetio_app/.idea/` to `.gitignore`. Run `flutter clean` periodically. The root `.gitignore` already has `.next/` (line 24) and `build` (line 27), but `apps/aqwanetio_app/build/` should be verified as excluded.

## Fragile Areas

### README.md is a direct copy of Turborepo starter

- **Issue:** The entire `README.md` is the standard Turborepo README template point-for-point, including references to apps (`docs`, `web`) and packages that don't exist in this repository. A developer reading this would have no idea what "aqwanetio" is or how to run the project.
- **Files:** `README.md` (all 159 lines)
- **Why fragile:** Any developer cloning this repo will waste time figuring out the project structure manually. The README provides zero domain context, zero setup instructions specific to this project, and zero information about the aquaculture monitoring purpose.
- **Safe modification:** Full rewrite with project description, architecture overview, setup steps, environment variable documentation, and links to planning docs.
- **Test coverage:** Not applicable (documentation).

### Empty .npmrc file

- **Issue:** `.npmrc` exists at the root of the project but is completely empty (0 bytes). This could cause confusion — is it intentionally empty? Was a config supposed to be there? Is registry configuration missing for the private npm packages?
- **Files:** `.npmrc` (empty)
- **Why fragile:** If the project ever publishes packages or uses a private npm registry, the missing config will cause silent fallback to the public registry. The empty file may also trip up tooling that expects at least a comment.
- **Safe modification:** Either add the expected config (registry, auth token) or delete the file entirely.

## Scaling Limits

### No data layer for aquaculture monitoring

- **Issue:** The project has zero code for storing, querying, or processing water quality sensor data. There is no database client, no ORM, no schema, no API routes, no real-time data handling (MQTT/WebSocket), and no data visualization code. For a project called "aqwanetio" implying IoT water quality monitoring, this is the core missing capability.
- **Files:** None exist — no `prisma/`, no `db/`, no `api/`, no `services/`, no `models/` directories anywhere
- **Current capacity:** Zero data handling.
- **Limit:** Cannot demonstrate any aquaculture monitoring functionality until a data layer is built.
- **Scaling path:** Define data models (sensor readings, ponds/tanks, alert thresholds), choose a database (SQLite for dev, PostgreSQL for production), set up an ORM (Prisma, Drizzle), create REST or GraphQL API routes, and implement real-time ingestion from sensor gateways.

### No testing infrastructure in the website app

- **Issue:** `apps/aqwanetio_website` has no test runner configured, no test files, and no testing dependencies in its `package.json`. The Flutter app has a single boilerplate test (`apps/aqwanetio_app/test/widget_test.dart`). The shared packages have no tests either. There is no coverage tool configured anywhere.
- **Files:** `apps/aqwanetio_website/package.json` (no test dependencies), `packages/ui/package.json` (no test dependencies)
- **Current capacity:** Effectively zero test coverage for the entire codebase.
- **Limit:** Cannot safely refactor or add features without manual regression testing.
- **Scaling path:** Add Vitest or Jest to the website app and UI package. Add Flutter widget tests. Set minimum coverage thresholds. Add test tasks to `turbo.json`.

## Dependencies at Risk

### pnpm version pinned to 9.0.0

- **Risk:** The `packageManager` field in `package.json:17` pins `pnpm@9.0.0`. This is a specific version that may contain bugs fixed in later patch releases (current pnpm releases are well past 9.0.0). CI environments or developer machines with different pnpm versions may encounter install failures or behavior differences.
- **Impact:** Build reproducibility issues. Features or fixes from newer pnpm versions are unavailable.
- **Migration plan:** Update to the latest pnpm 9.x stable release. Use `pnpm@latest-9` or specify the exact latest patch version.

### Sharp native binary duplication

- **Risk:** The pnpm store contains `sharp-win32-x64` binaries and `@img/sharp-win32-x64` packages. This is the native image processing library used by Next.js. Having both `sharp@0.34.5` and platform-specific `@img/sharp-*` packages suggests platform override chains that may not resolve correctly on non-Windows CI runners (Linux/macOS).
- **Impact:** CI builds on Linux or macOS may fail or silently fall back to smaller bundled `sharp`, producing different image optimization behavior.
- **Migration plan:** Ensure `sharp` is in `dependencies` (not `devDependencies`) for the Next.js app. Add `.npmrc` with `sharp_bin_host` config if cross-platform builds are needed.

## Missing Critical Features

### Zero aquaculture domain implementation

- **Problem:** The project name "aqwanetio" and the two monorepo apps (website + mobile) suggest an aquaculture water quality monitoring platform. However, there are no implemented features related to this domain:
  - No sensor data ingestion (no MQTT, CoAP, HTTP API, or serial integration)
  - No water quality parameter models (pH, temperature, TDS, turbidity, dissolved oxygen, ammonia, nitrite, nitrate)
  - No data visualization (no charts, no real-time dashboards, no alerts)
  - No user authentication
  - No device management
  - No alert/threshold system
  - No database or persistence layer
  - No API endpoints
  - No offline/edge capabilities for remote fish farms
- **Blocks:** The project cannot be deployed, demonstrated, or tested for its intended purpose.
- **Priority:** Critical — this is the entire value of the project.

## Test Coverage Gaps

### Complete absence of tests

- **What's not tested:** Every part of the codebase. The website app (`apps/aqwanetio_website`) has zero test configuration and zero test files. The UI package (`packages/ui`) has zero tests. The only test file is the Flutter app's boilerplate counter test (`apps/aqwanetio_app/test/widget_test.dart`), which tests the scaffold counter widget that will be replaced.
- **Files:** `apps/aqwanetio_website/package.json` (no test framework), `packages/ui/package.json` (no test framework), `apps/aqwanetio_app/test/widget_test.dart` (boilerplate only)
- **Risk:** Any refactoring or feature addition carries high risk of regression. The lack of tests means there is no safety net for the most critical part — the sensor data correctness.
- **Priority:** High — testing infrastructure should be established before writing domain code, not after.

---

*Concerns audit: 2026-07-22*
