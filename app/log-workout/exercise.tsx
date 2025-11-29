import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';
const PRIMARY = '#2563ff';

export default function ExerciseLog() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Bench Press</Text>
        <TouchableOpacity>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>Bench Press</Text>
          <Text style={styles.exerciseTarget}>Chest • Compound</Text>
        </View>

        <View style={styles.setsSection}>
          <View style={styles.setsHeader}>
            <Text style={styles.headerLabel}>Set</Text>
            <Text style={[styles.headerLabel, styles.centerText]}>Weight</Text>
            <Text style={[styles.headerLabel, styles.centerText]}>Reps</Text>
            <Text style={[styles.headerLabel, styles.centerText]}>✓</Text>
          </View>

          <View style={styles.setRow}>
            <Text style={styles.setNumber}>1</Text>
            <TextInput
              style={styles.input}
              placeholder="60"
              placeholderTextColor={MUTED}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="10"
              placeholderTextColor={MUTED}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.checkButton}>
              <Ionicons name="checkmark" size={20} color="#22c55e" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addSetButton}>
            <Text style={styles.addSetText}>+ Add Set</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes about this exercise..."
            placeholderTextColor={MUTED}
            multiline
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  doneButton: {
    fontSize: 15,
    color: PRIMARY,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  exerciseInfo: {
    marginBottom: 20,
  },
  exerciseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  exerciseTarget: {
    fontSize: 14,
    color: MUTED,
  },
  setsSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  setsHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginBottom: 10,
  },
  headerLabel: {
    flex: 1,
    fontSize: 13,
    color: MUTED,
    fontWeight: '700',
  },
  centerText: {
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setNumber: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  input: {
    flex: 2,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    color: '#0f172a',
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: BORDER,
  },
  checkButton: {
    flex: 1,
    alignItems: 'center',
  },
  addSetButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  addSetText: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },
  notesSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  notesInput: {
    color: '#0f172a',
    fontSize: 14,
    minHeight: 70,
  },
});
