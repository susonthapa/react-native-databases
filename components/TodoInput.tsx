import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

export const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddTodo = () => {
    if (text.trim()) {
      onAddTodo(text.trim());
      setText('');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Add a new task..."
        placeholderTextColor={isDark ? '#757d8a' : '#999'}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAddTodo}
      />
      <TouchableOpacity 
        style={[styles.button, !text.trim() && styles.buttonDisabled]} 
        onPress={handleAddTodo}
        disabled={!text.trim()}
      >
        <Ionicons 
          name="add-circle" 
          size={28} 
          color={!text.trim() ? '#ccc' : isDark ? '#4d9be6' : '#3498db'} 
        />
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: '#2c3e50',
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  inputDark: {
    backgroundColor: '#1e293b',
    color: '#ecf0f1',
  },
  button: {
    marginLeft: 10,
    padding: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
}); 