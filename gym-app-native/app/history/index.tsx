import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { formatDateLabel } from '../../lib/workout-planner';
import { Workout } from '../../types/workouts';

export default function History() {
  const router = useRouter();
  const { workouts } = useWorkouts();

  const renderItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push({ pathname: '/history/detail', params: { id: item.id } })}>
      <View>
        <Text style={styles.cardTitle}>{formatDateLabel(item.performedAt)}</Text>
        <Text style={styles.cardSub}>{item.title}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.meta}>{item.totalSets} sets</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={workouts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={48} color={colors.muted} />
            <Text style={styles.empty}>No workouts yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  emptyContainer: { alignItems: 'center', marginTop: 60, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted, fontSize: 16 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardSub: { color: colors.muted, fontSize: 13, marginTop: 4 },
  meta: { color: colors.muted, marginRight: 8, fontSize: 12 }
});