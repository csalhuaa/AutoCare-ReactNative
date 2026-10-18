import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Maintenance } from '../../domain/models/Maintenance';
import { Header } from '../components/Header';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';

interface MaintenanceScreenProps {
  vehicleId: string;
  currentMileage: number;
  maintenance?: Maintenance | null;
  onSave: (entry: Omit<Maintenance, 'id'> | Maintenance) => void;
  onBack: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  vehicleId,
  currentMileage,
  maintenance,
  onSave,
  onBack,
}) => {
  const isEditing = Boolean(maintenance);

  const [type, setType] = useState(maintenance?.type || '');
  const [serviceDate, setServiceDate] = useState(
    maintenance?.serviceDate || new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  );
  const [serviceMileage, setServiceMileage] = useState(
    maintenance?.serviceMileage ? maintenance.serviceMileage.toString() : currentMileage.toString()
  );
  const [cost, setCost] = useState(maintenance?.cost ? maintenance.cost.toString() : '');
  const [nextMileage, setNextMileage] = useState(
    maintenance?.nextMileage ? maintenance.nextMileage.toString() : ''
  );
  const [nextDate, setNextDate] = useState(maintenance?.nextDate || '');
  const [notes, setNotes] = useState(maintenance?.notes || '');

  const handleSave = () => {
    if (!type.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el tipo de mantenimiento.');
      return;
    }

    const parsedMileage = parseInt(serviceMileage, 10);
    const parsedCost = parseFloat(cost);
    const parsedNextMileage = nextMileage.trim() ? parseInt(nextMileage, 10) : null;

    if (isNaN(parsedMileage) || parsedMileage < 0) {
      Alert.alert('Kilometraje inválido', 'Ingresa un kilometraje numérico válido.');
      return;
    }

    const payload = {
      ...(maintenance ? { id: maintenance.id } : {}),
      vehicleId,
      type: type.trim(),
      serviceDate: serviceDate.trim(),
      serviceMileage: parsedMileage,
      cost: isNaN(parsedCost) ? 0 : parsedCost,
      nextMileage: parsedNextMileage,
      nextDate: nextDate.trim() || null,
      notes: notes.trim(),
    };

    onSave(payload as any);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header
        title={isEditing ? 'Editar mantenimiento' : 'Nuevo mantenimiento'}
        subtitle={
          isEditing
            ? 'Modifica los datos del mantenimiento seleccionado'
            : 'Registra un servicio realizado a tu vehículo'
        }
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InputField
          label="Tipo de mantenimiento"
          value={type}
          onChangeText={setType}
          placeholder="Ej. Cambio de aceite, Pastillas de freno"
        />

        <InputField
          label="Fecha del servicio (DD/MM/AAAA)"
          value={serviceDate}
          onChangeText={setServiceDate}
          placeholder="DD/MM/AAAA"
        />

        <InputField
          label="Kilometraje del servicio (km)"
          value={serviceMileage}
          onChangeText={setServiceMileage}
          placeholder="Ej. 56000"
          keyboardType="numeric"
        />

        <InputField
          label="Costo (S/)"
          value={cost}
          onChangeText={setCost}
          placeholder="Ej. 150.00"
          keyboardType="numeric"
        />

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionHeader}>Próximo mantenimiento (Metas)</Text>
        </View>

        <InputField
          label="Próximo kilometraje (km)"
          value={nextMileage}
          onChangeText={setNextMileage}
          placeholder="Ej. 61000 (Opcional)"
          keyboardType="numeric"
        />

        <InputField
          label="Próxima fecha recomendada (DD/MM/AAAA)"
          value={nextDate}
          onChangeText={setNextDate}
          placeholder="DD/MM/AAAA (Opcional)"
        />

        <InputField
          label="Observaciones y recomendaciones"
          value={notes}
          onChangeText={setNotes}
          placeholder="Ej. Marca de aceite utilizado, garantía del taller..."
          multiline
          numberOfLines={3}
          style={styles.multilineInput}
        />

        <Button
          title={isEditing ? 'Guardar cambios' : 'Guardar mantenimiento'}
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
  sectionDivider: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  sectionHeader: {
    ...Typography.h3,
    color: Colors.primaryDark,
  },
  multilineInput: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
