import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY = '#2563ff';
const BORDER = '#e5e7eb';
const MUTED = '#6b7280';

type Template = {
  id: number;
  name: string;
  description: string;
  exercises: number;
  favorite?: boolean;
  preview: string[];
};

export default function Templates() {
  const router = useRouter();

  const templates: Template[] = [
    {
      id: 1,
      name: 'Push Day',
      description: 'Chest, shoulders, and triceps',
      exercises: 6,
      favorite: true,
      preview: ['Lat Pulldown'],
    },
    {
      id: 2,
      name: 'Leg Day',
      description: 'Complete lower body workout',
      exercises: 6,
      favorite: true,
      preview: ['Back Squat', 'Leg Press'],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Templates</Text>
            <Text style={styles.subtitle}>Quick start workout routines</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/templates/edit')}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>Favorites</Text>
        {templates.map((template) => (
          <View key={template.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>{template.name}</Text>
                <Text style={styles.cardDescription}>{template.description}</Text>
              </View>
              {template.favorite ? (
                <Ionicons name="star" size={20} color="#f59e0b" />
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.exerciseLink}
              onPress={() => router.push('/templates/picker')}
              activeOpacity={0.85}
            >
              <Text style={styles.exerciseCount}>{template.exercises} exercises</Text>
            </TouchableOpacity>

            {template.preview.length ? (
              <View style={styles.previewList}>
                {template.preview.map((item) => (
                  <Text key={item} style={styles.previewItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            ) : null}

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => router.push('/templates/edit')}
              >
                <Text style={styles.secondaryButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trash-outline" size={18} color={MUTED} />
              </TouchableOpacity>
            </View>
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
  },
  content: {
    padding: 20,
    paddingBottom: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: PRIMARY,
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 13,
    color: MUTED,
  },
  exerciseLink: {
    marginTop: 10,
  },
  exerciseCount: {
    fontSize: 14,
    color: PRIMARY,
    fontWeight: '700',
  },
  previewList: {
    marginTop: 8,
  },
  previewItem: {
    fontSize: 13,
    color: '#0f172a',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
