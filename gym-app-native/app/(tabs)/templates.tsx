import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';

export default function Templates() {
  const router = useRouter();
  const { templates, deleteTemplate } = useWorkouts();

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

        {templates.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-outline"
              size={48}
              color={colors.muted}
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.emptyTitle}>No templates yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first workout template to save time logging sessions
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/templates/edit')}
            >
              <Ionicons name="add" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.createButtonText}>Create Template</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Your Templates</Text>
            {templates.map((template) => (
              <View key={template.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{template.name}</Text>
                    <Text style={styles.cardDescription}>{template.description || 'No description'}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.exerciseLink}
                  activeOpacity={0.85}
                >
                  <Text style={styles.exerciseCount}>{template.exercises.length} exercises</Text>
                </TouchableOpacity>

                {template.exercises.length ? (
                  <View style={styles.previewList}>
                    {template.exercises.slice(0, 3).map((exercise) => (
                      <Text key={exercise.id} style={styles.previewItem}>
                        • {exercise.name}
                      </Text>
                    ))}
                    {template.exercises.length > 3 && (
                      <Text style={styles.previewItem}>
                        • +{template.exercises.length - 3} more
                      </Text>
                    )}
                  </View>
                ) : null}

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => router.push({
                      pathname: '/templates/edit',
                      params: { templateId: template.id }
                    })}
                  >
                    <Text style={styles.secondaryButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => {
                      Alert.alert(
                        'Delete Template',
                        `Delete "${template.name}"?`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: async () => {
                              await deleteTemplate(template.id);
                            },
                          },
                        ],
                      );
                    }}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.muted} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
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
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text,
  },
  cardDescription: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  exerciseLink: {
    marginTop: 10,
  },
  exerciseCount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
  previewList: {
    marginTop: 8,
  },
  previewItem: {
    fontSize: 13,
    color: colors.text,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
