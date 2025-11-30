import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#2563ff';
const BORDER = '#e5e7eb';
const MUTED = '#475467';

export default function LogWorkout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Log Workout</Text>
          <Text style={styles.subtitle}>Track your training session</Text>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Exercises</Text>
            <Text style={styles.summaryValue}>1</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Sets</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Volume</Text>
            <Text style={styles.summaryValue}>0</Text>
          </View>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateTitle}>Leg Day</Text>
            <TouchableOpacity style={styles.templateCTA}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.templateSubtitle}>6 exercises</Text>
        </View>

        <View style={styles.templateCard}>
          <View style={styles.templateHeader}>
            <Text style={styles.templateTitle}>Pull Day</Text>
            <TouchableOpacity style={styles.templateCTA}>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.templateSubtitle}>5 exercises</Text>
        </View>

        <TouchableOpacity
          style={styles.addExerciseBox}
          onPress={() => router.push('/log-workout/picker')}
          activeOpacity={0.85}
        >
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </TouchableOpacity>

        <View style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseChip}>
              <Text style={styles.exerciseChipText}>1</Text>
            </View>
            <Text style={styles.exerciseName}>Lat Pulldown</Text>
            <TouchableOpacity>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <Ionicons name="sparkles" size={16} color={PRIMARY} />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.tipTitle}>First Time</Text>
              <Text style={styles.tipText}>
                Start with a weight you can do 8–12 reps with good form.
              </Text>
            </View>
          </View>

          <View style={styles.setBox}>
            <Text style={styles.setLabel}>Set 1</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputPill}>
                <Text style={styles.inputLabel}>Weight (kg)</Text>
                <Text style={styles.inputValue}>60</Text>
              </View>
              <View style={styles.inputPill}>
                <Text style={styles.inputLabel}>Reps</Text>
                <Text style={styles.inputValue}>10</Text>
              </View>
            </View>
            <View style={styles.checkboxRow}>
              <View style={styles.checkboxItem}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>Form issue</Text>
              </View>
              <View style={styles.checkboxItem}>
                <View style={styles.checkbox} />
                <Text style={styles.checkboxLabel}>Failed</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: BORDER,
  },
  summaryLabel: {
    fontSize: 12,
    color: MUTED,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  templateCard: {
    backgroundColor: '#f0f5ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 10,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  templateTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  templateCTA: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateSubtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 6,
  },
  addExerciseBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#fff',
  },
  addExerciseText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  exerciseChip: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseChipText: {
    fontWeight: '700',
    color: PRIMARY,
  },
  exerciseName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  removeText: {
    fontSize: 13,
    color: MUTED,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  tipText: {
    fontSize: 13,
    color: MUTED,
    marginTop: 2,
  },
  setBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  setLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  inputPill: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  inputLabel: {
    fontSize: 12,
    color: MUTED,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 13,
    color: MUTED,
  },
});
