import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';

export default function ProfileScreen() {
  const { clearStore, loading } = useWorkouts();

  const stats = [
    { label: 'Workouts', value: '47' },
    { label: 'Streak', value: '8 days' },
    { label: 'Weight', value: '75 kg' },
  ];

  const menuItems = [
    { icon: 'person-outline', label: 'Profile Settings' },
    { icon: 'fitness-outline', label: 'Workout Preferences' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About' },
  ];

  const handleReset = () => {
    Alert.alert(
      'Reset stored data',
      'This will clear all saved workouts on this device. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await clearStore();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>KS</Text>
          </View>
          <Text style={styles.name}>Kyle Shien</Text>
          <Text style={styles.joinDate}>Member since November 2024</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.85}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.85} onPress={handleReset} disabled={loading}>
            <View style={styles.menuLeft}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text style={[styles.menuText, { color: colors.danger }]}>Reset stored workouts</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  joinDate: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
