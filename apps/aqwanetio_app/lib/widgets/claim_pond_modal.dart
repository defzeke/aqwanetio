import 'package:flutter/material.dart';
import '../models.dart';
import '../theme.dart';
import '../translations.dart';
import '../main.dart';
import '../services/owners_api.dart';
import 'gradient_button.dart';

// port of website features/ponds/components/ClaimPondModal.tsx — 5 fields, drive guide, Bearer POST /owners/claims
class ClaimPondModal extends StatefulWidget {
  final Pond pond;
  const ClaimPondModal({super.key, required this.pond});

  @override
  State<ClaimPondModal> createState() => _ClaimPondModalState();
}

class _ClaimPondModalState extends State<ClaimPondModal> {
  final _firstCtrl = TextEditingController();
  final _lastCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _docCtrl = TextEditingController();

  bool _touched = false;
  bool _submitting = false;
  bool _submitted = false;
  String? _submitError;

  @override
  void initState() {
    super.initState();
    _prefill();
  }

  @override
  void dispose() {
    _firstCtrl.dispose();
    _lastCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _docCtrl.dispose();
    super.dispose();
  }

  Future<void> _prefill() async {
    final u = authProvider.user;
    if (u != null) {
      final parts = u.name.trim().split(RegExp(r'\s+'));
      if (parts.isNotEmpty) _firstCtrl.text = parts.first;
      if (parts.length > 1) _lastCtrl.text = parts.sublist(1).join(' ');
      _emailCtrl.text = u.email;
      if (u.phone != null && u.phone!.isNotEmpty) {
        _phoneCtrl.text = u.phone!;
      } else {
        try {
          final data = await authProvider.fetchProfile();
          final p = data?['profile'] as Map<String, dynamic>?;
          if (p != null && (p['phone'] as String?)?.isNotEmpty == true) {
            if (mounted) setState(() => _phoneCtrl.text = p['phone'] as String);
          }
        } catch (_) {}
      }
    }
  }

  static bool _isValidPhPhone(String raw) {
    final digits = raw.replaceAll(RegExp(r'[\s\-.]'), '');
    return RegExp(r'^(\+639\d{9}|09\d{9})$').hasMatch(digits);
  }

  String get _firstTrim => _firstCtrl.text.trim();
  String get _lastTrim => _lastCtrl.text.trim();
  String get _emailTrim => _emailCtrl.text.trim();
  String get _phoneTrim => _phoneCtrl.text.trim();
  String get _docTrim => _docCtrl.text.trim();

  bool get _emailValid => RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(_emailTrim);

  bool get _docValid {
    if (_docTrim.isEmpty) return false;
    try {
      final uri = Uri.parse(_docTrim);
      return uri.host.contains('drive.google.com');
    } catch (_) {
      return false;
    }
  }

  bool get _isValid =>
      _firstTrim.isNotEmpty &&
      _firstTrim.length <= 50 &&
      _lastTrim.isNotEmpty &&
      _lastTrim.length <= 50 &&
      _emailValid &&
      _phoneTrim.isNotEmpty &&
      _isValidPhPhone(_phoneTrim) &&
      _docValid;

