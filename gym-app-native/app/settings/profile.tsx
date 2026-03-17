import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings, Gender, ActivityLevel, NutritionGoal } from '../../providers/SettingsProvider';

const AVATARS = ['💪', '🏋️', '🏃', '🧘', '🚴', '⚡', '🔥', '🎯', '🏆', '⭐', '🦾', '🥇'];

export default function ProfileSettings() {
  const router = useRouter();
  const { settings, updateSettings, updateUserProfile } = useSettings();
  
  const [username, setUsername] = useState(settings.username || '');
  const [age, setAge] = useState(settings.userProfile.age.toString());
  const [height, setHeight] = useState(settings.userProfile.height.toString());
  const [weight, setWeight] = useState(settings.userProfile.currentWeight.toString());
  const [gender, setGender] = useState<Gender>(settings.userProfile.gender);
  const [activity, setActivity] = useState<ActivityLevel>(settings.userProfile.activityLevel);
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal>(settings.userProfile.nutritionGoal);
  const [goal, setGoal] = useState<'Strength' | 'Hypertrophy' | 'Endurance'>(settings.userGoal || 'Hypertrophy');
  
  const [avatar, setAvatar] = useState('💪');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setUsername(settings.username || '');
    setAge(settings.userProfile.age.toString());
    setHeight(settings.userProfile.height.toString());
    setWeight(settings.userProfile.currentWeight.toString());
    setGender(settings.userProfile.gender);
    setActivity(settings.userProfile.activityLevel);
    setNutritionGoal(settings.userProfile.nutritionGoal);
    setGoal(settings.userGoal || 'Hypertrophy');
  }, [settings]);

  const trainingGoals: ('Strength' | 'Hypertrophy' | 'Endurance')[] = ['Strength', 'Hypertrophy', 'Endurance'];
  const nutritionGoals: NutritionGoal[] = ['Cut', 'Bulk', 'Recomp'];
  const activityLevels: ActivityLevel[] = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'];

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        username: username.trim(),
        userGoal: goal,
      });
      
      await updateUserProfile({
        age: parseInt(age) || 0,
        height: parseFloat(height) || 0,
        currentWeight: parseFloat(weight) || 0,
        gender,
        activityLevel: activity,
        nutritionGoal,
        avatar, // Include the avatar emoji in the update
      });

      Alert.alert('Success', 'Your profile settings have been saved.');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const renderSelectGroup = (label: string, options: string[], current: string, setFunc: (val: any) => void) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, current === opt && styles.chipActive]}
            onPress={() => setFunc(opt)}
          >
            <Text style={[styles.chipText, current === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

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
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity 
            style={styles.avatarPlaceholder}
            onPress={() => setShowAvatarPicker(true)}
          >
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowAvatarPicker(true)}>
            <Text style={styles.avatarNote}>Tap to change avatar</Text>
          </TouchableOpacity>
        </View>

        {/* Identity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              placeholderTextColor={colors.muted}
            />
          </View>

          {renderSelectGroup('Gender', ['Male', 'Female'], gender, setGender)}
        </View>

        {/* Body Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
              <Text style={styles.label}>Age</Text>
              <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
            </View>
            <View style={[styles.inputGroup, {flex: 1}]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" />
          </View>
        </View>

        {/* Goals & Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & Lifestyle</Text>
          {renderSelectGroup('Training Goal', trainingGoals, goal, setGoal)}
          {renderSelectGroup('Nutrition Goal', nutritionGoals, nutritionGoal, setNutritionGoal)}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Activity Level</Text>
            <View style={{ gap: 8 }}>
                {activityLevels.map((lvl) => (
                    <TouchableOpacity key={lvl} style={[styles.optionRow, activity === lvl && styles.optionRowActive]} onPress={() => setActivity(lvl)}>
                        <Text style={[styles.optionText, activity === lvl && styles.optionTextActive]}>{lvl}</Text>
                        {activity === lvl && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                    </TouchableOpacity>
                ))}
            </View>
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

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.avatarOption,
                    avatar === emoji && styles.avatarOptionSelected,
                  ]}
                  onPress={() => {
                    setAvatar(emoji);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Text style={styles.avatarOptionEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAvatarPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarNote: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
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
  row: {
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRowActive: {
    borderColor: colors.primary,
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  avatarOptionEmoji: {
    fontSize: 32,
  },
  modalClose: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: colors.muted,
    fontWeight: '600',
    fontSize: 15,
  },
});
