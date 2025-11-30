import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BORDER = '#e5e7eb';
const MUTED = '#475467';
const PRIMARY = '#2563ff';

export default function Measurements() {
  const measurements = [
    { type: 'Weight', value: 175, unit: 'lbs', date: 'Today' },
    { type: 'Body Fat %', value: 12.5, unit: '%', date: '3 days ago' },
    { type: 'Chest', value: 42, unit: 'in', date: '1 week ago' },
    { type: 'Arms', value: 15.5, unit: 'in', date: '1 week ago' },
  ];

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
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>175</Text>
            <Text style={styles.statLabel}>Current Weight (lbs)</Text>
            <Text style={styles.statTrendUp}>↑ +2 lbs this week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12.5%</Text>
            <Text style={styles.statLabel}>Body Fat</Text>
            <Text style={styles.statTrendDown}>↓ -0.5% this month</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Measurements</Text>
        {measurements.map((measurement) => (
          <View key={measurement.type} style={styles.measureCard}>
            <View>
              <Text style={styles.measureType}>{measurement.type}</Text>
              <Text style={styles.measureDate}>{measurement.date}</Text>
            </View>
            <View style={styles.measureValue}>
              <Text style={styles.measureNumber}>{measurement.value}</Text>
              <Text style={styles.measureUnit}>{measurement.unit}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.dashedButton}>
          <Text style={styles.dashedText}>+ Add Measurement</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
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
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: PRIMARY,
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: MUTED,
    marginTop: 2,
  },
  statTrendUp: {
    marginTop: 6,
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 12,
  },
  statTrendDown: {
    marginTop: 6,
    color: '#ea580c',
    fontWeight: '700',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  measureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 10,
  },
  measureType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  measureDate: {
    fontSize: 12,
    color: MUTED,
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
    color: '#0f172a',
  },
  measureUnit: {
    fontSize: 12,
    color: MUTED,
  },
  dashedButton: {
    marginTop: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dashedText: {
    fontWeight: '700',
    color: '#0f172a',
  },
});
