import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WorkoutsProvider, useWorkouts } from '../providers/WorkoutsProvider';
import { SettingsProvider, useSettings } from '../providers/SettingsProvider';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';

// Global Error Boundary for Expo Router
export function ErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorSubtitle}>We've encountered an unexpected error.</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

function AppContent() {
  const { isLoaded: workoutsLoaded } = useWorkouts();
  const { isLoaded: settingsLoaded } = useSettings();

  if (!workoutsLoaded || !settingsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="log-workout/index" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <WorkoutsProvider>
      <SettingsProvider>
        <AppContent />
        <StatusBar style="dark" />
      </SettingsProvider>
    </WorkoutsProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0f172a',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
