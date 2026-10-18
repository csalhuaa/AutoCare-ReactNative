import { Vehicle } from '../domain/models/Vehicle';
import { Maintenance } from '../domain/models/Maintenance';

export const initialVehicle: Vehicle = {
  id: '1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  plate: 'ABC-123',
  currentMileage: 56000,
};

export const initialMaintenances: Maintenance[] = [
  {
    id: 'm1',
    vehicleId: '1',
    type: 'Cambio de aceite',
    serviceDate: '02/10/2026',
    serviceMileage: 45240,
    cost: 150.0,
    nextMileage: 57000,
    nextDate: '15/10/2026',
    notes: 'Cambio de filtro y aceite sintético 5W-30.',
  },
  {
    id: 'm2',
    vehicleId: '1',
    type: 'Revisión de llantas',
    serviceDate: '12/03/2026',
    serviceMileage: 56000,
    cost: 300.0,
    nextMileage: 58089,
    nextDate: '12/05/2026',
    notes: 'Rotación y alineamiento de 4 ruedas.',
  },
  {
    id: 'm3',
    vehicleId: '1',
    type: 'Pastillas de freno',
    serviceDate: '15/01/2026',
    serviceMileage: 42000,
    cost: 220.0,
    nextMileage: 62000,
    nextDate: '15/01/2027',
    notes: 'Reemplazo de pastillas delanteras de cerámica.',
  },
];
