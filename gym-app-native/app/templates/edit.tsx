import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { colors } from '../../constants/colors';
import { exerciseDatabase, type Exercise } from '../../constants/exercises';
import type { Template } from '../../types/workouts';

export default function EditTemplate() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addTemplate, updateTemplate, templates } = useWorkouts();

  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<Array<{ name: string; id: string }>>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchText, setSearchText] = useState('');

  const templateId = params?.templateId as string;
  const isEditing = !!templateId;

  // Load template data if editing
  useEffect(() => {
    if (isEditing && templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setTemplateName(template.name);
        setDescription(template.description || '');
        setSelectedExercises(
          template.exercises.map((ex) => ({
            name: ex.name,
            id: ex.id,
          }))
        );
      }
    }
  }, [isEditing, templateId, templates]);

  const filteredExercises = exerciseDatabase.filter((ex: Exercise) =>
    ex.name.toLowerCase().includes(searchText.toLowerCase())
  ).filter((ex: Exercise) => !selectedExercises.find((sel) => sel.name === ex.name));

  const handleAddExercise = (exerciseName: string) => {
    const newExercise = {
      name: exerciseName,
      id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setSelectedExercises((prev) => [...prev, newExercise]);
    setSearchText('');
  };

  const handleRemoveExercise = (id: string) => {
    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const handleSave = async () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise to the template');
      return;
    }

    setSaving(true);
    try {
      if (isEditing && templateId) {
        // Update existing template
        const updatedTemplate: Template = {
          id: templateId,
          name: templateName.trim(),
          description: description.trim(),
          exercises: selectedExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            sets: [],
          })),
        };
        await updateTemplate(templateId, updatedTemplate);
        Alert.alert('Success', 'Template updated successfully');
      } else {
        // Create new template
        const newTemplate: Template = {
          id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: templateName.trim(),
          description: description.trim(),
          exercises: selectedExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
            sets: [],
          })),
        };
        await addTemplate(newTemplate);
        Alert.alert('Success', 'Template created successfully');
      }
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Template' : 'Create Template'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Template Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Push Day, Leg Day"
            placeholderTextColor={colors.muted}
            value={templateName}
            onChangeText={setTemplateName}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Add notes about this template..."
            placeholderTextColor={colors.muted}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Exercises ({selectedExercises.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {selectedExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="barbell-outline" size={40} color={colors.muted} />
              <Text style={styles.emptyText}>No exercises added yet</Text>
              <Text style={styles.emptyDescription}>Tap the + button to add exercises</Text>
            </View>
          ) : (
            <View style={styles.exercisesList}>
              {selectedExercises.map((ex) => (
                <View key={ex.id} style={styles.exerciseItem}>
                  <View style={styles.exerciseInfo}>
                    <Ionicons name="barbell" size={18} color={colors.primary} />
                    <Text style={styles.exerciseName}>{ex.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveExercise(ex.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={22} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>{isEditing ? 'Update' : 'Create'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Exercise Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Exercises</Text>
              <View style={{ width: 28 }} />
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises..."
                placeholderTextColor={colors.muted}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.exercisesGrid}
            >
              {filteredExercises.length === 0 ? (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>
                    {searchText ? 'No exercises found' : 'All exercises added'}
                  </Text>
                </View>
              ) : (
                filteredExercises.map((exercise: Exercise) => (
                  <TouchableOpacity
                    key={exercise.name}
                    style={styles.exerciseOption}
                    onPress={() => {
                      handleAddExercise(exercise.name);
                      setPickerVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="barbell" size={20} color={colors.primary} />
                    <View style={styles.exerciseOptionText}>
                      <Text style={styles.exerciseOptionName}>{exercise.name}</Text>
                      <Text style={styles.exerciseOptionMuscle}>{exercise.muscleGroup}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                  </TouchableOpacity>
                ))
              )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  multiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  addButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  exercisesList: {
    gap: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  exerciseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
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
    maxHeight: '85%',
    paddingTop: 12,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 10,
    marginLeft: 10,
  },
  exercisesGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  exerciseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  exerciseOptionText: {
    flex: 1,
  },
  exerciseOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseOptionMuscle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  noResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 15,
    color: colors.muted,
  },
});
