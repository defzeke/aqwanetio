export type MetricId = "210" | "218" | "176" | "177" | "209" | "217" | "170" | "173";

export interface Reading {
  timestamp: string;
  ammonia: number;
  // core metrics
  param210: number; // Ammonium mg/L
  param218: number; // Ammonium alt mg/L
  param176: number; // Dissolved Oxygen mg/L
  param177: number; // DO Saturation %
  param209: number; // pH Value pH
  param217: number; // pH mV
  param170: number; // Water Temperature °C
  param173: number; // Water Salinity PSU
}

export interface ReadingsService {
  getLatestByPond(pondId: string): Reading | null;
  getByPond(pondId: string, limit?: number): Reading[];
  getByPondAt(pondId: string, endTs: number, limit?: number): Reading[];
}
