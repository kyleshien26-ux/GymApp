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

export default function Preferences() {
  const router = useRouter();
  const { settings, updatePreferences } = useSettings();

  const [restTimer, setRestTimer] = useState(settings.preferences.defaultRestTimer);
  const [units, setUnits] = useState<'kg' | 'lbs'>(settings.preferences.units);
  const [rpeEnabled, setRpeEnabled] = useState(settings.preferences.rpeEnabled);
  const [autoIncrement, setAutoIncrement] = useState(settings.preferences.autoIncrement);

  useEffect(() => {
    setRestTimer(settings.preferences.defaultRestTimer);
    setUnits(settings.preferences.units);
    setRpeEnabled(settings.preferences.rpeEnabled);
    setAutoIncrement(settings.preferences.autoIncrement);
  }, [settings.preferences]);

  const handleSave = async () => {
    await updatePreferences({
      defaultRestTimer: restTimer,
      units,
      rpeEnabled,
      autoIncrement,
    });
    Alert.alert('Saved', 'Your workout preferences have been updated.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workout Preferences</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Rest Timer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Default Rest Timer</Text>
            <Text style={styles.sectionValue}>{restTimer}s</Text>
          </View>
          <View style={styles.timerButtons}>
            {[30, 45, 60, 90, 120].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timerButton,
                  restTimer === time && styles.timerButtonActive,
                ]}
                onPress={() => setRestTimer(time)}
              >
                <Text
                  style={[
                    styles.timerButtonText,
                    restTimer === time && styles.timerButtonTextActive,
                  ]}
                >
                  {time}s
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Units Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Units</Text>
          <View style={styles.unitButtons}>
            {(['kg', 'lbs'] as const).map((unit) => (
              <TouchableOpacity
                key={unit}
                style={[
                  styles.unitButton,
                  units === unit && styles.unitButtonActive,
                ]}
                onPress={() => setUnits(unit)}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    units === unit && styles.unitButtonTextActive,
                  ]}
                >
                  {unit.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Workout Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Features</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.settingLabel}>Enable RPE</Text>
                <Text style={styles.settingDescription}>Track rate of perceived exertion</Text>
              </View>
            </View>
            <Switch
              value={rpeEnabled}
              onValueChange={setRpeEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="trending-up" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.settingLabel}>Auto-Increment Weights</Text>
                <Text style={styles.settingDescription}>Automatically suggest weight increases</Text>
              </View>
            </View>
            <Switch
              value={autoIncrement}
              onValueChange={setAutoIncrement}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
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
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  timerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timerButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timerButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  timerButtonTextActive: {
    color: '#fff',
  },
  unitButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
  },
  unitButtonTextActive: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
