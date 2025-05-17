import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SubTaskDocType } from '../models/SubTaskSchema';
import { TodoDocType } from '../models/TodoSchema';

interface TodoProps {
  item: TodoDocType;
  subTasks: SubTaskDocType[];
  onToggle: (item: TodoDocType) => void;
  onDelete: (item: TodoDocType) => void;
  onAddSubTask: (taskId: string, text: string) => void;
  onToggleSubTask: (subTask: SubTaskDocType) => void;
  onDeleteSubTask: (subTask: SubTaskDocType) => void;
}

export const Todo = ({ 
  item, 
  subTasks, 
  onToggle, 
  onDelete, 
  onAddSubTask, 
  onToggleSubTask, 
  onDeleteSubTask 
}: TodoProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [newSubTaskText, setNewSubTaskText] = useState('');

  const handleAddSubTask = () => {
    if (newSubTaskText.trim()) {
      onAddSubTask(item.id, newSubTaskText.trim());
      setNewSubTaskText('');
    }
  };

  const relevantSubTasks = subTasks.filter(st => st.taskId === item.id);

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Link href={`/(tabs)/task/${item.id}`} asChild>
        <TouchableOpacity>
          <View style={styles.todoRow}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={(e) => { 
                e.stopPropagation();
                onToggle(item); 
              }}
            >
              <Ionicons 
                name={item.completed ? 'checkbox' : 'square-outline'} 
                size={24} 
                color={item.completed ? '#4CAF50' : isDark ? '#ccc' : '#666'} 
              />
            </TouchableOpacity>
            
            <Text 
              style={[
                styles.text, 
                item.completed && styles.completedText,
                isDark && styles.textDark
              ]}
            >
              {item.text}
            </Text>
            
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
            >
              <Ionicons name="trash-outline" size={20} color={isDark ? '#ff6b6b' : '#ff4757'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Link>

      {/* Sub-tasks section */}
      <View style={styles.subTasksContainer}>
        {relevantSubTasks.length > 0 && (
          <FlatList
            data={relevantSubTasks}
            keyExtractor={(sub) => sub.id}
            renderItem={({ item: subTask }) => (
              <View style={[styles.subTaskRow, isDark && styles.subTaskRowDark]}>
                <TouchableOpacity style={styles.checkbox} onPress={() => onToggleSubTask(subTask)}>
                  <Ionicons 
                    name={subTask.completed ? 'checkbox-outline' : 'square-outline'} 
                    size={20} 
                    color={subTask.completed ? '#4CAF50' : isDark ? '#aaa' : '#888'} 
                  />
                </TouchableOpacity>
                <Text 
                  style={[
                    styles.subTaskText, 
                    subTask.completed && styles.completedText,
                    isDark && styles.subTaskTextDark
                  ]}
                >
                  {subTask.text}
                </Text>
                <TouchableOpacity style={styles.deleteButton} onPress={() => onDeleteSubTask(subTask)}>
                  <Ionicons name="trash-bin-outline" size={18} color={isDark ? '#ff6b6b' : '#ff4757'} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        <View style={styles.addSubTaskRow}>
          <TextInput
            style={[styles.subTaskInput, isDark && styles.subTaskInputDark]}
            placeholder="Add a sub-task..."
            placeholderTextColor={isDark ? '#757d8a' : '#999'}
            value={newSubTaskText}
            onChangeText={setNewSubTaskText}
            onSubmitEditing={handleAddSubTask}
          />
          <TouchableOpacity 
            style={[styles.addSubTaskButton, !newSubTaskText.trim() && styles.buttonDisabled]} 
            onPress={handleAddSubTask}
            disabled={!newSubTaskText.trim()}
          >
            <Ionicons 
              name="add-circle-outline" 
              size={24} 
              color={!newSubTaskText.trim() ? (isDark ? '#555' : '#ccc') : (isDark ? '#4d9be6' : '#3498db')} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerDark: {
    backgroundColor: '#2c3e50',
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  textDark: {
    color: '#ecf0f1',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  deleteButton: {
    padding: 5,
  },
  subTasksContainer: {
    marginTop: 10,
    paddingLeft: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subTaskRowDark: {
  },
  subTaskText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  subTaskTextDark: {
    color: '#bdc3c7',
  },
  addSubTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  subTaskInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
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
}); 