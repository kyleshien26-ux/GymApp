import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';

export default function ProfileScreen() {
  const router = useRouter();
  const { clearStore, loading, workouts } = useWorkouts();
  const { settings } = useSettings();

  const stats = useMemo(() => {
    const workoutStats = workouts.reduce((acc, w) => {
      acc.totalVolume += w.totalVolume;
      acc.totalSets += w.totalSets;
      return acc;
    }, { totalVolume: 0, totalSets: 0 });

    return [
      { label: 'Workouts', value: String(workouts.length) },
      { label: 'Streak', value: `${settings.streak || 0} days` },
      { label: 'Weight', value: `${settings.profile.weight || 0} kg` },
    ];
  }, [workouts, settings]);

  const menuItems = [
    { icon: 'person-outline', label: 'Profile Settings' },
    { icon: 'fitness-outline', label: 'Workout Preferences' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About' },
  ];

  const trackingItems = [
    { icon: 'scale-outline', label: 'Measurements' },
    { icon: 'trophy-outline', label: 'Records' },
  ];

  const handleMeasurements = () => {
    router.push('/measurements');
  };

  const handleRecords = () => {
    router.push('/records');
  };

  const handleMenuPress = (label: string) => {
    switch (label) {
      case 'Profile Settings':
        router.push('/settings/profile');
        break;
      case 'Workout Preferences':
        router.push('/settings/preferences');
        break;
      case 'Notifications':
        router.push('/settings/notifications');
        break;
      case 'Help & Support':
        router.push('/settings/help');
        break;
      case 'About':
        router.push('/settings/about');
        break;
      case 'Measurements':
        handleMeasurements();
        break;
      case 'Records':
        handleRecords();
        break;
      default:
        break;
    }
  };

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
            <Text style={styles.avatarText}>
              {(settings.profile.name || 'User')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </Text>
          </View>
          <Text style={styles.name}>{settings.profile.name || 'User'}</Text>
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

        {settings.badges.filter(b => b.earnedAt).length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.badgesSectionTitle}>Achievements</Text>
            <View style={styles.badgesGrid}>
              {settings.badges
                .filter(b => b.earnedAt)
                .map((badge) => (
                  <View key={badge.id} style={styles.badgeItem}>
                    <View style={styles.badgeIcon}>
                      <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                    </View>
                    <Text style={styles.badgeName}>{badge.name}</Text>
                    <Text style={styles.badgeDate}>
                      {new Date(badge.earnedAt!).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        <View style={styles.menuCard}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => handleMenuPress(item.label)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuCard}>
          {trackingItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => handleMenuPress(item.label)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.85}
            onPress={() => router.push('/settings/data')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="folder-outline" size={20} color={colors.primary} />
              <Text style={styles.menuText}>Data Management</Text>
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
  badgesSection: {
    marginBottom: 12,
  },
  badgesSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    alignItems: 'center',
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff9e6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeEmoji: {
    fontSize: 28,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    color: colors.muted,
  },
});
