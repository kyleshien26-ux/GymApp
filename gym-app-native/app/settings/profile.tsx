import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';

export default function ProfileSettings() {
  const router = useRouter();
  const { settings, updateProfile, loading } = useSettings();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('0');
  const [weight, setWeight] = useState('0');
  const [height, setHeight] = useState('0');
  const [fitnessGoal, setFitnessGoal] = useState('Build Muscle');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading) {
      setName(settings.profile.name || '');
      setAge(String(settings.profile.age || 0));
      setWeight(String(settings.profile.weight || 0));
      setHeight(String(settings.profile.height || 0));
      setFitnessGoal(settings.profile.fitnessGoal || 'Build Muscle');
    }
  }, [loading, settings.profile]);

  const fitnessGoals = ['Build Muscle', 'Lose Weight', 'Increase Strength', 'Improve Endurance', 'General Fitness'];

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        age: parseInt(age) || 0,
        weight: parseFloat(weight) || 0,
        height: parseFloat(height) || 0,
        fitnessGoal,
      });
      Alert.alert('Success', 'Your profile settings have been saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={colors.primary} />
          </View>
          <Text style={styles.avatarNote}>Profile pictures require iOS photo library access</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="0"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="0"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="0"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Fitness Goal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goal</Text>
          <View style={styles.goalButtons}>
            {fitnessGoals.map((goal) => (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalButton,
                  fitnessGoal === goal && styles.goalButtonActive,
                ]}
                onPress={() => setFitnessGoal(goal)}
              >
                <Text
                  style={[
                    styles.goalButtonText,
                    fitnessGoal === goal && styles.goalButtonTextActive,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Text>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarNote: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  goalButtons: {
    gap: 10,
  },
  goalButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  goalButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