  Future<void> _submit() async {
    setState(() => _touched = true);
    if (!_isValid || _submitting) return;
    final token = authProvider.idToken;
    if (token == null || token.isEmpty) {
      setState(() => _submitError = 'Login required to submit a claim.');
      return;
    }
    setState(() {
      _submitting = true;
      _submitError = null;
    });
    try {
      await OwnersApi().submitClaim(
        token,
        firstName: _firstTrim,
        lastName: _lastTrim,
        email: _emailTrim,
        phone: _phoneTrim,
        documentUrl: _docTrim,
        stationId: widget.pond.stationId,
      );
      if (!mounted) return;
      setState(() => _submitted = true);
      await pondsProvider.refresh();
      await Future.delayed(const Duration(milliseconds: 1200));
      if (mounted) Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      setState(() => _submitError = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: BorderSide(color: AppColors.border)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 480, maxHeight: 700),
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 16),
          child: _submitted
              ? Column(mainAxisSize: MainAxisSize.min, children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(color: AppColors.safe.withValues(alpha: 0.12), shape: BoxShape.circle),
                    child: Icon(Icons.check, size: 28, color: AppColors.safe),
                  ),
                  const SizedBox(height: 16),
                  Text(t('claim.submitted'), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.text), textAlign: TextAlign.center),
                ])
              : Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
                  Row(children: [
                    Expanded(child: Text(t('mapPopup.claimPond'), style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.text))),
                    IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.of(context).pop()),
                  ]),
                  Text(t('mapPopup.claimPondDesc', {'location': widget.pond.name}), style: TextStyle(fontSize: 12, color: AppColors.textMuted)),
                  const SizedBox(height: 4),
                  Text('${widget.pond.name} • NH₃ ${widget.pond.ammoniaLevel.toStringAsFixed(2)} ppm', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                  const SizedBox(height: 16),
                  _field(label: t('auth.firstName'), hint: t('auth.firstNamePlaceholder'), controller: _firstCtrl),
                  const SizedBox(height: 12),
                  _field(label: t('auth.lastName'), hint: t('auth.lastNamePlaceholder'), controller: _lastCtrl),
                  const SizedBox(height: 12),
                  _field(label: t('auth.email'), hint: t('auth.emailPlaceholder'), controller: _emailCtrl, type: TextInputType.emailAddress),
                  const SizedBox(height: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(t('auth.phoneNumber'), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.text)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _phoneCtrl,
                      keyboardType: TextInputType.phone,
                      onChanged: (_) => setState(() {}),
                      decoration: InputDecoration(
                        hintText: t('auth.phonePlaceholder'),
                        errorText: _touched && _phoneTrim.isNotEmpty && !_isValidPhPhone(_phoneTrim) ? t('auth.phoneInvalid') : (_touched && _phoneTrim.isEmpty ? t('auth.phoneRequired') : null),
                      ),
                    ),
                  ]),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: AppColors.gray100, borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border)),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(t('claim.driveGuideTitle'), style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.text)),
                      const SizedBox(height: 6),
                      Text('1. ${t('claim.driveGuideStep1')}', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      Text('2. ${t('claim.driveGuideStep2')}', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      Text('3. ${t('claim.driveGuideStep3')}', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      Text('4. ${t('claim.driveGuideStep4')}', style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
                    ]),
                  ),
                  const SizedBox(height: 12),
                  Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Text(t('claim.documentUrl'), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.text)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _docCtrl,
                      keyboardType: TextInputType.url,
                      onChanged: (_) => setState(() {}),
                      decoration: InputDecoration(
                        hintText: 'https://drive.google.com/file/d/...',
                        errorText: _touched && _docTrim.isNotEmpty && !_docValid ? t('claim.docInvalid') : null,
                      ),
                    ),
                  ]),
                  if (_submitError != null) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(color: AppColors.alert.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                      child: Text(_submitError!, style: TextStyle(fontSize: 13, color: AppColors.alert)),
                    ),
                  ],
                  const SizedBox(height: 16),
                  Row(children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: _submitting ? null : () => Navigator.of(context).pop(),
                        child: Text(t('claim.cancel')),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GradientButton(
                        label: _submitting ? '...' : t('claim.submit'),
                        onTap: _isValid && !_submitting ? _submit : null,
                      ),
                    ),
                  ]),
                ]),
        ),
      ),
    );
  }

  Widget _field({required String label, required String hint, required TextEditingController controller, TextInputType? type}) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.text)),
      const SizedBox(height: 6),
      TextField(
        controller: controller,
        keyboardType: type,
        maxLength: 50,
        onChanged: (_) => setState(() {}),
        decoration: InputDecoration(hintText: hint, counterText: ''),
      ),
    ]);
  }
}
