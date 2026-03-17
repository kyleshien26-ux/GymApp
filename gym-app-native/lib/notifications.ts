import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // We only need local permissions for the rest timer
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return;
  }

  // We do NOT call getExpoPushTokenAsync() here because it requires 
  // an EAS Project ID, which is not needed for local IA project notifications.  return null;
}

export async function scheduleRestNotification(restTimeInSeconds: number) {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Rest time is over!",
      body: "Time to start your next set.",
    },
    trigger: { 
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: restTimeInSeconds 
    },
  });
}

export async function cancelAllNotifications() {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}