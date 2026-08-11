export interface Reading {
  timestamp: string;
  ammonia: number;
}

export interface ReadingsService {
  getLatestByPond(pondId: string): Reading | null;
  getByPond(pondId: string, limit?: number): Reading[];
  getByPondAt(pondId: string, endTs: number, limit?: number): Reading[];
}
