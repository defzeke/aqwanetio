import 'package:flutter/material.dart';

/// Brightness-switching palette. Light values are the app's original design;
/// dark values mirror the website's globals.css tokens exactly where they
/// exist (background/surface/raised/line/ink/muted, status colors, cyan).
class AppColors {
  AppColors._();

  /// Set by SettingsProvider; whole UI rebuilds on toggle via ListenableBuilder.
  static bool isDark = false;

  // Brand (constant across modes).
  static const primary = Color(0xFF003366);
  static const accent = Color(0xFF008080);

  // Site cyan, used for links/progress/switches in dark mode.
  static Color get cyan => isDark ? const Color(0xFF00aeef) : const Color(0xFF006a6a);

  // Heading/link text: navy in light, ink in dark.
  static Color get navy => isDark ? const Color(0xFFf1f4f8) : const Color(0xFF001e40);

  // Neutrals (site tokens).
  static Color get background => isDark ? const Color(0xFF0d0f13) : const Color(0xFFF8FAFC);
  static Color get surface => isDark ? const Color(0xFF16191f) : const Color(0xFFFFFFFF);
  static Color get raised => isDark ? const Color(0xFF1b1f27) : const Color(0xFFf7f9fb);
  static Color get border => isDark ? const Color(0xFF232832) : const Color(0xFFE2E8F0);
  static Color get inputBg => isDark ? const Color(0xFF101318) : const Color(0xFFeceef0);
  static Color get text => isDark ? const Color(0xFFf1f4f8) : const Color(0xFF1E293B);
  static Color get textMuted => isDark ? const Color(0xFF9aa3af) : const Color(0xFF64748B);

  // Legacy chip/fill grays -> raised/line family.
  static Color get gray100 => raised;
  static Color get gray200 => isDark ? const Color(0xFF1b1f27) : const Color(0xFFe0e3e5);
  static Color get gray300 => isDark ? const Color(0xFF39414d) : const Color(0xFFc3c6d1);

  // Status (site dark variants).
  static Color get alert => isDark ? const Color(0xFFff6b6b) : const Color(0xFFDC2626);
  static Color get warning => isDark ? const Color(0xFFf5a623) : const Color(0xFFD97706);
  static Color get safe => isDark ? const Color(0xFF22c55e) : const Color(0xFF166534);

  // Chart tokens (site chart-grid).
  static Color get chartGrid => isDark ? const Color(0xFF2a313c) : const Color(0xFFe5e7eb);
  static Color get chartBand => isDark ? const Color(0xFFff6b6b).withValues(alpha: 0.18) : const Color(0xFFfecaca).withValues(alpha: 0.4);
}

ThemeData aqwaTheme() => ThemeData(
  useMaterial3: true,
  brightness: AppColors.isDark ? Brightness.dark : Brightness.light,
  colorScheme: AppColors.isDark
      ? ColorScheme.dark(primary: AppColors.primary, secondary: AppColors.accent, surface: AppColors.surface, error: AppColors.alert)
      : ColorScheme.light(primary: AppColors.primary, secondary: AppColors.accent, surface: AppColors.surface, error: AppColors.alert),
  scaffoldBackgroundColor: AppColors.background,
  appBarTheme: AppBarTheme(
    backgroundColor: AppColors.surface,
    foregroundColor: AppColors.text,
    elevation: 0,
    scrolledUnderElevation: 0,
  ),
  dividerTheme: DividerThemeData(color: AppColors.border, thickness: 1),
  navigationBarTheme: NavigationBarThemeData(
    height: 70,
    backgroundColor: AppColors.surface.withValues(alpha: 0.85),
    surfaceTintColor: Colors.transparent,
    elevation: 3,
    indicatorColor: AppColors.primary.withValues(alpha: 0.12),
    iconTheme: WidgetStateProperty.resolveWith(
      (states) => IconThemeData(
        size: states.contains(WidgetState.selected) ? 26 : 24,
        color: states.contains(WidgetState.selected) ? AppColors.navy : AppColors.textMuted,
      ),
    ),
    labelTextStyle: WidgetStateProperty.resolveWith(
      (states) => TextStyle(
        fontSize: states.contains(WidgetState.selected) ? 12 : 11,
        fontWeight: states.contains(WidgetState.selected) ? FontWeight.w600 : FontWeight.w500,
        color: states.contains(WidgetState.selected) ? AppColors.navy : AppColors.textMuted,
      ),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: AppColors.surface,
    hintStyle: TextStyle(color: AppColors.textMuted.withValues(alpha: 0.6)),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: AppColors.border, width: 1.4),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide(color: AppColors.border, width: 1.4),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: AppColors.accent, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: AppColors.primary,
      foregroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      padding: const EdgeInsets.symmetric(vertical: 14),
      textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    ),
  ),
);
