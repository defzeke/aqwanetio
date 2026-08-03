import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/auth_header.dart';
import '../widgets/auth_footer.dart';

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
                padding: const EdgeInsets.all(16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 500),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 8),
                      Text(t('auth.signIn'), style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.navy)),
                      Container(width: 40, height: 3, margin: const EdgeInsets.symmetric(vertical: 10), color: AppColors.accent),
                      Text(t('auth.loginDesc'), style: const TextStyle(fontSize: 16, color: AppColors.textMuted)),
                      const SizedBox(height: 16),
                      Text(t('auth.email'), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _emailCtrl,
                        decoration: InputDecoration(
                          hintText: t('auth.emailPlaceholder'),
                          prefixIcon: const Icon(Icons.email_outlined, size: 18, color: AppColors.textMuted),
                        ),
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(t('auth.password'), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
                          Text(t('auth.forgotPassword'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.navy)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _passCtrl,
                        obscureText: !_showPassword,
                        decoration: InputDecoration(
                          hintText: '••••••••',
                          prefixIcon: const Icon(Icons.lock_outlined, size: 18, color: AppColors.textMuted),
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
                            child: Checkbox(value: false, onChanged: null, side: const BorderSide(color: AppColors.border)),
                          ),
                          const SizedBox(width: 8),
                          Text(t('auth.rememberDevice'), style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity, height: 48,
                        child: ElevatedButton(
                          onPressed: () async {
                            await authProvider.login(_emailCtrl.text, _passCtrl.text);
                            if (context.mounted) Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false);
                          },
                          child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                            Text(t('auth.signIn')),
                            const SizedBox(width: 8),
                            const Icon(Icons.arrow_forward, size: 18),
                          ]),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Center(
                        child: TextButton(
                          onPressed: () => Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false),
                          child: Text(t('auth.continueAsGuest'), style: const TextStyle(fontSize: 16, color: AppColors.navy)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(border: Border(top: BorderSide(color: AppColors.border))),
                        child: Text(t('auth.securityNotice'), textAlign: TextAlign.center, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const AuthFooter(),
          ],
        ),
      ),
      ),
    );
  }
}
