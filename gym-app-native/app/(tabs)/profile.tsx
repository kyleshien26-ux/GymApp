import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { useSettings } from '../../providers/SettingsProvider';
import { getStats, useWorkouts } from '../../providers/WorkoutsProvider';
import { PromptModal } from '../../components/ui';

export default function Profile() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const { workouts } = useWorkouts();
  const stats = getStats(workouts);
  const [isUsernameModalVisible, setIsUsernameModalVisible] = useState(false);

  // Safe access to personal records
  const prCount = Object.keys(settings?.personalRecords || {}).length;

  const handleGoalChange = () => {
    // Navigate to profile settings instead of alert
    router.push('/settings/profile');
  };

  const currentGoal = settings.userProfile?.nutritionGoal || settings.userGoal || 'Fitness';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings/notifications')}>
          <Ionicons name="settings-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={{fontSize: 32}}>{settings.userProfile?.avatar || '💪'}</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => setIsUsernameModalVisible(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.userName}>{settings.username}</Text>
              <Ionicons name="pencil" size={16} style={{marginLeft: 8}} color={colors.muted}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGoalChange}>
              <Text style={styles.userGoal}>{currentGoal} Phase <Ionicons name="chevron-forward" size={12}/></Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{prCount}</Text>
            <Text style={styles.statLabel}>PRs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/profile')}>
            <View style={styles.menuIcon}><Ionicons name="person-outline" size={20} color="#0ea5e9"/></View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/data')}>
            <View style={styles.menuIcon}><Ionicons name="server-outline" size={20} color="#6366f1"/></View>
            <Text style={styles.menuText}>Data Management</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings/about')}>
            <View style={styles.menuIcon}><Ionicons name="information-circle-outline" size={20} color={colors.muted}/></View>
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.muted}/>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <PromptModal
        visible={isUsernameModalVisible}
        title="Change Username"
        defaultValue={settings.username}
        placeholder="Enter new username"
        onCancel={() => setIsUsernameModalVisible(false)}
        onSubmit={(newName) => {
          if (newName.trim()) updateSettings({ username: newName.trim() });
          setIsUsernameModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems:'center', paddingHorizontal: 20, paddingBottom: 10, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  content: { padding: 20 },
  userCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.card, borderWidth:1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  userGoal: { fontSize: 14, color: colors.primary, marginTop: 4, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, backgroundColor: '#fff', padding: 20, borderRadius: 16, shadowColor:'#000', shadowOpacity:0.05, shadowRadius:10 },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 22, fontWeight: 'bold', color: colors.text },
  statLabel: { color: colors.muted, fontSize: 12, marginTop: 4 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  menuIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '500', color: colors.text }
});