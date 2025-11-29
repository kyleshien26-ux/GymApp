import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BORDER = '#e5e7eb';
const MUTED = '#475467';

export default function Records() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Personal Records</Text>
          <TouchableOpacity>
            <Ionicons name="trophy-outline" size={22} color="#f59e0b" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pull-ups</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>72</Text>
            <Text style={styles.unit}>kg (1RM)</Text>
          </View>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.link}>60 kg x 6 reps</Text>
            <Ionicons name="chevron-forward" size={16} color="#2563ff" />
          </TouchableOpacity>
          <Text style={styles.date}>Nov 9, 2025</Text>
        </View>
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
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  unit: {
    fontSize: 13,
    color: MUTED,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  link: {
    color: '#2563ff',
    fontWeight: '700',
    fontSize: 13,
  },
  date: {
    fontSize: 12,
    color: MUTED,
  },
});
