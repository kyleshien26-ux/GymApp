import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Dashboard</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Templates</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/log-workout')}
          >
            <Ionicons name="add-circle" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>Log Workout</Text>
            <Text style={styles.actionSubtitle}>Start a new workout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/history')}
          >
            <Ionicons name="time" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>History</Text>
            <Text style={styles.actionSubtitle}>View past workouts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/exercises')}
          >
            <Ionicons name="barbell" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>Exercises</Text>
            <Text style={styles.actionSubtitle}>Browse exercises</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/measurements')}
          >
            <Ionicons name="body" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>Measurements</Text>
            <Text style={styles.actionSubtitle}>Track body metrics</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard} 
            onPress={() => router.push('/records')}
          >
            <Ionicons name="trophy" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>Records</Text>
            <Text style={styles.actionSubtitle}>Personal bests</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
  },
  actionsContainer: {
    gap: 15,
  },
  actionCard: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 15,
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
});
