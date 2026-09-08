import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/auth_header.dart';
import '../widgets/gradient_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _step = 1;
  bool _termsAccepted = false;

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            const AuthHeader(isLogin: false),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
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
                            Text(t('auth.createAccount'), style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.navy)),
                            const SizedBox(height: 8),
                            Text(t('auth.registerDesc'), style: TextStyle(fontSize: 14, color: AppColors.textMuted, height: 1.5)),
                            const SizedBox(height: 20),
                            Row(children: [
                              Expanded(child: Container(height: 4, decoration: BoxDecoration(color: _step >= 1 ? AppColors.cyan : AppColors.border, borderRadius: BorderRadius.circular(2)))),
                              const SizedBox(width: 8),
                              Expanded(child: Container(height: 4, decoration: BoxDecoration(color: _step >= 2 ? AppColors.cyan : AppColors.border, borderRadius: BorderRadius.circular(2)))),
                            ]),
                            const SizedBox(height: 20),
                            if (_step == 1) _stepOne(),
                            if (_step == 2) _stepTwo(),
                            const SizedBox(height: 8),
                            _termsCheckbox(),
                            const SizedBox(height: 20),
                            if (_step == 1)
                              GradientButton(
                                label: t('auth.registerButton'),
                                onTap: _termsAccepted ? () => setState(() => _step = 2) : null,
                              ),
                            if (_step == 2)
                              GradientButton(
                                label: t('auth.completeRegistration'),
                                onTap: () async {
                                  await authProvider.register('', '', '');
                                  if (context.mounted) Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false);
                                },
                              ),
                          ],
                        ),
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

  Widget _stepOne() {
    return Column(children: [
      Row(children: [
        Expanded(child: _field(t('auth.fullName'), t('auth.fullNamePlaceholder'), false)),
        const SizedBox(width: 12),
        Expanded(child: _field(t('auth.organization'), t('auth.orgPlaceholder'), false)),
      ]),
      const SizedBox(height: 20),
      _field(t('auth.emailOfficial'), t('auth.emailPlaceholder'), false, email: true),
      const SizedBox(height: 20),
      Row(children: [
        Expanded(child: _field(t('auth.password'), '••••••••', true)),
        const SizedBox(width: 12),
        Expanded(child: _field(t('auth.confirmPassword'), '••••••••', true)),
      ]),
    ]);
  }

  Widget _stepTwo() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(12), color: AppColors.gray100),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.reviewInfo'), style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.navy)),
        const SizedBox(height: 16),
        Text('${t('auth.fullName')}: ${t('auth.fromForm')}', style: TextStyle(fontSize: 14, color: AppColors.text)),
        const SizedBox(height: 8),
        Text('${t('auth.organization')}: ${t('auth.fromForm')}', style: TextStyle(fontSize: 14, color: AppColors.text)),
        const SizedBox(height: 8),
        Text('${t('auth.email')}: ${t('auth.fromForm')}', style: TextStyle(fontSize: 14, color: AppColors.text)),
        const SizedBox(height: 12),
        Text(t('auth.verificationNotice'), style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
      ]),
    );
  }

  Widget _field(String label, String hint, bool obscure, {bool email = false}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
      const SizedBox(height: 6),
      TextField(
        obscureText: obscure,
        keyboardType: email ? TextInputType.emailAddress : null,
        decoration: InputDecoration(hintText: hint, isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14)),
      ),
    ]);
  }

  Widget _termsCheckbox() {
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      SizedBox(
        height: 24, width: 24,
        child: Checkbox(
          value: _termsAccepted,
          onChanged: (v) => setState(() => _termsAccepted = v ?? false),
          side: BorderSide(color: AppColors.border),
          activeColor: AppColors.accent,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        ),
      ),
      const SizedBox(width: 8),
      Expanded(
        child: RichText(
          text: TextSpan(
            style: TextStyle(fontSize: 14, color: AppColors.textMuted, height: 1.4),
            children: [
              TextSpan(text: '${t('terms.prefix')} '),
              TextSpan(text: t('footer.tos'), style: TextStyle(color: AppColors.cyan)),
              TextSpan(text: ' ${t('terms.and')} '),
              TextSpan(text: t('footer.privacy'), style: TextStyle(color: AppColors.cyan)),
              TextSpan(text: ' ${t('terms.suffix')}'),
            ],
          ),
        ),
      ),
    ]);
  }
}
