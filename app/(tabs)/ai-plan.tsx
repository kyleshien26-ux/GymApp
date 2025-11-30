import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Option = {
  id: string;
  label: string;
  subLabel?: string;
};

export default function AiPlan() {
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['Chest', 'Back']);
  const [selectedGoal, setSelectedGoal] = useState('Muscle Size');
  const [selectedDuration, setSelectedDuration] = useState('45-60 min');
  const [selectedExperience, setSelectedExperience] = useState('Intermediate');

  const muscles = [
    { id: 'Chest', label: 'Chest', emoji: '💪' },
    { id: 'Back', label: 'Back', emoji: '🛡️' },
    { id: 'Shoulders', label: 'Shoulders', emoji: '🎯' },
    { id: 'Biceps', label: 'Biceps', emoji: '🧲' },
    { id: 'Triceps', label: 'Triceps', emoji: '⚡' },
    { id: 'Quads', label: 'Quads', emoji: '🚴' },
    { id: 'Hamstrings', label: 'Hamstrings', emoji: '🏃' },
    { id: 'Glutes', label: 'Glutes', emoji: '🍑' },
    { id: 'Abs', label: 'Abs', emoji: '🎯' },
  ];

  const goalOptions: Option[] = [
    { id: 'Strength', label: 'Strength', subLabel: '3-5 reps, heavy' },
    { id: 'Muscle Size', label: 'Muscle Size', subLabel: '8-12 reps, moderate' },
    { id: 'Endurance', label: 'Endurance', subLabel: '15+ reps, light' },
    { id: 'Power', label: 'Power', subLabel: '1-3 reps, explosive' },
  ];

  const durationOptions: Option[] = [
    { id: '30-45 min', label: '30-45 min' },
    { id: '45-60 min', label: '45-60 min' },
    { id: '60-90 min', label: '60-90 min' },
  ];

  const experienceOptions: Option[] = [
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' },
  ];

  const toggleMuscle = (id: string) => {
    setSelectedMuscles((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const renderChip = (option: Option, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionChip, selected && styles.optionChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.optionLabel, selected && styles.optionLabelActive]}>
        {option.label}
      </Text>
      {option.subLabel ? (
        <Text style={[styles.optionSubLabel, selected && styles.optionSubLabelActive]}>
          {option.subLabel}
        </Text>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Workout Planner</Text>
          <Text style={styles.subtitle}>Generate personalized workout plans with AI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Workout Configuration</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Muscle Groups</Text>
            <View style={styles.muscleGrid}>
              {muscles.map((muscle) => {
                const isSelected = selectedMuscles.includes(muscle.id);
                return (
                  <TouchableOpacity
                    key={muscle.id}
                    onPress={() => toggleMuscle(muscle.id)}
                    style={[
                      styles.muscleCard,
                      isSelected && styles.muscleCardActive,
                    ]}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.muscleEmoji}>{muscle.emoji}</Text>
                    <Text
                      style={[
                        styles.muscleLabel,
                        isSelected && styles.muscleLabelActive,
                      ]}
                    >
                      {muscle.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rep Range & Goal</Text>
            <View style={styles.optionGrid}>
              {goalOptions.map((option) =>
                renderChip(option, selectedGoal === option.id, () => setSelectedGoal(option.id)),
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Workout Duration</Text>
            <View style={styles.optionGrid}>
              {durationOptions.map((option) =>
                renderChip(
                  option,
                  selectedDuration === option.id,
                  () => setSelectedDuration(option.id),
                ),
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience Level</Text>
            <View style={styles.optionGrid}>
              {experienceOptions.map((option) =>
                renderChip(
                  option,
                  selectedExperience === option.id,
                  () => setSelectedExperience(option.id),
                ),
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9}>
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Generate Workout Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const PRIMARY = '#2563ff';
const CARD_BORDER = '#e5e7eb';
const TEXT_MUTED = '#6b7280';

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
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#475467',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  muscleCard: {
    width: '30%',
    minWidth: 90,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  muscleCardActive: {
    backgroundColor: '#eef2ff',
    borderColor: PRIMARY,
  },
  muscleEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  muscleLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  muscleLabelActive: {
    color: PRIMARY,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    flexGrow: 1,
    minWidth: '30%',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  optionChipActive: {
    borderColor: PRIMARY,
    backgroundColor: '#eef2ff',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  optionLabelActive: {
    color: PRIMARY,
  },
  optionSubLabel: {
    marginTop: 2,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  optionSubLabelActive: {
    color: PRIMARY,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
