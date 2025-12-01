import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';
import { colors } from '../../constants/colors';

export default function DataManagement() {
  const router = useRouter();
  const { workouts, clearStore } = useWorkouts();
  const { exportData, importData } = useSettings();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const estimatedDataSize = formatBytes(JSON.stringify(workouts).length);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const csv = await exportData();
      await Share.share({
        message: csv,
        title: 'GymApp Backup',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    setIsImporting(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/csv',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const response = await fetch(fileUri);
        const json = await response.text();

        const success = await importData(json);
        if (success) {
          Alert.alert('Success', 'Data imported successfully. Please restart the app to see changes.');
        } else {
          Alert.alert('Error', 'Invalid backup file format.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Clear All Data',
      `Are you sure you want to delete all ${workouts.length} workouts? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await clearStore();
              Alert.alert('Data Cleared', 'All workouts have been deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            } finally {
              setIsDeleting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Storage Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Total Workouts</Text>
                <Text style={styles.infoDescription}>Number of logged sessions</Text>
              </View>
              <Text style={styles.infoValue}>{workouts.length}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Estimated Size</Text>
                <Text style={styles.infoDescription}>Local storage usage</Text>
              </View>
              <Text style={styles.infoValue}>{estimatedDataSize}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Total Exercises</Text>
                <Text style={styles.infoDescription}>Unique exercises logged</Text>
              </View>
              <Text style={styles.infoValue}>
                {new Set(workouts.flatMap(w => w.exercises.map(e => e.name))).size}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Total Volume</Text>
                <Text style={styles.infoDescription}>Cumulative weight × reps</Text>
              </View>
              <Text style={styles.infoValue}>
                {(workouts.reduce((sum, w) => sum + w.totalVolume, 0) / 1000).toFixed(1)}k kg
              </Text>
            </View>
          </View>
        </View>

        {/* Backup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportData}
            disabled={isExporting}
          >
            {isExporting ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name="cloud-download-outline" size={20} color={colors.primary} />
            )}
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Export Data</Text>
              <Text style={styles.actionDescription}>Save workout data as CSV</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleImportData}
            disabled={isImporting}
          >
            {isImporting ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            )}
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>Import Data</Text>
              <Text style={styles.actionDescription}>Restore from backup file</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetData}
            disabled={isDeleting || workouts.length === 0}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <View style={styles.actionContent}>
              <Text style={styles.dangerLabel}>Delete All Workouts</Text>
              <Text style={styles.dangerDescription}>Permanently remove all logged data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.danger} />
          </TouchableOpacity>

          {workouts.length === 0 && (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyText}>No workouts to delete</Text>
            </View>
          )}
        </View>

        {/* Info Message */}
        <View style={styles.infoMessage}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.messageText}>
            All your data is stored locally on this device. Clearing data cannot be undone. Please back up
            important information before deleting.
          </Text>
        </View>
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
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 12,
    color: colors.muted,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  dangerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.danger,
  },
  dangerDescription: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
    opacity: 0.8,
  },
  emptyMessage: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: colors.muted,
  },
  infoMessage: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 12,
    gap: 10,
    marginTop: 16,
  },
  messageText: {
    flex: 1,
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
  },
});
