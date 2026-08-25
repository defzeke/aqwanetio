import 'package:flutter/material.dart';
import 'dart:ui';
import '../translations.dart';
import '../theme.dart';
import '../models.dart';
import '../main.dart';
import '../widgets/pond_card.dart';
import '../widgets/menu_sheet.dart';
import '../widgets/pond_search.dart';
import 'map_screen.dart';
import 'pond_detail_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _tab = 0;
  final _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    authProvider.addListener(_onAuthChange);
  }

  @override
  void dispose() {
    authProvider.removeListener(_onAuthChange);
    _searchCtrl.dispose();
    super.dispose();
  }

  void _onAuthChange() => setState(() {});

  void _openPondDetail(Pond pond) {
    Navigator.of(context).push(MaterialPageRoute(builder: (_) => PondDetailScreen(pond: pond)));
  }

  void _onSearchSelect(Pond pond) {
    setState(() => _tab = 0);
    pondFocus.focus(pond.id);
    _openPondDetail(pond);
  }

  void _openMenu() {
    showModalBottomSheet(context: context, builder: (_) => const MenuSheet(), shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(16))));
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: settingsProvider,
      builder: (context, _) => Scaffold(
      extendBody: true,
      body: Stack(
        children: [
          IndexedStack(index: _tab, children: [
            _buildMapTab(context),
            _buildPondsTab(),
          ]),
          Positioned(top: 0, left: 0, right: 0, child: _buildFloatingHeader(context)),
        ],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(26),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: NavigationBar(
              selectedIndex: _tab,
              onDestinationSelected: (i) => setState(() => _tab = i),
              destinations: [
                NavigationDestination(icon: Icon(Icons.map_outlined), selectedIcon: Icon(Icons.map), label: t('nav.map')),
                NavigationDestination(icon: Icon(Icons.pool_outlined), selectedIcon: Icon(Icons.pool), label: t('nav.ponds')),
              ],
            ),
          ),
        ),
      ),
      ),
    );
  }

  // Height of the floating header zone (pill + margins). Map/List overlays
  // offset their content by topInset + this.
  static const _headerZone = 76.0;

  Widget _buildFloatingHeader(BuildContext context) {
    final u = authProvider.user;
    return SafeArea(
      bottom: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
        child: Material(
          elevation: 0,
          borderRadius: BorderRadius.circular(28),
          clipBehavior: Clip.antiAlias,
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
            child: Container(
              height: 54,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: AppColors.surface.withValues(alpha: 0.95),
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.border),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: AppColors.isDark ? 0.4 : 0.08), blurRadius: 12, offset: const Offset(0, 4))],
              ),
              child: LayoutBuilder(builder: (context, pill) {
                // ponytail: chip hides under ~460px pill width; bump when search grows
                final showChip = u != null && pill.maxWidth >= 460;
                return Row(children: [
                  Image.asset('assets/images/dostasti-logo.png', width: 34, height: 34),
                  const SizedBox(width: 8),
                  Image.asset('assets/images/dost-logo.png', width: 34, height: 34),
                  const SizedBox(width: 10),
                  Flexible(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(minWidth: 120, maxWidth: 200),
                      child: PondSearch(onSelected: _onSearchSelect),
                    ),
                  ),
                  const Spacer(),
                  if (showChip)
                    Container(
                      margin: const EdgeInsets.only(right: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(color: AppColors.gray100, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.border)),
                      child: Text(u.name, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.text)),
                    ),
                  IconButton(
                    icon: Icon(AppColors.isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 20, color: AppColors.textMuted),
                    tooltip: t('settings.darkMode'),
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.gray100,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    padding: const EdgeInsets.all(6),
                    constraints: const BoxConstraints(minWidth: 34, minHeight: 34),
                    onPressed: settingsProvider.toggleTheme,
                  ),
                  IconButton(
                    icon: Icon(Icons.menu, size: 22, color: AppColors.textMuted),
                    style: IconButton.styleFrom(
                      backgroundColor: AppColors.gray100,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    padding: const EdgeInsets.all(6),
                    constraints: const BoxConstraints(minWidth: 34, minHeight: 34),
                    onPressed: _openMenu,
                  ),
                ]);
              }),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMapTab(BuildContext context) {
    return MapScreen(onPondTap: _openPondDetail);
  }

  Widget _buildPondsTab() {
    final ponds = mockPonds.where((p) => p.name.toLowerCase().contains(_searchQuery)).toList();
    final topInset = MediaQuery.paddingOf(context).top;
    return Column(
      children: [
        Padding(
          padding: EdgeInsets.fromLTRB(16, topInset + _headerZone - 4, 16, 0),
          child: Container(
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.border),
            ),
            child: TextField(
              controller: _searchCtrl,
              onChanged: (v) => setState(() => _searchQuery = v.trim().toLowerCase()),
              decoration: InputDecoration(
                hintText: t('search.hint') == 'search.hint'
                    ? 'Maghanap ng sapa o lokasyon...' // ponytail: t() key-miss fallback
                    : t('search.hint'),
                prefixIcon: Icon(Icons.search, size: 20, color: AppColors.textMuted),
                suffixIcon: _searchQuery.isEmpty
                    ? null
                    : IconButton(
                        icon: Icon(Icons.close, size: 18, color: AppColors.textMuted),
                        onPressed: () {
                          _searchCtrl.clear();
                          setState(() => _searchQuery = '');
                        },
                      ),
                border: InputBorder.none,
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              ),
            ),
          ),
        ),
        Expanded(
          child: ponds.isEmpty
              ? Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    Icon(Icons.search_off, size: 40, color: AppColors.gray300),
                    const SizedBox(height: 8),
                    Text(t('search.empty'), style: TextStyle(fontSize: 14, color: AppColors.textMuted)),
                  ]),
                )
              : ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 12, 16, 110),
                  itemCount: ponds.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 8),
                  itemBuilder: (_, i) => PondCard(pond: ponds[i], onTap: () => _openPondDetail(ponds[i])),
                ),
        ),
      ],
    );
  }
}
