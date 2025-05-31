import { Todo } from '@/components/Todo';
import { TodoInput } from '@/components/TodoInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTodoActions, useTodos } from '../../hooks/useTodos';

export default function HomeScreen() {
  const { 
    addTodo, 
    toggleTodo,
    deleteTodo,
    editTodo,
    duplicateTodo,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    editSubTask,
  } = useTodoActions();
  const { todos, subTasks } = useTodos();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleQuickActions = () => {
    SheetManager.show('quick-actions');
  };

  return (
    <View 
      style={[
        styles.container, 
        isDark && styles.containerDark,
        { paddingTop: insets.top }
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          TODO List
        </Text>
        <TouchableOpacity 
          style={styles.quickActionsButton}
          onPress={handleQuickActions}
        >
          <Ionicons 
            name="ellipsis-vertical" 
            size={24} 
            color={isDark ? '#ecf0f1' : '#2c3e50'} 
          />
        </TouchableOpacity>
      </View>
      
      <TodoInput onAddTodo={addTodo} />
      
      {todos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>
            No tasks yet. Add one to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Todo
              item={item}
              subTasks={subTasks.filter(sub => sub.todoId === item.id)}
              onToggle={() => toggleTodo(item.id, item.completed)}
              onDelete={() => deleteTodo(item.id)}
              onEdit={editTodo}
              onDuplicate={duplicateTodo}
              onAddSubTask={addSubTask}
              onToggleSubTask={(subTask) => toggleSubTask(subTask.id, subTask.completed)}
              onDeleteSubTask={(subTask) => deleteSubTask(subTask.id)}
              onEditSubTask={editSubTask}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  titleDark: {
    color: '#ecf0f1',
  },
  quickActionsButton: {
    padding: 8,
    borderRadius: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  emptyTextDark: {
    color: '#718096',
  },
});
