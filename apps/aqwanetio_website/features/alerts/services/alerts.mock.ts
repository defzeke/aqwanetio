import type { Alert, AlertsService } from "./alerts.service";

let mockAlerts: Alert[] = [
  {
    id: "alert-1",
    pondId: "pond-3",
    severity: "toxic",
    message: "Ammonia level at Pampanga River Aqua is 1.2 ppm — above toxic threshold.",
    recommendation: "Initiate immediate water exchange and increase aeration.",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-2",
    pondId: "pond-8",
    severity: "toxic",
    message: "Ammonia level at Rizal Highland Aqua is 1.5 ppm — critically toxic.",
    recommendation: "Emergency: Stop feeding, initiate full water exchange, check aeration systems.",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-3",
    pondId: "pond-2",
    severity: "warning",
    message: "Ammonia level at Batangas Tilapia Farm approaching warning threshold.",
    recommendation: "Monitor closely. Consider partial water exchange if trend continues.",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
];

export const mockAlertsService: AlertsService = {
  getActive: () => mockAlerts.filter((a) => !a.acknowledged),
  acknowledge: (id) => {
    mockAlerts = mockAlerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a));
  },
};
