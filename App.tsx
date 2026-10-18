import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Vehicle } from './src/domain/models/Vehicle';
import { Maintenance } from './src/domain/models/Maintenance';
import { StorageService } from './src/data/storageService';
import { initialVehicle, initialMaintenances } from './src/data/mockData';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { VehicleScreen } from './src/presentation/screens/VehicleScreen';
import { MaintenanceScreen } from './src/presentation/screens/MaintenanceScreen';
import { HistoryScreen } from './src/presentation/screens/HistoryScreen';
import { Colors } from './src/theme/colors';

type ScreenType = 'HOME' | 'VEHICLE' | 'MAINTENANCE_ADD' | 'MAINTENANCE_EDIT' | 'HISTORY';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('HOME');
  const [vehicle, setVehicle] = useState<Vehicle>(initialVehicle);
  const [maintenances, setMaintenances] = useState<Maintenance[]>(initialMaintenances);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize and load persistent data from AsyncStorage
  useEffect(() => {
    async function loadData() {
      try {
        const storedVehicle = await StorageService.getVehicle();
        const storedMaintenances = await StorageService.getMaintenances();
        setVehicle(storedVehicle);
        setMaintenances(storedMaintenances);
      } catch (err) {
        console.error('Failed to load AutoCare storage', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveVehicle = async (updated: Vehicle) => {
    setVehicle(updated);
    await StorageService.saveVehicle(updated);
    setCurrentScreen('HOME');
  };

  const handleAddMaintenance = async (entry: Omit<Maintenance, 'id'>) => {
    const newEntry = await StorageService.addMaintenance(entry);
    setMaintenances((prev) => [newEntry, ...prev]);
    setCurrentScreen('HOME');
  };

  const handleUpdateMaintenance = async (updated: Maintenance) => {
    await StorageService.updateMaintenance(updated);
    setMaintenances((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    setEditingMaintenance(null);
    setCurrentScreen('HISTORY');
  };

  const handleDeleteMaintenance = async (id: string) => {
    await StorageService.deleteMaintenance(id);
    setMaintenances((prev) => prev.filter((m) => m.id !== id));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        {currentScreen === 'HOME' && (
          <HomeScreen
            vehicle={vehicle}
            maintenances={maintenances}
            onNavigateVehicle={() => setCurrentScreen('VEHICLE')}
            onNavigateAddMaintenance={() => setCurrentScreen('MAINTENANCE_ADD')}
            onNavigateHistory={() => setCurrentScreen('HISTORY')}
          />
        )}

        {currentScreen === 'VEHICLE' && (
          <VehicleScreen
            vehicle={vehicle}
            onSave={handleSaveVehicle}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'MAINTENANCE_ADD' && (
          <MaintenanceScreen
            vehicleId={vehicle.id}
            currentMileage={vehicle.currentMileage}
            onSave={handleAddMaintenance as any}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}

        {currentScreen === 'MAINTENANCE_EDIT' && (
          <MaintenanceScreen
            vehicleId={vehicle.id}
            currentMileage={vehicle.currentMileage}
            maintenance={editingMaintenance}
            onSave={handleUpdateMaintenance as any}
            onBack={() => setCurrentScreen('HISTORY')}
          />
        )}

        {currentScreen === 'HISTORY' && (
          <HistoryScreen
            maintenances={maintenances}
            currentMileage={vehicle.currentMileage}
            onEdit={(item) => {
              setEditingMaintenance(item);
              setCurrentScreen('MAINTENANCE_EDIT');
            }}
            onDelete={handleDeleteMaintenance}
            onBack={() => setCurrentScreen('HOME')}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
