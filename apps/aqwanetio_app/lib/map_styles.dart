enum MapStyleId { colored, minimal, satellite }

typedef MapStyleDef = ({String urlTemplate, String? urlTemplateDark, String attribution});

const _osmAttribution = '© OpenStreetMap contributors';
const _esriLightAttribution = '© OpenStreetMap contributors © Esri — Light Gray';
const _esriSatAttribution = 'Powered by Esri';

const kMapStyles = <MapStyleId, MapStyleDef>{
  MapStyleId.colored: (
    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    urlTemplateDark:
        'https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: _osmAttribution,
  ),
  MapStyleId.minimal: (
    urlTemplate:
        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    urlTemplateDark:
        'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: _esriLightAttribution,
  ),
  MapStyleId.satellite: (
    urlTemplate:
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    urlTemplateDark: null,
    attribution: _esriSatAttribution,
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
