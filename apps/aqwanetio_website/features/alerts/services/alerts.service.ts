export type AlertSeverity = "warning" | "toxic";

export interface Alert {
  id: string;
  pondId: string;
  severity: AlertSeverity;
  message: string;
  recommendation: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface AlertsService {
  getActive(): Alert[];
  acknowledge(id: string): void;
}
