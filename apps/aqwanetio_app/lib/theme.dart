import 'package:flutter/material.dart';

class AppColors {
  static const primary = Color(0xFF003366);
  static const primaryDark = Color(0xFF002244);
  static const primaryLight = Color(0xFF004080);
  static const accent = Color(0xFF008080);
  static const accentDark = Color(0xFF006666);
  static const accentLight = Color(0xFF009999);
  static const navy = Color(0xFF001e40);
  static const tealDark = Color(0xFF006a6a);
  static const gray100 = Color(0xFFf7f9fb);
  static const gray200 = Color(0xFFe0e3e5);
  static const gray300 = Color(0xFFc3c6d1);
  static const gray600 = Color(0xFF43474f);
  static const gray700 = Color(0xFF737780);
  static const gray800 = Color(0xFF6b7280);
  static const gray900 = Color(0xFF191c1e);
  static const inputBg = Color(0xFFeceef0);
  static const background = Color(0xFFF8FAFC);
  static const surface = Color(0xFFFFFFFF);
  static const text = Color(0xFF1E293B);
  static const textMuted = Color(0xFF64748B);
  static const alert = Color(0xFFDC2626);
  static const warning = Color(0xFFD97706);
  static const safe = Color(0xFF166534);
  static const border = Color(0xFFE2E8F0);
}

ThemeData aqwaTheme() => ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.light(
    primary: AppColors.primary,
    secondary: AppColors.accent,
    surface: AppColors.surface,
    error: AppColors.alert,
  ),
  scaffoldBackgroundColor: AppColors.background,
  appBarTheme: const AppBarTheme(
    backgroundColor: AppColors.surface,
    foregroundColor: AppColors.text,
    elevation: 0,
    scrolledUnderElevation: 0,
  ),
  dividerTheme: const DividerThemeData(color: AppColors.border, thickness: 1),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: AppColors.inputBg,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: AppColors.border),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: AppColors.border),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(4),
      borderSide: const BorderSide(color: AppColors.accent, width: 2),
    ),
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
