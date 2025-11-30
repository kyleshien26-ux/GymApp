import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const BORDER = '#e5e7eb';
const MUTED = '#475467';

const workouts = [
  {
    id: 1,
    dateLabel: 'Sunday, November 9, 2025',
    duration: '1 min',
    volume: '2140 kg',
    sets: 6,
  },
  {
    id: 2,
    dateLabel: 'Sunday, November 9, 2025',
    duration: '0',
    volume: '0 kg',
    sets: 0,
  },
  {
    id: 3,
    dateLabel: 'Sunday, November 9, 2025',
    duration: '0',
    volume: '0 kg',
    sets: 0,
  },
];

export default function History() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <TouchableOpacity activeOpacity={0.8}>
            <Ionicons name="calendar-outline" size={22} color={MUTED} />
          </TouchableOpacity>
        </View>

        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            style={styles.card}
            onPress={() => router.push(`/history/detail?id=${workout.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="calendar-outline" size={18} color="#0f172a" />
                <Text style={styles.cardTitle}>{workout.dateLabel}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={MUTED} /> {workout.duration}
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="trending-up-outline" size={14} color={MUTED} /> {workout.volume}
              </Text>
              <Text style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={14} color={MUTED} /> {workout.sets} sets
              </Text>
            </View>
          </TouchableOpacity>
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
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metaItem: {
    fontSize: 13,
    color: MUTED,
  },
});
