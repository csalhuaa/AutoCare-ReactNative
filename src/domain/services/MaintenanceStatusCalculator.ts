import { Maintenance } from '../models/Maintenance';
import { MaintenanceStatus, MaintenanceStatusInfo } from '../models/MaintenanceStatus';

/**
 * Parses date in DD/MM/YYYY format to Date object.
 */
export function parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-based
  const year = parseInt(parts[2], 10);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month, day);
}

/**
 * Formats a number to kilometer display string (e.g., 50,000 km).
 */
export function formatMileage(km: number | undefined | null): string {
  if (km === null || km === undefined) return '';
  return `${km.toLocaleString('es-PE')} km`;
}

/**
 * Formats a currency value in Soles (S/).
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === null || amount === undefined) return '';
  return `S/ ${amount.toFixed(2)}`;
}

/**
 * Evaluates the maintenance status based on current odometer and today's date.
 */
export function calculateStatusInfo(
  maintenance: Maintenance,
  currentMileage: number,
  today: Date = new Date()
): MaintenanceStatusInfo {
  // Reset hours to start of day for accurate day diff
  const todayClean = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const mileageDiff = maintenance.nextMileage != null ? maintenance.nextMileage - currentMileage : null;
  const nextDateObj = parseDate(maintenance.nextDate);

  let daysDiff: number | null = null;
  if (nextDateObj) {
    const diffTime = nextDateObj.getTime() - todayClean.getTime();
    daysDiff = Math.round(diffTime / (1000 * 60 * 60 * 24));
  }

  // 1. OVERDUE (Vencido)
  if (mileageDiff !== null && mileageDiff <= 0) {
    return {
      status: MaintenanceStatus.OVERDUE,
      message: `Vencido por ${formatMileage(Math.abs(mileageDiff))}`,
    };
  }

  if (daysDiff !== null && daysDiff < 0) {
    return {
      status: MaintenanceStatus.OVERDUE,
      message: `Vencido por fecha hace ${Math.abs(daysDiff)} día(s)`,
    };
  }

  // 2. UPCOMING (Próximo)
  if (mileageDiff !== null && mileageDiff <= 1000) {
    return {
      status: MaintenanceStatus.UPCOMING,
      message: `Faltan ${formatMileage(mileageDiff)}`,
    };
  }

  if (daysDiff !== null && daysDiff <= 30) {
    return {
      status: MaintenanceStatus.UPCOMING,
      message: `Faltan ${daysDiff} día(s)`,
    };
  }

  // 3. OK (Al día)
  if (mileageDiff !== null && mileageDiff > 1000) {
    return {
      status: MaintenanceStatus.OK,
      message: `Faltan ${formatMileage(mileageDiff)}`,
    };
  }

  if (daysDiff !== null && daysDiff > 30) {
    return {
      status: MaintenanceStatus.OK,
      message: `Faltan ${daysDiff} día(s)`,
    };
  }

  return {
    status: MaintenanceStatus.OK,
    message: 'Sin próximo mantenimiento definido',
  };
}
