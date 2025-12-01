import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';

export default function Notifications() {
  const router = useRouter();
  const { settings, updateNotifications } = useSettings();

  const [workoutReminders, setWorkoutReminders] = useState(settings.notifications.workoutReminders);
  const [reminderTime, setReminderTime] = useState(settings.notifications.reminderTime);
  const [restDayNotifications, setRestDayNotifications] = useState(settings.notifications.restDayNotifications);

  useEffect(() => {
    setWorkoutReminders(settings.notifications.workoutReminders);
    setReminderTime(settings.notifications.reminderTime);
    setRestDayNotifications(settings.notifications.restDayNotifications);
  }, [settings.notifications]);

  const notificationSettings = [
    {
      id: 'workout-reminder',
      label: 'Workout Reminders',
      description: 'Daily reminders to log your workouts',
      icon: 'barbell',
      enabled: workoutReminders,
      onToggle: () => setWorkoutReminders(!workoutReminders),
    },
    {
      id: 'rest-day',
      label: 'Rest Day Alerts',
      description: 'Reminders on scheduled rest days',
      icon: 'bed-outline',
      enabled: restDayNotifications,
      onToggle: () => setRestDayNotifications(!restDayNotifications),
    },
  ];

  const handleSave = async () => {
    await updateNotifications({
      workoutReminders,
      reminderTime,
      restDayNotifications,
    });
    Alert.alert('Saved', 'Your notification preferences have been saved.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Notifications</Text>
          {notificationSettings.map((setting) => (
            <View key={setting.id} style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name={setting.icon as any}
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={setting.onToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            You can customize when and how you receive notifications in your device settings.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Notification Settings</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
