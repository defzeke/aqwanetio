import type { ReadingsService } from "./readings.service";
import { mockReadingsService } from "./readings.mock";

export type { Reading, ReadingsService } from "./readings.service";

export const readingsService: ReadingsService = mockReadingsService;
