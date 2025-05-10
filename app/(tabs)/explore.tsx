import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View 
      style={[
        styles.container, 
        isDark && styles.containerDark,
        { paddingTop: insets.top }
      ]}
    >
      <Text style={[styles.title, isDark && styles.titleDark]}>
        About This App
      </Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Simple TODO App
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            This is a basic TODO list application built with React Native and Expo.
            It uses React&apos;s useState hook for state management.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            Features
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            • Add new tasks{'\n'}
            • Mark tasks as completed{'\n'}
            • Delete tasks{'\n'}
            • Dark mode support
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
            How to Use
          </Text>
          <Text style={[styles.text, isDark && styles.textDark]}>
            1. Go to the Tasks tab{'\n'}
            2. Enter a new task in the input field{'\n'}
            3. Tap the + button to add it{'\n'}
            4. Tap on the checkbox to mark a task as complete{'\n'}
            5. Tap the trash icon to delete a task
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  containerDark: {
    backgroundColor: '#1a202c',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  titleDark: {
    color: '#ecf0f1',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionDark: {
    backgroundColor: '#2c3e50',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  sectionTitleDark: {
    color: '#ecf0f1',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  textDark: {
    color: '#cbd5e0',
  },
});
