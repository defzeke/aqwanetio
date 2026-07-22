export interface Reading {
  timestamp: string;
  ammonia: number;
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
}

export interface ReadingsService {
  getLatestByPond(pondId: string): Reading | null;
  getByPond(pondId: string, limit?: number): Reading[];
}
