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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useWorkouts } from '../../providers/WorkoutsProvider';
import { useSettings } from '../../providers/SettingsProvider';
import { colors } from '../../constants/colors';

export default function DataManagement() {
  const router = useRouter();
  const { workouts, templates, clearStore } = useWorkouts();
  const { exportData, importData } = useSettings();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(title + '\n\n' + message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportData();
      
      if (Platform.OS === 'web') {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'gymapp_export_' + new Date().toISOString().split('T')[0] + '.csv';
        a.click();
        URL.revokeObjectURL(url);
        showAlert('Success', 'Data exported successfully!');
      } else {
        showAlert('Export Ready', 'CSV data has been prepared.');
      }
    } catch (error) {
      showAlert('Error', 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/json', 'text/plain'],
      });

      if (result.canceled) return;

      setIsImporting(true);
      const file = result.assets[0];
      const response = await fetch(file.uri);
      const text = await response.text();
      
      const success = await importData(text);
      if (success) {
        showAlert('Success', 'Data imported successfully. Please restart the app to see changes.');
      } else {
        showAlert('Error', 'Invalid file format. Please use a valid CSV or JSON file.');
      }
    } catch (error) {
      showAlert('Error', 'Failed to import data. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleResetData = () => {
    console.log("[TRACE] handleResetData called, Platform:", Platform.OS);
    if (Platform.OS === 'web') {
      setShowDeleteModal(true);
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to delete all ' + workouts.length + ' workouts and ' + templates.length + ' templates? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  const confirmDelete = async () => {
    console.log("[TRACE] confirmDelete called");
    setShowDeleteModal(false);
    setIsDeleting(true);
    try {
      console.log("[TRACE] Calling clearStore..."); await clearStore(); console.log("[TRACE] clearStore completed");
      showAlert('Success', 'All data has been cleared!');
    } catch (error) {
      showAlert('Error', 'Failed to clear data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
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
        {/* Data Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Your Data</Text>
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

        {/* Export/Import */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Restore</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExport}
            disabled={isExporting}
          >
            <Ionicons name="download-outline" size={20} color={colors.primary} />
            <View style={styles.actionContent}>
              <Text style={styles.actionLabel}>
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Text>
              <Text style={styles.actionDescription}>Download your workouts as CSV</Text>
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
              <Text style={styles.actionDescription}>Restore from CSV or JSON backup</Text>
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
            disabled={isDeleting || (workouts.length === 0 && templates.length === 0)}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <View style={styles.actionContent}>
              <Text style={styles.dangerLabel}>
                {isDeleting ? 'Deleting...' : 'Delete All Data'}
              </Text>
              <Text style={styles.dangerDescription}>Permanently remove all workouts and templates</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal (for web) */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={48} color={colors.danger} style={{ marginBottom: 16 }} />
            <Text style={styles.modalTitle}>Delete All Data?</Text>
            <Text style={styles.modalMessage}>
              This will permanently delete {workouts.length} workouts and {templates.length} templates. This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={confirmDelete}
              >
                <Text style={styles.modalDeleteText}>Delete All</Text>
              </TouchableOpacity>
            </View>
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
  summarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
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
  actionContent: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  dangerButton: {
    borderColor: colors.danger,
    backgroundColor: '#fef2f2',
  },
  dangerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.danger,
  },
  dangerDescription: {
    fontSize: 12,
    color: colors.danger,
    opacity: 0.8,
    marginTop: 2,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  modalDeleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
  },
  modalDeleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
