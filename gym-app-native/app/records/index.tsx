import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';

export default function Records() {
  const router = useRouter();
  const { settings } = useSettings();
  const prs = settings.personalRecords || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Records</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {Object.keys(prs).length === 0 ? (
          <Text style={styles.empty}>No records yet. Log a workout!</Text>
        ) : (
          Object.entries(prs).map(([name, record]) => (
            <View key={name} style={styles.row}>
              <View>
                <Text style={styles.exName}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
                <Text style={styles.date}>{new Date(record.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.weight}>{record.estimated1RM}kg</Text>
                <Text style={styles.sub}>Est. 1RM</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, alignItems: 'center', backgroundColor: colors.card },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: colors.card, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  exName: { fontSize: 16, fontWeight: '600', color: colors.text },
  date: { fontSize: 12, color: colors.muted, marginTop: 4 },
  badge: { alignItems: 'flex-end' },
  weight: { fontSize: 18, fontWeight: '800', color: colors.primary },
  sub: { fontSize: 10, color: colors.muted },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 }
});