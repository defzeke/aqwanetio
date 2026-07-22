# Testing Patterns

**Analysis Date:** 2026-07-22

## Test Framework

**Runner:**
- Flutter app: `flutter_test` SDK package (integrated with `flutter test` command)
- No JavaScript/TypeScript test framework detected — Jest, Vitest, Playwright not installed
- No test scripts in any `package.json` across the monorepo

**Assertion Library:**
- Flutter: `flutter_test` built-in expect with matchers
- Key matchers: `findsOneWidget`, `findsNothing`, `findsNWidgets`
- No TypeScript assertion library configured

**Run Commands:**
```bash
flutter test                                              # Run all Flutter tests (from apps/aqwanetio_app/)
flutter test test/widget_test.dart                        # Single test file
flutter test --reporter expanded                          # Detailed output
flutter test --coverage                                   # Coverage report
```

*No TypeScript test commands exist yet — no test runner configured.*

## Test File Organization

**Location:**
- Flutter: tests in `apps/aqwanetio_app/test/` directory (separate from source in `lib/`)
- TypeScript: No test files exist anywhere in the monorepo

**Naming:**
- Flutter: `{feature}_test.dart` pattern (`widget_test.dart`)
- No convention yet for TypeScript test files

**Structure:**
```
apps/aqwanetio_app/
├── lib/
│   └── main.dart              # Source code
└── test/
    └── widget_test.dart       # Test file mirroring lib structure

packages/ui/src/
├── button.tsx                 # No corresponding test
├── card.tsx                   # No corresponding test
└── code.tsx                   # No corresponding test

apps/aqwanetio_website/
├── app/
│   ├── layout.tsx             # No corresponding test
│   └── page.tsx               # No corresponding test
```

## Test Structure

**Suite Organization (Flutter):**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:aqwanetio_app/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that our counter starts at 0.
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // Tap the '+' icon and trigger a frame.
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // Verify that our counter has incremented.
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

**Patterns:**
- Top-level `void main()` with `testWidgets()` calls
- `tester.pumpWidget()` to render the app
- `tester.pump()` to trigger a rebuild after state change
- `find.text()`, `find.byIcon()` for widget discovery
- `expect()` with `findsOneWidget` / `findsNothing` matchers
- No `describe()` or `group()` blocks — single flat test
- No `setUp()` / `tearDown()` methods used yet

## Mocking

**Framework:**
- Flutter: `mockito` package not installed (no mocking dependency in `pubspec.yaml`)
- TypeScript: No mocking framework configured

**Patterns:**
- No mocking patterns exist in this codebase yet
- The current Flutter test is a pure widget integration test (no mock needed)

**What to Mock:**
- Not applicable — no mocks currently used
- Future: Flutter services (API, database, platform channels) should use `mockito` or `mocktail`

**What NOT to Mock:**
- Not established yet

## Fixtures and Factories

**Test Data:**
- No fixture or factory patterns exist
- Flutter test uses the real `MyApp` widget directly (`tester.pumpWidget(const MyApp())`)
- No test data factories defined

**Location:**
- No fixtures directory exists

## Coverage

**Requirements:**
- No enforced coverage target
- `.gitignore` includes `coverage/` directory (line 16)
- Coverage is acknowledged but not configured

**Configuration:**
- No coverage configuration files found
- Flutter: `flutter test --coverage` generates `coverage/lcov.info`
- No TypeScript coverage tool configured

**View Coverage:**
```bash
flutter test --coverage                          # Generate coverage
genhtml coverage/lcov.info -o coverage/html      # Generate HTML report (requires lcov)
```

## Test Types

**Unit Tests:**
- Not present in the codebase
- No unit tests for `@repo/ui` components, website pages, or Flutter models/services

**Widget Tests (Flutter):**
- One widget test exists: `widget_test.dart`
- Tests the `MyApp` widget renders and the counter increments
- Renders the full app widget tree (not isolated widget testing)

**Integration Tests:**
- Not present in the codebase
- No Flutter integration tests in `test_driver/` or similar

**E2E Tests:**
- Not present
- No Playwright, Cypress, or other E2E framework configured

## Common Patterns

**Async Testing:**
```dart
// Flutter widget test
testWidgets('Counter increments smoke test', (WidgetTester tester) async {
  await tester.pumpWidget(const MyApp());
  // assertions
});
```

**Error Testing:**
- No error testing patterns exist yet

**Snapshot Testing:**
- Not used
- No `__snapshots__/` directories found

---

*Testing analysis: 2026-07-22*
*Update when test patterns change*
