import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/auth_header.dart';
import '../widgets/gradient_button.dart';

/// Mirrors apps/aqwanetio_website/app/auth/register/page.tsx:
/// Step 1 = first/last name + email + PH phone, Step 2 = passwords,
/// Step 3 = review + terms + submit.
class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});
  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  int _step = 1;
  bool _termsAccepted = false;
  bool _submitting = false;
  String? _submitError;

  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _phoneTouched = false;
  bool _confirmTouched = false;

  final _firstCtrl = TextEditingController();
  final _lastCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _confirmCtrl = TextEditingController();

  @override
  void dispose() {
    _firstCtrl.dispose();
    _lastCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _passCtrl.dispose();
    _confirmCtrl.dispose();
    super.dispose();
  }

  void _refresh() => setState(() {});

  /// Approximation of the website's isValidPhoneNumber(phone, 'PH'):
  /// Philippine mobile numbers are +63/0 + 9 + 9 digits.
  static bool isValidPhPhone(String raw) {
    final digits = raw.replaceAll(RegExp(r'[\s\-.]'), '');
    return RegExp(r'^(\+639\d{9}|09\d{9})$').hasMatch(digits);
  }

  String get _firstTrim => _firstCtrl.text.trim();
  String get _lastTrim => _lastCtrl.text.trim();
  String get _emailTrim => _emailCtrl.text.trim();
  String get _phoneTrim => _phoneCtrl.text.trim();

  bool get _phoneValid => _phoneTrim.isNotEmpty && isValidPhPhone(_phoneTrim);

  bool get _isPersonalValid =>
      _firstTrim.isNotEmpty &&
      _firstTrim.length <= 50 &&
      _lastTrim.isNotEmpty &&
      _lastTrim.length <= 50 &&
      _emailTrim.isNotEmpty &&
      _phoneValid;

  bool get _isPasswordValid =>
      _passCtrl.text.length >= 8 &&
      _confirmCtrl.text.isNotEmpty &&
      _passCtrl.text == _confirmCtrl.text;

  Future<void> _submit() async {
    if (!_termsAccepted || _submitting) return;
    setState(() {
      _submitting = true;
      _submitError = null;
    });
    try {
      await authProvider.register(
        _firstTrim,
        _lastTrim,
        _emailTrim,
        _phoneTrim,
        _passCtrl.text,
      );
      if (!mounted) return;
      await _showSuccessDialog();
    } catch (e) {
      final msg = e.toString().toLowerCase();
      setState(() {
        _submitError = (msg.contains('already exists') || msg.contains('email-already-exists'))
            ? t('auth.emailAlreadyRegistered')
            : e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<void> _showSuccessDialog() {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => _RegisterSuccessDialog(
        onPrimary: () => Navigator.of(context).pushNamedAndRemoveUntil('/login', (_) => false),
      ),
    );
  }

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
                            _progressBar(),
                            const SizedBox(height: 20),
                            if (_step == 1) _stepOne(),
                            if (_step == 2) _stepTwoPasswords(),
                            if (_step == 3) _stepThreeReview(),
                            if (_step == 3) ...[
                              const SizedBox(height: 16),
                              _termsCheckbox(),
                            ],
                            if (_submitError != null) ...[
                              const SizedBox(height: 12),
                              _banner(_submitError!, AppColors.alert),
                            ],
                            const SizedBox(height: 20),
                            if (_step == 1)
                              GradientButton(
                                label: t('auth.next'),
                                onTap: _isPersonalValid ? () => setState(() => _step = 2) : null,
                              ),
                            if (_step == 2) ...[
                              GradientButton(
                                label: t('auth.next'),
                                onTap: _isPasswordValid ? () => setState(() => _step = 3) : null,
                              ),
                              const SizedBox(height: 4),
                              _backButton(() => setState(() => _step = 1)),
                            ],
                            if (_step == 3) ...[
                              GradientButton(
                                label: _submitting ? t('auth.registering') : t('auth.completeRegistration'),
                                onTap: (_termsAccepted && !_submitting) ? _submit : null,
                              ),
                              const SizedBox(height: 4),
                              _backButton(_submitting ? null : () => setState(() => _step = 2)),
                            ],
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

  Widget _progressBar() {
    Widget bar(bool active) => Expanded(
      child: Container(
        height: 4,
        decoration: BoxDecoration(
          color: active ? AppColors.cyan : AppColors.border,
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    );
    return Row(children: [
      bar(_step >= 1),
      const SizedBox(width: 8),
      bar(_step >= 2),
      const SizedBox(width: 8),
      bar(_step >= 3),
    ]);
  }

  Widget _backButton(VoidCallback? onTap) {
    return Center(
      child: TextButton(
        onPressed: onTap,
        style: TextButton.styleFrom(minimumSize: const Size(0, 40)),
        child: Text('← ${t('auth.back')}',
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
      ),
    );
  }

  Widget _banner(String msg, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(msg, style: TextStyle(fontSize: 13, color: color)),
    );
  }

  // Step 1: first + last name, official email, PH phone (website StepOneForm).
  Widget _stepOne() {
    final showPhoneError = _phoneTouched && !_phoneValid;
    final phoneErrorMsg =
        _phoneTrim.isEmpty ? t('auth.phoneRequired') : t('auth.phoneInvalid');
    return Column(children: [
      Row(children: [
        Expanded(
          child: _field(
            label: t('auth.firstName'),
            hint: t('auth.firstNamePlaceholder'),
            icon: Icons.person_outlined,
            controller: _firstCtrl,
            maxLength: 50,
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _field(
            label: t('auth.lastName'),
            hint: t('auth.lastNamePlaceholder'),
            icon: Icons.person_outlined,
            controller: _lastCtrl,
            maxLength: 50,
          ),
        ),
      ]),
      const SizedBox(height: 20),
      _field(
        label: t('auth.emailOfficial'),
        hint: t('auth.emailPlaceholder'),
        icon: Icons.email_outlined,
        controller: _emailCtrl,
        keyboardType: TextInputType.emailAddress,
      ),
      const SizedBox(height: 20),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.phoneNumber'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
        const SizedBox(height: 6),
        TextField(
          controller: _phoneCtrl,
          keyboardType: TextInputType.phone,
          onChanged: (_) => _refresh(),
          onEditingComplete: () => setState(() => _phoneTouched = true),
          decoration: InputDecoration(
            hintText: t('auth.phonePlaceholder'),
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            prefixIcon: Icon(Icons.phone_outlined, size: 18, color: AppColors.textMuted),
            errorText: showPhoneError ? phoneErrorMsg : null,
          ),
        ),
      ]),
    ]);
  }

  // Step 2: password + confirm with show/hide (website StepTwoPasswords).
  Widget _stepTwoPasswords() {
    final tooShort = _passCtrl.text.isNotEmpty && _passCtrl.text.length < 8;
    final mismatch = _confirmTouched &&
        _confirmCtrl.text.isNotEmpty &&
        _passCtrl.text != _confirmCtrl.text;
    return Column(children: [
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.password'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
        const SizedBox(height: 6),
        TextField(
          controller: _passCtrl,
          obscureText: !_showPassword,
          maxLength: 128,
          onChanged: (_) => _refresh(),
          decoration: InputDecoration(
            hintText: '••••••••',
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            prefixIcon: Icon(Icons.lock_outlined, size: 18, color: AppColors.textMuted),
            suffixIcon: IconButton(
              icon: Icon(_showPassword ? Icons.visibility_off : Icons.visibility, size: 18),
              onPressed: () => setState(() => _showPassword = !_showPassword),
            ),
            errorText: tooShort ? t('auth.passwordMinLength') : null,
          ),
        ),
      ]),
      const SizedBox(height: 20),
      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.confirmPassword'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
        const SizedBox(height: 6),
        TextField(
          controller: _confirmCtrl,
          obscureText: !_showConfirmPassword,
          maxLength: 128,
          onChanged: (_) => _refresh(),
          onEditingComplete: () => setState(() => _confirmTouched = true),
          decoration: InputDecoration(
            hintText: '••••••••',
            isDense: true,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            prefixIcon: Icon(Icons.lock_outlined, size: 18, color: AppColors.textMuted),
            suffixIcon: IconButton(
              icon: Icon(_showConfirmPassword ? Icons.visibility_off : Icons.visibility, size: 18),
              onPressed: () => setState(() => _showConfirmPassword = !_showConfirmPassword),
            ),
            errorText: mismatch ? t('auth.passwordMismatch') : null,
          ),
        ),
      ]),
    ]);
  }

  // Step 3: review card + verification notice (website StepTwoReview).
  Widget _stepThreeReview() {
    String display(TextEditingController c) =>
        c.text.trim().isEmpty ? t('auth.fromForm') : c.text.trim();
    Widget row(String label, String value) => Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: RichText(
        text: TextSpan(
          style: TextStyle(fontSize: 14, color: AppColors.text),
          children: [
            TextSpan(text: '$label: ', style: const TextStyle(fontWeight: FontWeight.w600)),
            TextSpan(text: value, style: TextStyle(color: AppColors.textMuted)),
          ],
        ),
      ),
    );
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(12),
        color: AppColors.gray100,
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(t('auth.reviewInfo'),
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600, color: AppColors.cyan)),
        const SizedBox(height: 16),
        row(t('auth.firstName'), display(_firstCtrl)),
        row(t('auth.lastName'), display(_lastCtrl)),
        row(t('auth.email'), display(_emailCtrl)),
        row(t('auth.phoneNumber'), display(_phoneCtrl)),
        Text(t('auth.verificationNotice'),
            style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
      ]),
    );
  }

  Widget _field({
    required String label,
    required String hint,
    required IconData icon,
    required TextEditingController controller,
    TextInputType? keyboardType,
    int? maxLength,
  }) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.text)),
      const SizedBox(height: 6),
      TextField(
        controller: controller,
        keyboardType: keyboardType,
        maxLength: maxLength,
        onChanged: (_) => _refresh(),
        decoration: InputDecoration(
          hintText: hint,
          isDense: true,
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          prefixIcon: Icon(icon, size: 18, color: AppColors.textMuted),
          counterText: '',
        ),
      ),
    ]);
  }

  // Terms checkbox, shown on step 3 only (website TermsCheckbox).
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

class _RegisterSuccessDialog extends StatelessWidget {
  final VoidCallback onPrimary;
  const _RegisterSuccessDialog({required this.onPrimary});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.surface,
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(color: AppColors.border),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 380),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 28, 24, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: AppColors.safe.withValues(alpha: 0.12),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.safe.withValues(alpha: 0.2)),
                ),
                child: Icon(Icons.check, size: 28, color: AppColors.safe),
              ),
              const SizedBox(height: 16),
              Text(
                t('auth.registrationSuccess'),
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w700, color: AppColors.text, height: 1.3),
              ),
              const SizedBox(height: 8),
              Text(
                t('auth.verificationNotice'),
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13, color: AppColors.textMuted, height: 1.5),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: GradientButton(label: t('auth.signIn'), onTap: onPrimary),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
