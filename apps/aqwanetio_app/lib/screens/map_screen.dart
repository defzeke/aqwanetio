import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../models.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';
import '../map_styles.dart';

class MapScreen extends StatefulWidget {
  final void Function(Pond pond) onPondTap;
  const MapScreen({super.key, required this.onPondTap});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  bool _showCards = true;
  DateTime _now = DateTime.now();
  Timer? _nightTimer;
  final MapController _mapController = MapController();

  // Floating header zone height (pill + margins) from home_screen.dart.
  static const _headerZone = 76.0;

  // Same label position as the website's wps-label GeoJSON source.
  static const _wpsLabelPos = LatLng(17.0, 115.6);

  Color _statusColor(PondStatus s) => switch (s) { PondStatus.safe => const Color(0xFF22c55e), PondStatus.warning => const Color(0xFFeab308), PondStatus.toxic => const Color(0xFFef4444) };

  @override
  void initState() {
    super.initState();
    // ponytail: 60s refresh is plenty for a sun-position dimmer
    _nightTimer = Timer.periodic(const Duration(minutes: 1), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
    pondFocus.addListener(_onFocusRequest);
  }

  @override
  void dispose() {
    pondFocus.removeListener(_onFocusRequest);
    _nightTimer?.cancel();
    super.dispose();
  }

  void _onFocusRequest() {
    final id = pondFocus.consume();
    if (id == null || !mounted) return;
    final matches = mockPonds.where((p) => p.id == id).toList();
    if (matches.isEmpty) return;
    final pond = matches.first;
    _mapController.move(LatLng(pond.lat, pond.lng), 13);
  }

  double _nightOpacity() => max(0, 0.5 * cos(((_now.hour + _now.minute / 60 - 2) * pi) / 12));

  Widget _glassButton(Widget child) {
    return Material(
      color: Colors.transparent,
      shape: const CircleBorder(),
      clipBehavior: Clip.antiAlias,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          curve: Curves.easeInOut,
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: AppColors.surface.withValues(alpha: 0.9),
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.border),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: AppColors.isDark ? 0.45 : 0.12), blurRadius: 8, offset: const Offset(0, 2))],
          ),
          child: child,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ponds = mockPonds;
    final topInset = MediaQuery.paddingOf(context).top;
    final styleId = settingsProvider.mapStyle;
    final isDark = AppColors.isDark;
    final style = kMapStyles[styleId]!;
    // pick dark-aware attribution
    final attribution = style.attribution;
    return Stack(
      children: [
        FlutterMap(
          mapController: _mapController,
          options: MapOptions(
            initialCenter: const LatLng(14.5, 121.5),
            initialZoom: 8,
            minZoom: 6,
            cameraConstraint: CameraConstraint.containCenter(
              bounds: LatLngBounds(LatLng(4.5, 116.5), LatLng(21.2, 127.0)),
            ),
          ),
          children: [
            TileLayer(
              urlTemplate: kMapStyles[styleId]!.urlTemplate,
              maxZoom: 18,
              userAgentPackageName: 'ph.dost.asti.aqwanetio',
            ),
            if (kMapStyles[styleId]!.urlTemplateDark != null)
              AnimatedOpacity(
                duration: const Duration(milliseconds: 150),
                curve: Curves.easeInOut,
                opacity: isDark ? 1 : 0,
                child: TileLayer(
                  urlTemplate: kMapStyles[styleId]!.urlTemplateDark!,
                  maxZoom: 18,
                  userAgentPackageName: 'ph.dost.asti.aqwanetio',
                ),
              ),
            MarkerLayer(
              markers: ponds.map((pond) {
                return Marker(
                  point: LatLng(pond.lat, pond.lng),
                  width: 28,
                  height: 28,
                  child: GestureDetector(
                    onTap: () => widget.onPondTap(pond),
                    child: Container(
                      decoration: BoxDecoration(
                        color: _statusColor(pond.status),
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.2), blurRadius: 4, offset: const Offset(0, 2))],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            if (!styleId.isSatellite)
              MarkerLayer(
                markers: [
                  Marker(
                    point: _wpsLabelPos,
                    width: 180,
                    height: 16,
                    child: IgnorePointer(
                      child: Center(
                        child: Text(
                          'WEST PHILIPPINE SEA',
                          textAlign: TextAlign.center,
                          overflow: TextOverflow.clip,
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, letterSpacing: 2, color: AppColors.textMuted.withValues(alpha: 0.55)),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
        // Night dimming overlay, same curve as the website's getNightOverlayOpacity().
        Positioned.fill(
          child: IgnorePointer(
            child: ColoredBox(color: Colors.black.withValues(alpha: _nightOpacity())),
          ),
        ),
        Positioned(
          right: 12,
          top: topInset + _headerZone,
          child: _glassButton(
            InkWell(
              customBorder: const CircleBorder(),
              onTap: () => setState(() => _showCards = !_showCards),
              child: Icon(
                _showCards ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                size: 20,
                color: AppColors.textMuted,
              ),
            ),
          ),
        ),
        Positioned(
          right: 12,
          top: topInset + _headerZone + 54,
          child: _glassButton(
            PopupMenuButton<MapStyleId>(
              tooltip: t('mapStyles.label'),
              position: PopupMenuPosition.under,
              padding: EdgeInsets.zero,
              icon: Icon(Icons.layers_outlined, size: 20, color: AppColors.textMuted),
              onSelected: settingsProvider.setMapStyle,
              itemBuilder: (_) => [
                for (final id in MapStyleId.values)
                  CheckedPopupMenuItem(
                    value: id,
                    checked: settingsProvider.mapStyle == id,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(t('mapStyles.${id.name}'), style: const TextStyle(fontSize: 13)),
                  ),
              ],
            ),
          ),
        ),
        Positioned(
          left: 12,
          bottom: 104,
          child: IgnorePointer(
            child: Text(
              attribution,
              style: AppColors.isDark
                  ? TextStyle(fontSize: 9, color: Colors.white.withValues(alpha: 0.45))
                  : TextStyle(fontSize: 9, color: Colors.black.withValues(alpha: 0.45)),
            ),
          ),
        ),
        Positioned(
          left: 12,
          top: topInset + _headerZone,
          child: IgnorePointer(
            ignoring: !_showCards,
            child: AnimatedSlide(
              offset: _showCards ? Offset.zero : const Offset(-1.5, 0),
              duration: const Duration(milliseconds: 150),
              curve: Curves.easeOutCubic,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _MapLegend(),
                  if (!authProvider.isLoggedIn) ...[
                    const SizedBox(height: 12),
                    _MapCtaCard(),
                  ],
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _MapLegend extends StatefulWidget {
  @override
  State<_MapLegend> createState() => _MapLegendState();
}

class _MapLegendState extends State<_MapLegend> {
  DateTime _time = DateTime.now();
  Timer? _clockTimer;

  @override
  void initState() {
    super.initState();
    _clockTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() => _time = DateTime.now());
    });
  }

  @override
  void dispose() {
    _clockTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      curve: Curves.easeInOut,
      width: 220,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: AppColors.surface.withValues(alpha: 0.95), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: AppColors.isDark ? 0.45 : 0.08), blurRadius: 8)]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        Text(t('mapLegend.title'), style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.navy)),
        const SizedBox(height: 8),
        _legendRow(const Color(0xFF15803d), '${t('mapLegend.safeLabel')} ${t('mapLegend.safeDesc')}'),
        const SizedBox(height: 4),
        _legendRow(const Color(0xFFd97706), '${t('mapLegend.warningLabel')} ${t('mapLegend.warningDesc')}'),
        const SizedBox(height: 4),
        _legendRow(const Color(0xFFdc2626), '${t('mapLegend.toxicLabel')} ${t('mapLegend.toxicDesc')}'),
        const Divider(height: 16),
        Row(children: [
          const Icon(Icons.cloud, size: 20, color: Colors.blue),
          const SizedBox(width: 4),
          Flexible(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('32°C', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text)),
              Text(t('weather.partlyCloudy'), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted.withValues(alpha: 0.7))),
            ]),
          ),
          const Spacer(),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text('${_time.hour.toString().padLeft(2, '0')}:${_time.minute.toString().padLeft(2, '0')}', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text)),
            Text('${_time.month}/${_time.day}/${_time.year}', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted.withValues(alpha: 0.7))),
          ]),
        ]),
      ]),
    );
  }

  Widget _legendRow(Color color, String text) {
    return Row(children: [
      Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
      const SizedBox(width: 6),
      Expanded(child: Text(text, style: TextStyle(fontSize: 12, color: AppColors.textMuted))),
    ]);
  }
}

class _MapCtaCard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      width: 260,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(8), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 8)]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        Row(children: [
          const Icon(Icons.lock_outline, size: 14, color: Color(0xFF799dd6)),
          const SizedBox(width: 6),
          Expanded(child: Text(t('ctaCard.title'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF799dd6)), overflow: TextOverflow.ellipsis)),
        ]),
        const SizedBox(height: 8),
        Text(t('ctaCard.desc'), style: const TextStyle(fontSize: 11, color: Color(0xFF799dd6), height: 1.4)),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Navigator.of(context).pushNamed('/register'),
            style: ElevatedButton.styleFrom(
              // ponytail: white button in both modes, so text stays literal light-navy
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF001e40),
              padding: const EdgeInsets.symmetric(vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
            ),
            child: Text(t('ctaCard.button'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold)),
          ),
        ),
      ]),
    );
  }
}
