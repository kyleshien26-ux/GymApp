import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';

export default function ExercisesList() {
  const router = useRouter();

  const exerciseCategories = [
    { name: 'Chest', exercises: ['Bench Press', 'Incline Press', 'Chest Fly', 'Push-ups'] },
    { name: 'Back', exercises: ['Pull-ups', 'Deadlift', 'Bent-over Row', 'Lat Pulldown'] },
    { name: 'Legs', exercises: ['Squat', 'Leg Press', 'Lunges', 'Calf Raises'] },
    { name: 'Shoulders', exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Shrugs'] },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercises</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={MUTED} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={MUTED}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {exerciseCategories.map((category) => (
          <View key={category.name} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.name}</Text>
            {category.exercises.map((exercise) => (
              <TouchableOpacity key={exercise} style={styles.exerciseItem} activeOpacity={0.85}>
                <Text style={styles.exerciseName}>{exercise}</Text>
                <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        ))}
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
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#2563ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categorySection: {
    marginBottom: 18,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
});
