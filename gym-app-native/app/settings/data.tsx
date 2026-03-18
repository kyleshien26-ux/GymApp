import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';
import { colors } from '../../constants/colors';

export default function DataManagement() {
  const router = useRouter();
  const { workouts, templates, clearStore } = useWorkouts();
  const { exportData, importData, clearStore: clearSettings } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const json = await exportData();
      
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gymapp_export.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await Share.share({
            message: json,
            title: 'GymApp Backup'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/plain'],
      });

      if (result.canceled) return;

      setIsImporting(true);
      const file = result.assets[0];
      const response = await fetch(file.uri);
      const text = await response.text();
      
      const success = await importData(text);
      if (success) {
        Alert.alert('Success', 'Data imported successfully. Please restart the app.');
      } else {
        Alert.alert('Error', 'Invalid file format.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm('This will delete ALL data (workouts, templates, settings). This cannot be undone. Are you sure?');
      if (confirm) confirmDelete();
      return;
    }

    Alert.alert(
      'Reset App',
      'This will delete ALL data (workouts, templates, settings). This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: confirmDelete },
      ]
    );
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await clearStore();
      await clearSettings();
      Alert.alert('Reset Complete', 'App data has been cleared.');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to reset data.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        {/* Data Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Current Storage</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{workouts.length}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryNumber}>{templates.length}</Text>
              <Text style={styles.summaryLabel}>Templates</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExport}
            disabled={isExporting}
          >
            <Ionicons name="share-outline" size={20} color={colors.primary} />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Text>
              <Text style={styles.actionDescription}>Share backup file</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleImport}
            disabled={isImporting}
          >
            <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>
                {isImporting ? 'Importing...' : 'Import Data'}
              </Text>
              <Text style={styles.actionDescription}>Restore from backup</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.danger }]}>Danger Zone</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleResetData}
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <View style={styles.actionContent}>
              <Text style={styles.dangerLabel}>
                {isDeleting ? 'Resetting...' : 'Reset App'}
              </Text>
              <Text style={styles.dangerDescription}>Delete all data and settings</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 10,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  content: { padding: 20 },
  summarySection: { marginBottom: 24 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  summaryCards: { flexDirection: 'row', gap: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  summaryNumber: { fontSize: 28, fontWeight: '700', color: colors.primary },
  summaryLabel: { fontSize: 13, color: colors.muted, marginTop: 4 },
  section: { marginBottom: 24 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    gap: 12,
  },
  actionContent: { flex: 1 },
  actionLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  actionDescription: { fontSize: 12, color: colors.muted, marginTop: 2 },
  dangerButton: { borderColor: colors.danger, backgroundColor: '#fef2f2' },
  dangerLabel: { fontSize: 15, fontWeight: '600', color: colors.danger },
  dangerDescription: { fontSize: 12, color: colors.danger, opacity: 0.8, marginTop: 2 },
});