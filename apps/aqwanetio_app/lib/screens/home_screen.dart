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
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      body: IndexedStack(index: _tab, children: [
        _buildMapTab(context),
        _buildPondsTab(),
      ]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        indicatorColor: AppColors.primary.withValues(alpha: 0.1),
        destinations: [
          NavigationDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map, color: AppColors.primary), label: t('nav.map')),
          NavigationDestination(icon: Icon(Icons.pool_outlined), selectedIcon: Icon(Icons.pool, color: AppColors.primary), label: t('nav.ponds')),
        ],
      ),
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
        Image.asset('assets/images/dostasti-logo.png', width: 32, height: 32),
        const SizedBox(width: 8),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisAlignment: MainAxisAlignment.center, children: [
            Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.navy)),
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
}
