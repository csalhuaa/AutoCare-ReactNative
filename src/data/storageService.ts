import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle } from '../domain/models/Vehicle';
import { Maintenance } from '../domain/models/Maintenance';
import { initialVehicle, initialMaintenances } from './mockData';

const VEHICLE_KEY = '@autocare_vehicle';
const MAINTENANCES_KEY = '@autocare_maintenances';

export const StorageService = {
  async getVehicle(): Promise<Vehicle> {
    try {
      const data = await AsyncStorage.getItem(VEHICLE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      await this.saveVehicle(initialVehicle);
      return initialVehicle;
    } catch {
      return initialVehicle;
    }
  },

  async saveVehicle(vehicle: Vehicle): Promise<void> {
    await AsyncStorage.setItem(VEHICLE_KEY, JSON.stringify(vehicle));
  },

  async getMaintenances(): Promise<Maintenance[]> {
    try {
      const data = await AsyncStorage.getItem(MAINTENANCES_KEY);
      if (data) {
        return JSON.parse(data);
      }
      await this.saveMaintenances(initialMaintenances);
      return initialMaintenances;
    } catch {
      return initialMaintenances;
    }
  },

  async saveMaintenances(maintenances: Maintenance[]): Promise<void> {
    await AsyncStorage.setItem(MAINTENANCES_KEY, JSON.stringify(maintenances));
  },

  async addMaintenance(maintenance: Omit<Maintenance, 'id'>): Promise<Maintenance> {
    const list = await this.getMaintenances();
    const newEntry: Maintenance = {
      ...maintenance,
      id: `m_${Date.now()}`,
    };
    const updated = [newEntry, ...list];
    await this.saveMaintenances(updated);
    return newEntry;
  },

  async updateMaintenance(updatedItem: Maintenance): Promise<void> {
    const list = await this.getMaintenances();
    const updated = list.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    await this.saveMaintenances(updated);
  },

  async deleteMaintenance(id: string): Promise<void> {
    const list = await this.getMaintenances();
    const updated = list.filter((item) => item.id !== id);
    await this.saveMaintenances(updated);
  },
};
