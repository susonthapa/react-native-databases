import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TodoDocType } from '../models/TodoSchema';
import { useDatabase } from '../providers/RxDBProvider';

export function useTodos() {
  const db = useDatabase();
  const [todos, setTodos] = useState<TodoDocType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to changes in the todos collection
  useEffect(() => {
    // Initial fetch
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const result = await db.todos.find({
          selector: {},
          sort: [{ createdAt: 'desc' }]
        }).exec();
        setTodos(result);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTodos();

    // Subscribe to changes
    const subscription = db.todos.find().$.subscribe(newTodos => {
      // Sort the todos by createdAt descending
      const sortedTodos = [...newTodos].sort((a, b) => b.createdAt - a.createdAt);
      setTodos(sortedTodos);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  // Add a new todo
  const addTodo = useCallback(async (text: string) => {
    try {
      const newTodo = {
        id: uuidv4(),
        text,
        completed: false,
        createdAt: Date.now()
      };
      await db.todos.insert(newTodo);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [db]);

  // Toggle the completed status of a todo
  const toggleTodo = useCallback(async (todo: TodoDocType) => {
    try {
      const todoDoc = await db.todos.findOne({ selector: { id: todo.id } }).exec();
      if (todoDoc) {
        await todoDoc.patch({ completed: !todo.completed });
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, [db]);

  // Delete a todo
  const deleteTodo = useCallback(async (todo: TodoDocType) => {
    try {
      const todoDoc = await db.todos.findOne({ selector: { id: todo.id } }).exec();
      if (todoDoc) {
        await todoDoc.remove();
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, [db]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    isLoading
  };
} 