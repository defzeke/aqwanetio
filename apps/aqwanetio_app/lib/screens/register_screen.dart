import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/auth_header.dart';
import '../widgets/auth_footer.dart';

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
                padding: const EdgeInsets.all(16),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 500),
                  child: Form(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(t('auth.createAccount'), style: const TextStyle(fontSize: 16, color: AppColors.navy)),
                        const SizedBox(height: 4),
                        Text(t('auth.registerDesc'), style: const TextStyle(fontSize: 16, color: AppColors.textMuted)),
                        const SizedBox(height: 16),
                        Row(children: [
                          Expanded(child: Container(height: 4, decoration: BoxDecoration(color: _step >= 1 ? AppColors.tealDark : AppColors.border, borderRadius: BorderRadius.circular(2)))),
                          const SizedBox(width: 8),
                          Expanded(child: Container(height: 4, decoration: BoxDecoration(color: _step >= 2 ? AppColors.tealDark : AppColors.border, borderRadius: BorderRadius.circular(2)))),
                        ]),
                        const SizedBox(height: 16),
                        if (_step == 1) _stepOne(),
                        if (_step == 2) _stepTwo(),
                        const SizedBox(height: 8),
                        _termsCheckbox(),
                        const SizedBox(height: 16),
                        if (_step == 1)
                          SizedBox(
                            width: double.infinity, height: 44,
                            child: ElevatedButton(
                              onPressed: _termsAccepted ? () => setState(() => _step = 2) : null,
                              child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Text(t('auth.registerButton')),
                                const SizedBox(width: 8),
                                const Icon(Icons.arrow_forward, size: 16),
                              ]),
                            ),
                          ),
                        if (_step == 2)
                          SizedBox(
                            width: double.infinity, height: 44,
                            child: ElevatedButton(
                              onPressed: () async {
                                await authProvider.register('', '', '');
                                if (context.mounted) Navigator.of(context).pushNamedAndRemoveUntil('/home', (_) => false);
                              },
                              child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                                Text(t('auth.completeRegistration')),
                                const SizedBox(width: 8),
                                const Icon(Icons.arrow_forward, size: 16),
                              ]),
                            ),
                          ),
                        const SizedBox(height: 16),
                        Center(child: Text(t('auth.version'), style: const TextStyle(fontSize: 14, color: AppColors.textMuted))),
                      ],
                    ),
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

  Widget _stepOne() {
    return Column(children: [
      Row(children: [
        Expanded(child: _field(t('auth.fullName'), t('auth.fullNamePlaceholder'), false)),
        const SizedBox(width: 12),
        Expanded(child: _field(t('auth.organization'), t('auth.orgPlaceholder'), false)),
      ]),
      const SizedBox(height: 12),
      _field(t('auth.emailOfficial'), t('auth.emailPlaceholder'), false, email: true),
      const SizedBox(height: 12),
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
      decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(8), color: AppColors.gray100),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.reviewInfo'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.navy)),
        const SizedBox(height: 16),
        Text('${t('auth.fullName')}: ${t('auth.fromForm')}', style: const TextStyle(fontSize: 14)),
        const SizedBox(height: 8),
        Text('${t('auth.organization')}: ${t('auth.fromForm')}', style: const TextStyle(fontSize: 14)),
        const SizedBox(height: 8),
        Text('${t('auth.email')}: ${t('auth.fromForm')}', style: const TextStyle(fontSize: 14)),
        const SizedBox(height: 12),
        Text(t('auth.verificationNotice'), style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
      ]),
    );
  }

  Widget _field(String label, String hint, bool obscure, {bool email = false}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(fontSize: 14, color: AppColors.text)),
      const SizedBox(height: 4),
      TextField(
        obscureText: obscure,
        keyboardType: email ? TextInputType.emailAddress : null,
        decoration: InputDecoration(hintText: hint, isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12)),
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
          side: const BorderSide(color: AppColors.border),
        ),
      ),
      const SizedBox(width: 8),
      Expanded(
        child: RichText(
          text: TextSpan(
            style: const TextStyle(fontSize: 14, color: AppColors.textMuted),
            children: [
              TextSpan(text: '${t('terms.prefix')} '),
              TextSpan(text: t('footer.tos'), style: const TextStyle(color: AppColors.tealDark)),
              TextSpan(text: ' ${t('terms.and')} '),
              TextSpan(text: t('footer.privacy'), style: const TextStyle(color: AppColors.tealDark)),
              TextSpan(text: ' ${t('terms.suffix')}'),
            ],
          ),
        ),
      ),
    ]);
  }
}
