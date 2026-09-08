import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/auth_header.dart';
import '../widgets/gradient_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _showPassword = false;
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AuthHeader(isLogin: true),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 8),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 480),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.border),
                          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: AppColors.isDark ? 0.4 : 0.06), blurRadius: 24, offset: const Offset(0, 8))],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(t('auth.signIn'), style: TextStyle(fontSize: 26, fontWeight: FontWeight.w700, color: AppColors.navy)),
                            Container(width: 48, height: 3, margin: const EdgeInsets.symmetric(vertical: 12), decoration: BoxDecoration(color: AppColors.accent, borderRadius: BorderRadius.circular(2))),
                            Text(t('auth.loginDesc'), style: TextStyle(fontSize: 14, color: AppColors.textMuted, height: 1.5)),
                            const SizedBox(height: 24),
                            Text(t('auth.email'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
                            const SizedBox(height: 6),
                            TextField(
                              controller: _emailCtrl,
                              decoration: InputDecoration(
                                hintText: t('auth.emailPlaceholder'),
                                prefixIcon: Icon(Icons.email_outlined, size: 18, color: AppColors.textMuted),
                              ),
                              keyboardType: TextInputType.emailAddress,
                            ),
                            const SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(t('auth.password'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
                                TextButton(
                                  onPressed: () {},
                                  style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 32), tapTargetSize: MaterialTapTargetSize.shrinkWrap),
                                  child: Text(t('auth.forgotPassword'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.navy)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            TextField(
                              controller: _passCtrl,
                              obscureText: !_showPassword,
                              decoration: InputDecoration(
                                hintText: '••••••••',
                                prefixIcon: Icon(Icons.lock_outlined, size: 18, color: AppColors.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility, size: 18),
                                  onPressed: () => setState(() => _showPassword = !_showPassword),
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                SizedBox(
                                  height: 20, width: 20,
                                  child: Checkbox(value: false, onChanged: null, side: BorderSide(color: AppColors.border)),
                                ),
                                const SizedBox(width: 8),
                                Text(t('auth.rememberDevice'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                              ],
                            ),
                            const SizedBox(height: 20),
                            GradientButton(
                              label: t('auth.signIn'),
                              onTap: () async {
                                await authProvider.login(_emailCtrl.text, _passCtrl.text);
                                if (context.mounted) Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false);
                              },
                            ),
                            const SizedBox(height: 4),
                            Center(
                              child: TextButton(
                                style: TextButton.styleFrom(minimumSize: const Size(0, 48), padding: const EdgeInsets.symmetric(horizontal: 16)),
                                onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false),
                                child: Text(t('auth.continueAsGuest'), style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.navy)),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.lock_outline, size: 14, color: AppColors.textMuted),
                          const SizedBox(width: 6),
                          Flexible(
                            child: Text(t('auth.securityNotice'), textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: AppColors.textMuted, height: 1.5)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      ),
    );
  }
}
