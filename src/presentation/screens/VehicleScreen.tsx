import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Vehicle } from '../../domain/models/Vehicle';
import { Header } from '../components/Header';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';

interface VehicleScreenProps {
  vehicle: Vehicle;
  onSave: (updated: Vehicle) => void;
  onBack: () => void;
}

export const VehicleScreen: React.FC<VehicleScreenProps> = ({
  vehicle,
  onSave,
  onBack,
}) => {
  const [brand, setBrand] = useState(vehicle.brand);
  const [model, setModel] = useState(vehicle.model);
  const [year, setYear] = useState(vehicle.year.toString());
  const [plate, setPlate] = useState(vehicle.plate);
  const [currentMileage, setCurrentMileage] = useState(vehicle.currentMileage.toString());

  const handleSave = () => {
    if (!brand.trim() || !model.trim() || !plate.trim()) {
      Alert.alert('Datos incompletos', 'Por favor completa la marca, modelo y placa.');
      return;
    }

    const parsedMileage = parseInt(currentMileage, 10);
    const parsedYear = parseInt(year, 10);

    if (isNaN(parsedMileage) || parsedMileage < 0) {
      Alert.alert('Kilometraje inválido', 'Ingresa un kilometraje numérico válido.');
      return;
    }

    onSave({
      ...vehicle,
      brand: brand.trim(),
      model: model.trim(),
      year: isNaN(parsedYear) ? vehicle.year : parsedYear,
      plate: plate.trim().toUpperCase(),
      currentMileage: parsedMileage,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title="Mi vehículo"
        subtitle="Actualiza los datos principales de tu vehículo"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Marca"
          value={brand}
          onChangeText={setBrand}
          placeholder="Ej. Toyota, Nissan, Hyundai"
        />

        <InputField
          label="Modelo"
          value={model}
          onChangeText={setModel}
          placeholder="Ej. Corolla, Sentra, Tucson"
        />

        <InputField
          label="Año"
          value={year}
          onChangeText={setYear}
          placeholder="Ej. 2020"
          keyboardType="numeric"
          maxLength={4}
        />

        <InputField
          label="Placa"
          value={plate}
          onChangeText={setPlate}
          placeholder="Ej. ABC-123"
          autoCapitalize="characters"
        />

        <InputField
          label="Kilometraje actual (km)"
          value={currentMileage}
          onChangeText={setCurrentMileage}
          placeholder="Ej. 56000"
          keyboardType="numeric"
        />

        <Button
          title="Guardar vehículo"
          variant="primary"
          onPress={handleSave}
          style={styles.saveBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl * 2,
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
