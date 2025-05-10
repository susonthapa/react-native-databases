import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: isDark ? '#4d9be6' : '#3498db',
        tabBarInactiveTintColor: isDark ? '#718096' : '#95a5a6',
        tabBarStyle: {
          backgroundColor: isDark ? '#1a202c' : '#fff',
          borderTopColor: isDark ? '#2d3748' : '#e2e8f0',
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontWeight: Platform.OS === 'ios' ? '500' : 'bold',
          fontSize: 12,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
