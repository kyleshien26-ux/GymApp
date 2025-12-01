import React from 'react';
import { Stack } from 'expo-router';
import { WorkoutsProvider } from '../providers/WorkoutsProvider';
import { SettingsProvider } from '../providers/SettingsProvider';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <WorkoutsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            presentation: 'card' as const,
          }}
        />
      </WorkoutsProvider>
    </SettingsProvider>
  );
}
