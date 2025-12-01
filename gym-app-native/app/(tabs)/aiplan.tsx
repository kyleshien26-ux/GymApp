import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { Card, SectionHeader } from '../../components/ui';
import { buildPlanFromHistory, useWorkouts } from '../../providers/WorkoutsProvider';
import { ExperienceLevel, Goal, PlanResult } from '../../types/workouts';

type Option = {
  id: string;
  label: string;
  subLabel?: string;
};

export default function AiPlan() {
  const { workouts } = useWorkouts();
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(['Chest', 'Back']);
  const [selectedGoal, setSelectedGoal] = useState<Goal>('Muscle Size');
  const [selectedDuration, setSelectedDuration] = useState('45-60 min');
  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>('Intermediate');
  const [plan, setPlan] = useState<PlanResult | null>(null);

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

  const handleGenerate = () => {
    const nextPlan = buildPlanFromHistory(workouts, {
      goal: selectedGoal,
      duration: selectedDuration,
      experience: selectedExperience,
      muscles: selectedMuscles,
    });
    setPlan(nextPlan);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Workout Planner</Text>
          <Text style={styles.subtitle}>Generate personalized workout plans with history-aware rules</Text>
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
                renderChip(option, selectedGoal === option.id, () => setSelectedGoal(option.id as Goal)),
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
                  () => setSelectedExperience(option.id as ExperienceLevel),
                ),
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handleGenerate}>
            <Ionicons name="sparkles" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Generate Workout Plan</Text>
          </TouchableOpacity>
        </View>

        {plan ? (
          <View style={[styles.card, { marginTop: 14 }]}>
            <SectionHeader title="Recommended Structure" />
            <View style={styles.summaryGrid}>
              <View style={styles.summaryTile}>
                <Text style={styles.summaryLabel}>Sessions / week</Text>
                <Text style={styles.summaryValue}>{plan.sessionsPerWeek}</Text>
              </View>
              <View style={styles.summaryTile}>
                <Text style={styles.summaryLabel}>Sets / exercise</Text>
                <Text style={styles.summaryValue}>{plan.setsPerExercise}</Text>
              </View>
              <View style={styles.summaryTile}>
                <Text style={styles.summaryLabel}>Rep range</Text>
                <Text style={styles.summaryValue}>{plan.repRange}</Text>
              </View>
              <View style={styles.summaryTile}>
                <Text style={styles.summaryLabel}>Rest</Text>
                <Text style={styles.summaryValue}>{plan.restRange}</Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Per muscle focus</Text>
            {plan.recommendations.map((rec) => (
              <View key={rec.focus} style={styles.recRow}>
                <View>
                  <Text style={styles.recTitle}>{rec.focus}</Text>
                  <Text style={styles.recSub}>{rec.rationale}</Text>
                </View>
                <Text style={styles.recBadge}>
                  {rec.sets} x {rec.reps}
                </Text>
              </View>
            ))}
            {!!plan.adjustments.length && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Adjustments</Text>
                {plan.adjustments.map((item) => (
                  <View key={item} style={styles.adjustmentRow}>
                    <Ionicons name="bulb-outline" size={16} color={colors.primary} />
                    <Text style={styles.adjustmentText}>{item}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
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
    borderColor: colors.border,
  },
  muscleCardActive: {
    backgroundColor: '#eef2ff',
    borderColor: colors.primary,
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
    color: colors.primary,
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
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  optionChipActive: {
    borderColor: colors.primary,
    backgroundColor: '#eef2ff',
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  optionLabelActive: {
    color: colors.primary,
  },
  optionSubLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
  },
  optionSubLabelActive: {
    color: colors.primary,
  },
  primaryButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  summaryTile: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  recRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  recSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  recBadge: {
    backgroundColor: '#eef2ff',
    color: colors.primary,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  adjustmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  adjustmentText: {
    color: colors.text,
    fontSize: 13,
    flex: 1,
  },
});
