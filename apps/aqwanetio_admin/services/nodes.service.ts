import type { PondNode, KpiData, Alert, NetworkHealth, SensorHardware, MaintenanceEntry, ConsumableItem } from "@/types/admin";

export interface NodesService {
  getAll(): PondNode[];
  getById(id: string): PondNode | undefined;
  getKpis(): KpiData[];
  getAlerts(): Alert[];
  getNetworkHealth(): NetworkHealth;
  getSensors(): SensorHardware[];
  getMaintenanceLogs(): MaintenanceEntry[];
  getConsumables(): ConsumableItem[];
}
