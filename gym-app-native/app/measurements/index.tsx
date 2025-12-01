import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '../../providers/SettingsProvider';
import { colors } from '../../constants/colors';

type MeasurementType = 'weight' | 'bodyfat' | 'chest' | 'arms' | 'waist' | 'legs';

const MEASUREMENT_TYPES: { label: string; value: MeasurementType; unit: string }[] = [
  { label: 'Weight', value: 'weight', unit: 'kg' },
  { label: 'Body Fat %', value: 'bodyfat', unit: '%' },
  { label: 'Chest', value: 'chest', unit: 'cm' },
  { label: 'Arms', value: 'arms', unit: 'cm' },
  { label: 'Waist', value: 'waist', unit: 'cm' },
  { label: 'Legs', value: 'legs', unit: 'cm' },
];

export default function Measurements() {
  const { settings, addMeasurement } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<MeasurementType>('weight');
  const [value, setValue] = useState('');

  const sortedMeasurements = useMemo(() => {
    return [...settings.measurements].sort((a, b) => b.date - a.date);
  }, [settings.measurements]);

  const latestMeasurements = useMemo(() => {
    const latest: Record<MeasurementType, (typeof settings.measurements)[0] | null> = {
      weight: null,
      bodyfat: null,
      chest: null,
      arms: null,
      waist: null,
      legs: null,
    };

    for (const measurement of settings.measurements) {
      if (!latest[measurement.type as MeasurementType]) {
        latest[measurement.type as MeasurementType] = measurement;
      }
    }

    return latest;
  }, [settings.measurements]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const handleAddMeasurement = async () => {
    if (!value.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    const selectedTypeObj = MEASUREMENT_TYPES.find(t => t.value === selectedType);

    try {
      await addMeasurement({
        type: selectedType,
        value: numValue,
        unit: selectedTypeObj?.unit || 'kg',
        date: Date.now(),
      });

      setValue('');
      setSelectedType('weight');
      setModalVisible(false);
      Alert.alert('Success', 'Measurement added successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to add measurement');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Measurements</Text>
            <Text style={styles.subtitle}>Track body metrics</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {latestMeasurements.weight && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{latestMeasurements.weight.value}</Text>
              <Text style={styles.statLabel}>Current Weight ({latestMeasurements.weight.unit})</Text>
              <Text style={styles.statDate}>{formatDate(latestMeasurements.weight.date)}</Text>
            </View>
            {latestMeasurements.bodyfat && (
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{latestMeasurements.bodyfat.value}%</Text>
                <Text style={styles.statLabel}>Body Fat</Text>
                <Text style={styles.statDate}>{formatDate(latestMeasurements.bodyfat.date)}</Text>
              </View>
            )}
          </View>
        )}

        {sortedMeasurements.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Measurements</Text>
            {sortedMeasurements.map((measurement) => (
              <View key={measurement.id} style={styles.measureCard}>
                <View>
                  <Text style={styles.measureType}>
                    {MEASUREMENT_TYPES.find(t => t.value === measurement.type)?.label ||
                      measurement.type}
                  </Text>
                  <Text style={styles.measureDate}>{formatDate(measurement.date)}</Text>
                </View>
                <View style={styles.measureValue}>
                  <Text style={styles.measureNumber}>{measurement.value}</Text>
                  <Text style={styles.measureUnit}>{measurement.unit}</Text>
                </View>
              </View>
            ))}
          </>
        )}

        {sortedMeasurements.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="scale-outline" size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
            <Text style={styles.emptyTitle}>No measurements yet</Text>
            <Text style={styles.emptyDescription}>
              Add your first measurement to start tracking progress
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Measurement</Text>
              <TouchableOpacity onPress={handleAddMeasurement}>
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalLabel}>Measurement Type</Text>
              <View style={styles.typeGrid}>
                {MEASUREMENT_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.typeButton,
                      selectedType === type.value && styles.typeButtonActive,
                    ]}
                    onPress={() => setSelectedType(type.value)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        selectedType === type.value && styles.typeButtonTextActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.modalLabel}>Value</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter value"
                  placeholderTextColor="#94a3b8"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={setValue}
                />
                <Text style={styles.unitDisplay}>
                  {MEASUREMENT_TYPES.find(t => t.value === selectedType)?.unit}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  statDate: {
    marginTop: 6,
    color: colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  measureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  measureType: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  measureDate: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  measureValue: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 10,
  },
  measureNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  measureUnit: {
    fontSize: 12,
    color: colors.muted,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  modalSave: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '700',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  unitDisplay: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
});
