import React from 'react';
import { Stack } from 'expo-router';
import { WorkoutsProvider } from '../providers/WorkoutsProvider';

export default function RootLayout() {
  return (
    <WorkoutsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </WorkoutsProvider>
  );
}
