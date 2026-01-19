import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { exerciseDatabase, getAllMuscleGroups, searchExercises, getExercisesByMuscleGroup, type Exercise } from '../../constants/exercises';

export default function ExercisesList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscleGroups = getAllMuscleGroups();

  const filteredExercises = useMemo(() => {
    if (searchQuery.trim()) {
      return searchExercises(searchQuery);
    }
    if (selectedMuscle) {
      return getExercisesByMuscleGroup(selectedMuscle as any);
    }
    return exerciseDatabase;
  }, [searchQuery, selectedMuscle]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Exercises</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor={colors.muted}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            if (text) setSelectedMuscle(null);
          }}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Muscle Group Filters */}
      {!searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.muscleScroll}
          style={styles.muscleFilterContainer}
        >
          <TouchableOpacity
            style={[styles.musclePill, !selectedMuscle && styles.musclePillActive]}
            onPress={() => setSelectedMuscle(null)}
          >
            <Text style={[styles.musclePillText, !selectedMuscle && styles.musclePillTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {muscleGroups.map((muscle) => {
            const isActive = selectedMuscle === muscle;
            return (
              <TouchableOpacity
                key={muscle}
                style={[styles.musclePill, isActive && styles.musclePillActive]}
                onPress={() => setSelectedMuscle(muscle)}
              >
                <Text style={[styles.musclePillText, isActive && styles.musclePillTextActive]}>
                  {muscle}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultCount}>{filteredExercises.length} exercises</Text>
        {filteredExercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseMeta}>
                <Text style={styles.exerciseMuscle}>{exercise.muscleGroup}</Text>
                <View style={styles.dot} />
                <Text style={styles.exerciseCategory}>
                  {exercise.category === 'compound' ? 'Compound' : 'Isolation'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </View>
        ))}
        {filteredExercises.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={40} color={colors.muted} />
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 12,
  },
  muscleFilterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  muscleScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  musclePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  musclePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  musclePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  musclePillTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultCount: {
    fontSize: 13,
    color: colors.muted,
    marginVertical: 12,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseMuscle: {
    fontSize: 12,
    color: colors.muted,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.muted,
  },
  exerciseCategory: {
    fontSize: 12,
    color: colors.muted,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 12,
  },
});
