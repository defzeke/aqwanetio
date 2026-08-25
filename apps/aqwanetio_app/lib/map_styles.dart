enum MapStyleId { colored, minimal, satellite }

typedef MapStyleDef = ({String urlTemplate, String? urlTemplateDark, String attribution});

const _cartoAttribution = '© OpenStreetMap contributors © CARTO';

const kMapStyles = <MapStyleId, MapStyleDef>{
  MapStyleId.colored: (
    urlTemplate: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
    urlTemplateDark: 'https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
    attribution: _cartoAttribution,
  ),
  MapStyleId.minimal: (
    urlTemplate: 'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
    urlTemplateDark: null,
    attribution: _cartoAttribution,
  ),
  MapStyleId.satellite: (
    urlTemplate: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    urlTemplateDark: null,
    attribution: 'Powered by Esri',
  ),
};

extension MapStyleIdX on MapStyleId {
  bool get isSatellite => this == MapStyleId.satellite;
}

String tileUrlFor(MapStyleId id, bool isDark) {
  final s = kMapStyles[id]!;
  return isDark ? (s.urlTemplateDark ?? s.urlTemplate) : s.urlTemplate;
}

const kMapStylePrefKey = 'aqw-map-style';
