import 'react-native-get-random-values';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DBProvider } from '@/providers/DBProvider';
import { initializeDB } from '@/src/db';
import { SheetProvider } from 'react-native-actions-sheet';
import '../sheets'; // Ensure this is imported to register sheets

// Import hooks and providers needed for action sheet context

function AppContent() {
  const colorScheme = useColorScheme();


  return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SheetProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </SheetProvider>
      </ThemeProvider>
  );
}

export default function RootLayout() {
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
    // Async font loading or DB initialization is not complete.
    return null;
  }

  return (
    <DBProvider>
      <AppContent />
    </DBProvider>
  );
}
