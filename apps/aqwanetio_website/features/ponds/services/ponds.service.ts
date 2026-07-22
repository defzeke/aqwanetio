export type PondStatus = "safe" | "warning" | "toxic";

export interface Pond {
  id: string;
  name: string;
  lat: number;
  lng: number;
  ammoniaLevel: number;
  status: PondStatus;
  ownerId?: string;
}

export interface PondsService {
  getAll(): Pond[];
  getById(id: string): Pond | undefined;
  getByOwner(ownerId: string): Pond[];
}
