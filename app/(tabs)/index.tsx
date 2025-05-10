import { Todo } from '@/components/Todo';
import { TodoInput } from '@/components/TodoInput';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTodos } from '../../hooks/useTodos';

export default function HomeScreen() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
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
        TODO List
      </Text>
      
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
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <Todo
              item={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
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
