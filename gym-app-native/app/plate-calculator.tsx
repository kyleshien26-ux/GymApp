import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { useSettings } from '../providers/SettingsProvider';

type PlateConfig = {
  weight: number;
  color: string;
  count: number;
};

const BARBELL_WEIGHT_KG = 20;
const BARBELL_WEIGHT_LBS = 45;

const PLATES_KG: { weight: number; color: string }[] = [
  { weight: 25, color: '#ef4444' },
  { weight: 20, color: '#3b82f6' },
  { weight: 15, color: '#eab308' },
  { weight: 10, color: '#22c55e' },
  { weight: 5, color: '#f8fafc' },
  { weight: 2.5, color: '#ef4444' },
  { weight: 1.25, color: '#6b7280' },
];

const PLATES_LBS: { weight: number; color: string }[] = [
  { weight: 45, color: '#3b82f6' },
  { weight: 35, color: '#eab308' },
  { weight: 25, color: '#22c55e' },
  { weight: 10, color: '#f8fafc' },
  { weight: 5, color: '#ef4444' },
  { weight: 2.5, color: '#6b7280' },
];

function calculatePlates(targetWeight: number, barbellWeight: number, availablePlates: { weight: number; color: string }[]): PlateConfig[] {
  const weightPerSide = (targetWeight - barbellWeight) / 2;
  
  if (weightPerSide <= 0) return [];
  
  const result: PlateConfig[] = [];
  let remaining = weightPerSide;
  
  for (const plate of availablePlates) {
    if (remaining >= plate.weight) {
      const count = Math.floor(remaining / plate.weight);
      result.push({ weight: plate.weight, color: plate.color, count });
      remaining -= count * plate.weight;
    }
  }
  
  return result;
}

export default function PlateCalculator() {
  const router = useRouter();
  const { settings } = useSettings();
  const [targetWeight, setTargetWeight] = useState('');
  
  const isKg = settings.preferences.units === 'kg';
  const barbellWeight = isKg ? BARBELL_WEIGHT_KG : BARBELL_WEIGHT_LBS;
  const plates = isKg ? PLATES_KG : PLATES_LBS;
  const unit = isKg ? 'kg' : 'lbs';
  
  const plateConfig = useMemo(() => {
    const weight = parseFloat(targetWeight);
    if (isNaN(weight) || weight <= barbellWeight) return [];
    return calculatePlates(weight, barbellWeight, plates);
  }, [targetWeight, barbellWeight, plates]);
  
  const totalWeight = useMemo(() => {
    const platesWeight = plateConfig.reduce((sum, p) => sum + (p.weight * p.count * 2), 0);
    return barbellWeight + platesWeight;
  }, [plateConfig, barbellWeight]);
  
  const quickWeights = isKg 
    ? [60, 80, 100, 120, 140, 160]
    : [135, 185, 225, 275, 315, 405];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Plate Calculator</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.label}>Target Weight ({unit})</Text>
          <TextInput
            style={styles.input}
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder={`Enter weight in ${unit}`}
            placeholderTextColor={colors.textSecondary}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.quickSelect}>
          <Text style={styles.quickLabel}>Quick Select</Text>
          <View style={styles.quickButtons}>
            {quickWeights.map((weight) => (
              <TouchableOpacity
                key={weight}
                style={[styles.quickButton, targetWeight === String(weight) && styles.quickButtonActive]}
                onPress={() => setTargetWeight(String(weight))}
              >
                <Text style={[styles.quickButtonText, targetWeight === String(weight) && styles.quickButtonTextActive]}>
                  {weight}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.barbellInfo}>
          <Ionicons name="barbell" size={20} color={colors.textSecondary} />
          <Text style={styles.barbellText}>Standard barbell: {barbellWeight} {unit}</Text>
        </View>

        {plateConfig.length > 0 ? (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Load on Each Side:</Text>
            
            <View style={styles.platesList}>
              {plateConfig.map((plate, index) => (
                <View key={index} style={styles.plateRow}>
                  <View style={[styles.plateVisual, { backgroundColor: plate.color }]}>
                    <Text style={[styles.plateWeight, plate.color === '#f8fafc' && { color: '#000' }]}>
                      {plate.weight}
                    </Text>
                  </View>
                  <Text style={styles.plateCount}>× {plate.count}</Text>
                  <Text style={styles.plateSubtotal}>= {plate.weight * plate.count} {unit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Barbell</Text>
                <Text style={styles.totalValue}>{barbellWeight} {unit}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Plates (both sides)</Text>
                <Text style={styles.totalValue}>{totalWeight - barbellWeight} {unit}</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotal]}>
                <Text style={styles.grandTotalLabel}>Total Weight</Text>
                <Text style={styles.grandTotalValue}>{totalWeight} {unit}</Text>
              </View>
            </View>

            {totalWeight !== parseFloat(targetWeight) && (
              <View style={styles.warningBox}>
                <Ionicons name="alert-circle" size={16} color="#f59e0b" />
                <Text style={styles.warningText}>
                  Closest achievable: {totalWeight} {unit} (target: {targetWeight} {unit})
                </Text>
              </View>
            )}
          </View>
        ) : targetWeight && parseFloat(targetWeight) <= barbellWeight ? (
          <View style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Just use the empty barbell</Text>
            <Text style={styles.emptySubtext}>Target weight is less than or equal to barbell weight</Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calculator-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Enter a target weight</Text>
            <Text style={styles.emptySubtext}>We will calculate the plates needed</Text>
          </View>
        )}

        <View style={styles.availablePlates}>
          <Text style={styles.availableTitle}>Available Plates</Text>
          <View style={styles.availableList}>
            {plates.map((plate, index) => (
              <View key={index} style={[styles.availablePlate, { backgroundColor: plate.color }]}>
                <Text style={[styles.availablePlateText, plate.color === '#f8fafc' && { color: '#000' }]}>
                  {plate.weight}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  quickSelect: {
    marginBottom: 20,
  },
  quickLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  quickButtonTextActive: {
    color: '#fff',
  },
  barbellInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 20,
  },
  barbellText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resultSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  platesList: {
    gap: 12,
    marginBottom: 20,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  plateVisual: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateWeight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  plateCount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    width: 40,
  },
  plateSubtotal: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: colors.text,
  },
  grandTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#92400e',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  availablePlates: {
    marginBottom: 40,
  },
  availableTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  availableList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availablePlate: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availablePlateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});
