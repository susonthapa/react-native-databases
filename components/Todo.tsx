import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TodoDocType } from '../models/TodoSchema';

interface TodoProps {
  item: TodoDocType;
  onToggle: (item: TodoDocType) => void;
  onDelete: (item: TodoDocType) => void;
}

export const Todo = ({ item, onToggle, onDelete }: TodoProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onToggle(item)}>
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
      
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item)}>
        <Ionicons name="trash-outline" size={20} color={isDark ? '#ff6b6b' : '#ff4757'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
}); 