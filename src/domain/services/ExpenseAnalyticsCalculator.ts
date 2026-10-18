import { Maintenance } from '../models/Maintenance';

export interface ExpenseMetrics {
  totalSpent: number;
  averageCost: number;
  serviceCount: number;
  highestCostService: Maintenance | null;
  lastCost: number;
}

export function calculateExpenseMetrics(maintenances: Maintenance[]): ExpenseMetrics {
  if (!maintenances || maintenances.length === 0) {
    return {
      totalSpent: 0,
      averageCost: 0,
      serviceCount: 0,
      highestCostService: null,
      lastCost: 0,
    };
  }

  const totalSpent = maintenances.reduce((acc, m) => acc + (Number(m.cost) || 0), 0);
  const serviceCount = maintenances.length;
  const averageCost = totalSpent / serviceCount;

  let highestCostService: Maintenance | null = null;
  let maxCost = -1;
  for (const m of maintenances) {
    if (m.cost > maxCost) {
      maxCost = m.cost;
      highestCostService = m;
    }
  }

  // First item represents latest registered service
  const lastCost = maintenances[0]?.cost || 0;

  return {
    totalSpent,
    averageCost,
    serviceCount,
    highestCostService,
    lastCost,
  };
}
