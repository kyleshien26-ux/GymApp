import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

export default function Help() {
  const router = useRouter();

  const sections = [
    {
      title: 'Getting Started',
      content: 'Start by setting up your profile in the Settings tab. Input your biometric data to calibrate the nutrition engine. Then, head to the "Planner" tab to generate your first split.',
    },
    {
      title: 'How the AI Planner Works',
      content: 'The planner uses a priority-based allocation algorithm. It first analyzes your "Weak Points" and reserves volume for them. Then, it fills the remaining "Recovery Capacity" (set cap) with compound movements sorted by tiers (S-Tier to B-Tier).',
    },
    {
      title: 'Scientific Suggestions',
      content: 'The "Suggestion" banner in the logger uses "Progressive Overload" logic. It looks at your most recent performance for that specific exercise. If you hit the top of your rep range, it calculates a micro-load increase (1.25kg - 2.5kg) to ensure continuous adaptation.',
    },
    {
      title: 'Nutrition & TDEE',
      content: 'Your nutritional targets are calculated using the Mifflin-St Jeor equation adjusted for your specific activity level. The macro split is prioritized: Protein first (2.0g/kg), then Fats (0.8g/kg), with the remainder allocated to Carbs.',
    },
    {
      title: 'Rest Timers',
      content: 'Rest times are adaptive. Compound heavy lifts trigger a longer (3-5 min) timer to allow ATP replenishment. Isolation movements trigger shorter (1-2 min) intervals to maximize metabolic stress.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Guide</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={20} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { padding: 20, paddingBottom: 40 },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sectionContent: { fontSize: 14, color: colors.muted, lineHeight: 22 },
});