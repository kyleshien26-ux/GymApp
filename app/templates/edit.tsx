import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';
const PRIMARY = '#2563ff';

export default function EditTemplate() {
  const router = useRouter();

  const selectedExercises = ['Lat Pulldown'];
  const exerciseOptions = [
    'Lat Pulldown',
    'Lateral Raises',
    'Skull Crushers',
    'Leg Press',
    'Leg Curl',
    'Front Raises',
    'Overhead Tricep Extension',
    'Clean and Jerk',
    'Pull-ups',
    'Power Clean',
    'Incline Dumbbell Press',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Edit Template</Text>

        <View style={styles.section}>
          <Text style={styles.label}>Template Name</Text>
          <TextInput
            style={styles.input}
            defaultValue="Push Day"
            placeholder="Push Day"
            placeholderTextColor={MUTED}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            defaultValue="Chest, shoulders, and triceps"
            multiline
            placeholder="Describe this template..."
            placeholderTextColor={MUTED}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Add Exercises</Text>
          <View style={styles.selectBox}>
            <Text style={styles.selectPlaceholder}>Select an exercise...</Text>
            <Ionicons name="chevron-down" size={18} color={MUTED} />
          </View>

          <View style={styles.selectedList}>
            <Text style={styles.subLabel}>Selected Exercises ({selectedExercises.length})</Text>
            {selectedExercises.map((item) => (
              <View key={item} style={styles.selectedItem}>
                <Text style={styles.selectedName}>{item}</Text>
                <Ionicons name="close" size={18} color={MUTED} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryText}>Update</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    color: '#0f172a',
    fontSize: 15,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  selectBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectPlaceholder: {
    color: MUTED,
    fontSize: 15,
  },
  selectedList: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },
  subLabel: {
    fontSize: 13,
    color: MUTED,
    marginBottom: 8,
    fontWeight: '700',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  selectedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#fff',
  },
  primaryButton: {
    backgroundColor: PRIMARY,
  },
  secondaryText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 15,
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
