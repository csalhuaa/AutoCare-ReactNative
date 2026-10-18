export interface Maintenance {
  id: string;
  vehicleId: string;
  type: string;
  serviceDate: string; // DD/MM/YYYY
  serviceMileage: number;
  cost: number;
  nextMileage?: number | null;
  nextDate?: string | null; // DD/MM/YYYY
  notes: string;
}
