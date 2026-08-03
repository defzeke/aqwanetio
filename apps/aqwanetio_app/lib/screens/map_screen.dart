import 'package:flutter/material.dart';
import 'dart:async';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import '../models.dart';
import '../translations.dart';
import '../theme.dart';
import '../main.dart';

class _OSMTileProvider extends NetworkTileProvider {
  @override
  ImageProvider getImage(TileCoordinates coordinates, TileLayer options) {
    final url = getTileUrl(coordinates, options);
    return NetworkImage(url, headers: {
      'User-Agent': 'AqwaNetIO/1.0 (DOST-ASTI Aquaculture Intelligence Portal; +https://aqwanetio.asti.dost.gov.ph)',
    });
  }
}

class MapScreen extends StatefulWidget {
  final void Function(Pond pond) onPondTap;
  const MapScreen({super.key, required this.onPondTap});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  bool _showCards = true;

  Color _statusColor(PondStatus s) => switch (s) { PondStatus.safe => const Color(0xFF22c55e), PondStatus.warning => const Color(0xFFeab308), PondStatus.toxic => const Color(0xFFef4444) };

  @override
  Widget build(BuildContext context) {
    final ponds = mockPonds;
    return Stack(
      children: [
        FlutterMap(
          options: MapOptions(
            initialCenter: const LatLng(14.5, 121.5),
            initialZoom: 8,
            minZoom: 6,
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
              subdomains: const ['a', 'b', 'c'],
              maxZoom: 18,
              tileProvider: _OSMTileProvider(),
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
          ],
        ),
        Positioned(
          right: 12,
          top: 12,
          child: Material(
            color: Colors.white,
            shape: const CircleBorder(),
            elevation: 2,
            child: InkWell(
              customBorder: const CircleBorder(),
              onTap: () => setState(() => _showCards = !_showCards),
              child: Padding(
                padding: const EdgeInsets.all(8),
                child: Icon(
                  _showCards ? Icons.layers_outlined : Icons.layers_clear,
                  size: 20,
                  color: AppColors.textMuted,
                ),
              ),
            ),
          ),
        ),
        Positioned(
          left: 12,
          top: 12,
          child: IgnorePointer(
            ignoring: !_showCards,
            child: AnimatedSlide(
              offset: _showCards ? Offset.zero : const Offset(-1.5, 0),
              duration: const Duration(milliseconds: 250),
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

  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () {
      if (!mounted) return;
      Timer.periodic(const Duration(seconds: 1), (_) => setState(() => _time = DateTime.now()));
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.9), borderRadius: BorderRadius.circular(8), border: Border.all(color: AppColors.border), boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 8)]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        Text(t('mapLegend.title'), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.navy)),
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
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('32°C', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text)),
            Text(t('weather.partlyCloudy'), style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted.withValues(alpha: 0.7))),
          ]),
          const Spacer(),
          Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Text('${_time.hour.toString().padLeft(2, '0')}:${_time.minute.toString().padLeft(2, '0')}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.text)),
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
      Expanded(child: Text(text, style: const TextStyle(fontSize: 12, color: AppColors.textMuted))),
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
          Text(t('ctaCard.title'), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Color(0xFF799dd6))),
        ]),
        const SizedBox(height: 8),
        Text(t('ctaCard.desc'), style: const TextStyle(fontSize: 11, color: Color(0xFF799dd6), height: 1.4)),
        const SizedBox(height: 12),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Navigator.of(context).pushNamed('/register'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white, foregroundColor: AppColors.navy,
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
