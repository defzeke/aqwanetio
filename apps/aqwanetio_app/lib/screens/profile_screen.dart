import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../widgets/gradient_button.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _firstCtrl = TextEditingController();
  final _lastCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();

  bool _loading = true;
  bool _saving = false;
  String? _error;
  String? _success;
  String _role = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _firstCtrl.dispose();
    _lastCtrl.dispose();
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final u = authProvider.user;
    if (u == null) {
      if (mounted) Navigator.of(context).pushReplacementNamed('/login');
      return;
    }
    // ponytail: try backend profile first, fallback to local user like web page.tsx:33-42
    if (authProvider.idToken != null && authProvider.idToken!.isNotEmpty) {
      try {
        final data = await authProvider.fetchProfile();
        final p = data?['profile'] as Map<String, dynamic>?;
        if (p != null) {
          _firstCtrl.text = (p['firstName'] as String?) ?? u.name.split(' ').first;
          _lastCtrl.text = (p['lastName'] as String?) ?? u.name.split(' ').skip(1).join(' ');
          _emailCtrl.text = (p['email'] as String?) ?? u.email;
          _phoneCtrl.text = (p['phone'] as String?) ?? (u.phone ?? '');
          _role = (p['role'] as String?) ?? u.role.name;
        } else {
          _fillFromUser(u);
        }
      } catch (e) {
        _error = e.toString().replaceFirst('Exception: ', '');
        _fillFromUser(u);
      }
    } else {
      _fillFromUser(u);
    }
    if (mounted) setState(() => _loading = false);
  }

  void _fillFromUser(dynamic u) {
    _firstCtrl.text = u.name.split(' ').first;
    _lastCtrl.text = u.name.split(' ').skip(1).join(' ');
    _emailCtrl.text = u.email;
    _phoneCtrl.text = u.phone ?? '';
    _role = u.role.name;
  }

  bool get _isValid {
    final f = _firstCtrl.text.trim();
    final l = _lastCtrl.text.trim();
    return f.isNotEmpty && f.length <= 50 && l.isNotEmpty && l.length <= 50;
  }

  Future<void> _save() async {
    if (!_isValid || _saving) return;
    setState(() {
      _saving = true;
      _error = null;
      _success = null;
    });
    try {
      await authProvider.updateProfile(
        firstName: _firstCtrl.text.trim(),
        lastName: _lastCtrl.text.trim(),
        phone: _phoneCtrl.text.trim(),
      );
      if (!mounted) return;
      setState(() => _success = t('auth.saved'));
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
      if (_error == null || _error!.isEmpty) setState(() => _error = t('auth.saveFailed'));
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        appBar: AppBar(title: Text(t('auth.profileTitle'))),
        body: Center(child: CircularProgressIndicator(color: AppColors.cyan)),
      );
    }
    final u = authProvider.user;
    if (u == null) return const SizedBox.shrink();

    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
        appBar: AppBar(
          title: Text(t('auth.profileTitle'), style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
          backgroundColor: AppColors.surface,
          leading: IconButton(icon: const Icon(Icons.arrow_back), onPressed: () => Navigator.of(context).pop()),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 560),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(t('auth.profileSubtitle'), style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.border),
                      boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: AppColors.isDark ? 0.35 : 0.06), blurRadius: 20, offset: const Offset(0, 8))],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // header like web page.tsx:120-129
                        Row(
                          children: [
                            Container(
                              width: 64,
                              height: 64,
                              decoration: BoxDecoration(color: AppColors.cyan.withValues(alpha: 0.15), shape: BoxShape.circle),
                              child: Icon(Icons.person, size: 36, color: AppColors.cyan),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('${_firstCtrl.text} ${_lastCtrl.text}'.trim().isEmpty ? u.name : '${_firstCtrl.text} ${_lastCtrl.text}'.trim(),
                                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.text)),
                                  const SizedBox(height: 2),
                                  Text(_emailCtrl.text.isEmpty ? u.email : _emailCtrl.text,
                                      style: TextStyle(fontSize: 13, color: AppColors.textMuted)),
                                  const SizedBox(height: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                    decoration: BoxDecoration(color: AppColors.gray100, borderRadius: BorderRadius.circular(12)),
                                    child: Text(_role.isEmpty ? u.role.name : _role,
                                        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Text(t('auth.personalInfo'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.text)),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(child: _field(label: t('auth.firstName'), controller: _firstCtrl, onChanged: (_) => setState(() {}))),
                            const SizedBox(width: 12),
                            Expanded(child: _field(label: t('auth.lastName'), controller: _lastCtrl, onChanged: (_) => setState(() {}))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _readOnlyField(label: t('auth.email'), controller: _emailCtrl, note: t('auth.emailCannotChange')),
                        const SizedBox(height: 12),
                        _readOnlyField(label: t('auth.phoneNumber'), controller: _phoneCtrl, note: t('auth.phoneCannotChange')),
                        if (_error != null) ...[
                          const SizedBox(height: 12),
                          _banner(_error!, AppColors.alert),
                        ],
                        if (_success != null) ...[
                          const SizedBox(height: 12),
                          _banner(_success!, AppColors.safe),
                        ],
                        const SizedBox(height: 16),
                        GradientButton(
                          label: _saving ? t('auth.saving') : t('auth.save'),
                          onTap: (_isValid && !_saving) ? _save : null,
                        ),
                        const SizedBox(height: 20),
                        Divider(color: AppColors.border, height: 1),
                        const SizedBox(height: 16),
                        Text(t('auth.preferences'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.text)),
                        const SizedBox(height: 12),
                        _prefRow(
                          icon: Icons.dark_mode_outlined,
                          label: t('settings.darkMode'),
                          control: Switch.adaptive(value: settingsProvider.isDark, onChanged: (_) => settingsProvider.toggleTheme(), activeTrackColor: const Color(0xFF00aeef)),
                        ),
                        const SizedBox(height: 12),
                        _prefRow(
                          icon: Icons.language,
                          label: t('settings.language'),
                          control: GestureDetector(
                            onTap: settingsProvider.toggleLanguage,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(border: Border.all(color: AppColors.border), borderRadius: BorderRadius.circular(6)),
                              child: Text(settingsProvider.language == Language.en ? 'EN' : 'FIL',
                                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        _prefRow(
                          icon: Icons.notifications_outlined,
                          label: t('settings.notifications'),
                          control: Switch.adaptive(value: settingsProvider.notifications, onChanged: (_) => settingsProvider.toggleNotifications(), activeTrackColor: AppColors.primary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _field({required String label, required TextEditingController controller, ValueChanged<String>? onChanged}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.text)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          maxLength: 50,
          onChanged: onChanged,
          decoration: InputDecoration(counterText: '', isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
        ),
      ],
    );
  }

  Widget _readOnlyField({required String label, required TextEditingController controller, required String note}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.text)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          enabled: false,
          decoration: InputDecoration(isDense: true, contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
        ),
        const SizedBox(height: 4),
        Text(note, style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
      ],
    );
  }

  Widget _prefRow({required IconData icon, required String label, required Widget control}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(children: [Icon(icon, size: 18, color: AppColors.textMuted), const SizedBox(width: 8), Text(label, style: TextStyle(fontSize: 14, color: AppColors.text))]),
        control,
      ],
    );
  }

  Widget _banner(String msg, Color color) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(msg, style: TextStyle(fontSize: 13, color: color)),
    );
  }
}
