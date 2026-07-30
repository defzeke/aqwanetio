import 'package:flutter/material.dart';
import '../translations.dart';
import '../theme.dart';
import '../models.dart';
import '../main.dart';
import '../widgets/pond_card.dart';
import '../widgets/settings_sheet.dart';
import 'map_screen.dart';
import 'pond_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;

  @override
  void initState() {
    super.initState();
    authProvider.addListener(_onAuthChange);
  }

  @override
  void dispose() {
    authProvider.removeListener(_onAuthChange);
    super.dispose();
  }

  void _onAuthChange() => setState(() {});

  void _openPondDetail(Pond pond) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => PondDetailScreen(pond: pond)));
  }

  void _openSettings() {
    showModalBottomSheet(context: context, builder: (_) => const SettingsSheet(), shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _tab, children: [
        _buildMapTab(context),
        _buildPondsTab(),
        _buildAlertsTab(),
      ]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        indicatorColor: AppColors.primary.withValues(alpha: 0.1),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map, color: AppColors.primary), label: 'Map'),
          NavigationDestination(icon: Icon(Icons.pool_outlined), selectedIcon: Icon(Icons.pool, color: AppColors.primary), label: 'Ponds'),
          NavigationDestination(icon: Icon(Icons.notifications_outlined), selectedIcon: Icon(Icons.notifications, color: AppColors.primary), label: 'Alerts'),
        ],
      ),
    );
  }

  Widget _buildAppBar(String title, {List<Widget>? actions}) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Row(children: [
        Container(
          width: 32, height: 32,
          decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(4)),
          alignment: Alignment.center,
          child: const Text('A', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.navy)),
            Text(t('header.subtitle'), style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
          ]),
        ),
        if (actions != null) ...actions,
        IconButton(
          icon: const Icon(Icons.settings_outlined, size: 20, color: AppColors.textMuted),
          onPressed: _openSettings,
        ),
      ]),
    );
  }

  Widget _buildMapTab(BuildContext context) {
    final u = authProvider.user;
    return SafeArea(
      child: Column(
        children: [
          _buildAppBar(t('header.brand'), actions: [
            if (u != null)
              Padding(
                padding: const EdgeInsets.only(right: 4),
                child: Text(u.name, style: const TextStyle(fontSize: 13, color: AppColors.textMuted)),
              )
            else ...[
              TextButton(onPressed: () => Navigator.of(context).pushNamed('/login'), style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap), child: Text(t('header.signIn'), style: const TextStyle(fontSize: 13, color: AppColors.navy))),
              const SizedBox(width: 8),
              FilledButton(onPressed: () => Navigator.of(context).pushNamed('/register'), style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap), child: Text(t('header.register'), style: const TextStyle(fontSize: 12))),
            ],
          ]),
          Expanded(child: MapScreen(onPondTap: _openPondDetail)),
        ],
      ),
    );
  }

  Widget _buildPondsTab() {
    final ponds = mockPonds;
    return SafeArea(
      child: Column(
        children: [
          _buildAppBar(t('header.brand')),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: ponds.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (_, i) => PondCard(pond: ponds[i], onTap: () => _openPondDetail(ponds[i])),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertsTab() {
    final activeAlerts = getActiveAlerts();
    return SafeArea(
      child: Column(
        children: [
          _buildAppBar('Alerts'),
          Expanded(
            child: activeAlerts.isEmpty
              ? const Center(child: Text('No active alerts', style: TextStyle(color: AppColors.textMuted)))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: activeAlerts.length,
                  itemBuilder: (_, i) {
                    final alert = activeAlerts[i];
                    final isToxic = alert.severity == AlertSeverity.toxic;
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8), side: BorderSide(color: isToxic ? AppColors.alert : AppColors.warning)),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Icon(isToxic ? Icons.dangerous : Icons.warning_amber, size: 18, color: isToxic ? AppColors.alert : AppColors.warning),
                            const SizedBox(width: 6),
                            Expanded(child: Text(alert.message, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500))),
                          ]),
                          const SizedBox(height: 4),
                          Text(alert.recommendation, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                          const SizedBox(height: 8),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () { acknowledgeAlert(alert.id); setState(() {}); },
                              child: const Text('Acknowledge', style: TextStyle(fontSize: 12)),
                            ),
                          ),
                        ]),
                      ),
                    );
                  },
                ),
          ),
        ],
      ),
    );
  }
}
