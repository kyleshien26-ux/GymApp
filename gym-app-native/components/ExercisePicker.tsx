import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  exerciseDatabase,
  getAllMuscleGroups,
  searchExercises,
  getExercisesByMuscleGroup,
  type Exercise,
} from '../constants/exercises';

interface ExercisePickerProps {
  visible: boolean;
  onSelectExercise: (exercise: Exercise) => void;
  onClose: () => void;
}

export function ExercisePicker({
  visible,
  onSelectExercise,
  onClose,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const muscleGroups = getAllMuscleGroups();

  const filteredExercises = useMemo(() => {
    let exercises: Exercise[] = [];

    if (searchQuery.trim()) {
      exercises = searchExercises(searchQuery);
    } else if (selectedMuscle) {
      exercises = getExercisesByMuscleGroup(selectedMuscle as any);
    } else {
      exercises = exerciseDatabase;
    }

    return exercises.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, selectedMuscle]);

  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    setSearchQuery('');
    setSelectedMuscle(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Exercise</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
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
              style={[
                styles.musclePill,
                !selectedMuscle && styles.musclePillActive,
              ]}
              onPress={() => setSelectedMuscle(null)}
            >
              <Text
                style={[
                  styles.musclePillText,
                  !selectedMuscle && styles.musclePillTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {muscleGroups.map((muscle) => {
              const isActive = selectedMuscle === muscle;
              return (
                <TouchableOpacity
                  key={muscle}
                  style={[
                    styles.musclePill,
                    isActive && styles.musclePillActive,
                  ]}
                  onPress={() => setSelectedMuscle(muscle)}
                >
                  <Text
                    style={[
                      styles.musclePillText,
                      isActive && styles.musclePillTextActive,
                    ]}
                  >
                    {muscle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Exercise List */}
        <FlatList
          data={filteredExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseItem}
              onPress={() => handleSelectExercise(item)}
            >
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <View style={styles.exerciseMeta}>
                  <Text style={styles.exerciseMuscle}>{item.muscleGroup}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.exerciseCategory}>
                    {item.category === 'compound' ? 'Compound' : 'Isolation'}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.muted}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="search"
                size={40}
                color={colors.muted}
                style={{ marginBottom: 12 }}
              />
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          }
        />
      </View>
    </Modal>
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
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
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
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  },
});
