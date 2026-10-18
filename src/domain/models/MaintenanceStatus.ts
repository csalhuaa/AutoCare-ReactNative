export enum MaintenanceStatus {
  OVERDUE = 'OVERDUE',
  UPCOMING = 'UPCOMING',
  OK = 'OK',
}

export interface MaintenanceStatusInfo {
  status: MaintenanceStatus;
  message: string;
}
