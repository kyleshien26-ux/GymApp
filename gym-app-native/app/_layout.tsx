import React from 'react';
import { Stack } from 'expo-router';
import { WorkoutsProvider } from '../providers/WorkoutsProvider';
import { SettingsProvider } from '../providers/SettingsProvider';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <WorkoutsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Ensure the "tabs" is the main entry point */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Explicitly define the history detail route */}
          <Stack.Screen 
            name="history/detail" 
            options={{ 
              headerShown: true, 
              title: 'Workout Detail',
              headerBackTitle: 'History' 
            }} 
          />
        </Stack>
      </WorkoutsProvider>
    </SettingsProvider>
  );
}