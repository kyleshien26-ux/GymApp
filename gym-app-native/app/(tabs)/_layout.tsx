import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="progress" 
        options={{ 
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="templates" 
        options={{ 
          title: 'Templates',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen
        name="autoplan"
        options={{
          title: 'Planner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="options" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="nutrition" 
        options={{ 
          title: 'Nutrition',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}
