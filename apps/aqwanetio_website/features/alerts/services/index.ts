import type { AlertsService } from "./alerts.service";
import { mockAlertsService } from "./alerts.mock";

export type { Alert, AlertSeverity, AlertsService } from "./alerts.service";

export const alertsService: AlertsService = mockAlertsService;
