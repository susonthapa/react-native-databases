import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useTask } from '../../../hooks/useTask';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    task,
    subTasks,
    isLoading,
    toggleTaskCompleted,
    deleteTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
  } = useTask(id);
  
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [newSubTaskText, setNewSubTaskText] = React.useState('');

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, isDark && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={isDark ? '#4d9be6' : '#3498db'} />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.errorTextDark]}>Task not found.</Text>
        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  const handleAddSubTaskLocal = () => {
    if (newSubTaskText.trim() && task) {
      addSubTask(newSubTaskText.trim());
      setNewSubTaskText('');
    }
  };
  
  const handleDeleteTask = async () => {
    await deleteTask();
    router.back();
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backNavButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#4d9be6' : '#3498db'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>{task.text}</Text>
        <TouchableOpacity onPress={handleDeleteTask} style={styles.deleteTaskButton}>
          <Ionicons name="trash-outline" size={24} color={isDark ? '#ff6b6b' : '#ff4757'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.statusContainer, isDark && styles.statusContainerDark]}>
        <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>Status:</Text>
        <TouchableOpacity onPress={toggleTaskCompleted} style={styles.statusTouchable}>
          <Ionicons 
            name={task.completed ? 'checkbox' : 'square-outline'} 
            size={24} 
            color={task.completed ? '#4CAF50' : (isDark ? '#ccc' : '#666')} 
          />
          <Text style={[styles.statusText, task.completed && styles.completedText, isDark && styles.statusTextDark]}>
            {task.completed ? 'Completed' : 'Pending'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.createdAt, isDark && styles.createdAtDark]}>
        Created: {new Date(task.createdAt).toLocaleString()}
      </Text>

      <View style={styles.subTasksSection}>
        <Text style={[styles.subTasksTitle, isDark && styles.subTasksTitleDark]}>Sub-tasks</Text>
        {subTasks.length > 0 ? (
          subTasks.map(subTask => (
            <View key={subTask.id} style={[styles.subTaskRow, isDark && styles.subTaskRowDark]}>
              <TouchableOpacity onPress={() => toggleSubTask(subTask.id, subTask.completed)} style={styles.checkbox}>
                <Ionicons 
                  name={subTask.completed ? 'checkbox-outline' : 'square-outline'} 
                  size={20} 
                  color={subTask.completed ? '#4CAF50' : (isDark ? '#aaa' : '#888')} 
                />
              </TouchableOpacity>
              <Text style={[
                styles.subTaskText, 
                subTask.completed && styles.completedText,
                isDark && styles.subTaskTextDark
              ]}>
                {subTask.text}
              </Text>
              <TouchableOpacity onPress={() => deleteSubTask(subTask.id)} style={styles.deleteButton}>
                <Ionicons name="trash-bin-outline" size={18} color={isDark ? '#ff6b6b' : '#ff4757'} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={[styles.noSubTasksText, isDark && styles.noSubTasksTextDark]}>No sub-tasks yet.</Text>
        )}
        <View style={styles.addSubTaskRow}>
          <TextInput
            style={[styles.subTaskInput, isDark && styles.subTaskInputDark]}
            placeholder="Add a new sub-task..."
            placeholderTextColor={isDark ? '#757d8a' : '#999'}
            value={newSubTaskText}
            onChangeText={setNewSubTaskText}
            onSubmitEditing={handleAddSubTaskLocal}
          />
          <TouchableOpacity 
            style={[styles.addSubTaskButton, !newSubTaskText.trim() && styles.buttonDisabled]} 
            onPress={handleAddSubTaskLocal}
            disabled={!newSubTaskText.trim()}
          >
            <Ionicons 
              name="add-circle" 
              size={28} 
              color={!newSubTaskText.trim() ? (isDark ? '#555' : '#ccc') : (isDark ? '#4d9be6' : '#3498db')} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingContainerDark: {
    backgroundColor: '#1a202c',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#1a202c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backNavButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  titleDark: {
    color: '#ecf0f1',
  },
  deleteTaskButton: {
    padding: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  statusContainerDark: {
    backgroundColor: '#2c3e50',
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    color: '#333',
  },
  statusLabelDark: {
    color: '#ecf0f1',
  },
  statusTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  statusTextDark: {
    color: '#ecf0f1',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  createdAt: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createdAtDark: {
    color: '#aaa',
  },
  subTasksSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  subTasksSectionDark: {
    backgroundColor: '#2c3e50',
  },
  subTasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  subTasksTitleDark: {
    color: '#ecf0f1',
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  subTaskRowDark: {
    borderBottomColor: '#3a4a5b',
  },
  checkbox: {
    marginRight: 10,
  },
  subTaskText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  subTaskTextDark: {
    color: '#ecf0f1',
  },
  deleteButton: {
    padding: 5,
  },
  noSubTasksText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingVertical: 10,
  },
  noSubTasksTextDark: {
    color: '#aaa',
  },
  addSubTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addSubTaskRowDark: {
     borderTopColor: '#3a4a5b',
  },
  subTaskInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 8,
  },
  subTaskInputDark: {
    backgroundColor: '#3a4a5b',
    color: '#ecf0f1',
  },
  addSubTaskButton: {
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorTextDark: {
    color: '#ff8a80',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 