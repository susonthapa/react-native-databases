import 'react-native-get-random-values';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DBProvider } from '@/providers/DBProvider';
import { initializeDB } from '@/src/db';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      await initializeDB();
      setDbInitialized(true);
    }
    init();
  }, []);

  if (!loaded || !dbInitialized) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <DBProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DBProvider>
  );
}
