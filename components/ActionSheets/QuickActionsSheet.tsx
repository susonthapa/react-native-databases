import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet, { SheetManager, SheetProps } from 'react-native-actions-sheet';

const QuickActionsSheet = ({ sheetId }: SheetProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleClearCompleted = () => {
    Alert.alert(
      'Clear Completed',
      'Are you sure you want to delete all completed todos?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // This would clear completed todos
            Alert.alert('Success', 'Completed todos cleared!');
            SheetManager.hide(sheetId!);
          },
        },
      ]
    );
  };

  const handleMarkAllComplete = () => {
    Alert.alert('Mark All Complete', 'This would mark all todos as complete');
    SheetManager.hide(sheetId!);
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This would export your todos to a file');
    SheetManager.hide(sheetId!);
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'This would open app settings');
    SheetManager.hide(sheetId!);
  };

  const actions = [
    {
      icon: 'checkmark-done-outline',
      title: 'Mark All Complete',
      action: handleMarkAllComplete,
      color: '#27ae60',
    },
    {
      icon: 'trash-outline',
      title: 'Clear Completed',
      action: handleClearCompleted,
      color: '#e74c3c',
    },
    {
      icon: 'download-outline',
      title: 'Export Data',
      action: handleExportData,
      color: isDark ? '#4d9be6' : '#3498db',
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      action: handleSettings,
      color: isDark ? '#9b59b6' : '#8e44ad',
    },
  ];

  return (
    <ActionSheet id={sheetId} containerStyle={isDark ? styles.containerDark : styles.container}>
      <View style={styles.header}>
        <View style={styles.dragIndicator} />
        <Text style={isDark ? styles.titleDark : styles.title}>Quick Actions</Text>
      </View>

      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={isDark ? [styles.actionItem, styles.actionItemDark] : styles.actionItem}
            onPress={action.action}
          >
            <Ionicons name={action.icon as any} size={24} color={action.color} />
            <Text style={isDark ? styles.actionTextDark : styles.actionText}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  containerDark: {
    backgroundColor: '#2c3e50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  titleDark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionItemDark: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  actionTextDark: {
    marginLeft: 15,
    fontSize: 16,
    color: '#ecf0f1',
  },
});

export default QuickActionsSheet; 