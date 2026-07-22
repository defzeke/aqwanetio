import type { PondsService } from "./ponds.service";
import { mockPondsService } from "./ponds.mock";

export type { Pond, PondStatus, PondsService } from "./ponds.service";

export const pondsService: PondsService = mockPondsService;
