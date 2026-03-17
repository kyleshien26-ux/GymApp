import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';

export default function Notifications() {
  const router = useRouter();
  const { settings, updateNotifications } = useSettings();

  const [workoutReminders, setWorkoutReminders] = useState(!!settings.notifications.workoutReminders);
  const [restDayNotifications, setRestDayNotifications] = useState(!!settings.notifications.restDayNotifications);

  useEffect(() => {
    setWorkoutReminders(!!settings.notifications.workoutReminders);
    setRestDayNotifications(!!settings.notifications.restDayNotifications);
  }, [settings.notifications]);

  const handleSave = async () => {
    await updateNotifications({
      workoutReminders,
      restDayNotifications,
    });
    Alert.alert('Saved', 'Your notification preferences have been saved.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="chevron-back" size={24} color={colors.primary} /></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Notifications</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Workout Reminders</Text>
            <Switch value={workoutReminders} onValueChange={setWorkoutReminders} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Rest Day Alerts</Text>
            <Switch value={restDayNotifications} onValueChange={setRestDayNotifications} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Notification Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  section: { backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 15 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  settingLabel: { fontSize: 16, color: colors.text },
  saveButton: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});