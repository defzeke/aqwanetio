# AqwaNetIO — DOST-ASTI

Real-time water quality monitoring and ammonia toxicity forecasting for Philippine aquaculture.

AqwaNetIO helps fish farmers, cooperatives, and BFAR field staff see what’s happening in their ponds before it becomes a kill. Ammonia (NH₃) from waste and decaying organics turns toxic quickly — especially when pH and temperature rise — causing gill damage, stunted growth, and mass mortality. The system combines live sensor streams with 6-hour ahead machine-learning forecasts (XGBoost/RNN) and STL decomposition (trend / seasonal / residual) so interventions happen hours early, not after the spike.

## How it works

Sensor readings flow into a national pond map with threshold-aware rendering — Safe below 0.4 ppm, Warning 0.4–1.0 ppm, Toxic above 1.0 ppm. Each pond exposes Live and 30-day Historical views: Trends Over Time (current value + forecast dashed line at 1.0 ppm critical), Station Comparison across the fleet, and a Pond Health Radar balancing pH, dissolved oxygen, temperature, salinity, and ammonium. Nine metrics are tracked — Ammonia, Ammonium (p210/p218), Dissolved Oxygen and Saturation (p176/p177), pH value and mV (p209/p217), Water Temperature (p170) and Salinity (p173).

Access is role-based and bilingual (EN/FIL). Guests see ammonia only; verified owners unlock full metrics, station comparison, and health index after claiming a pond with Google Drive proof reviewed by operations.

## Apps

**Website** — Public intelligence portal (Next.js, MapLibre, Recharts). National map with pond search and focus, pond detail modals, auth (register/login/profile), claim-pond workflow, and science docs on ammonia toxicity.

**Mobile** — Companion for farmers in the field (Flutter, flutter_map, fl_chart). Map and Ponds tabs, pond detail with the same forecast charts and metrics, pond search, offline-tolerant station fetch, and Firebase Auth session.

**Backend** — FastAPI service on Firebase Auth / Firestore and Neon Postgres. Serves stations and claims, verifies Bearer tokens, and proxies strict password verification via Identity Toolkit.

**Admin** — Operations console for DOST-ASTI (Next.js, MapLibre). KPI tiles, AquaSense node status and signal health, system alerts, network health trends, threshold management, and ownership-claim review (approve/reject with pond assignment).

Built as a Turborepo + pnpm monorepo. Branding, thresholds, and copy mirror DOST-ASTI’s design system.
