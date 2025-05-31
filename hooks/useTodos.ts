import { useDatabase } from '@/providers/DBProvider';
import { DrizzleDB } from '@/src/db';
import * as schema from '@/src/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useCallback, useEffect, useState } from 'react';

// Define types for Todo and SubTask based on Drizzle schema for hook usage
export type Todo = typeof schema.todos.$inferSelect;
export type SubTask = typeof schema.subTasks.$inferSelect;

export function useTodos() {
  const db = useDatabase() as DrizzleDB;
  const {data} = useLiveQuery(db.select().from(schema.todos).orderBy(desc(schema.todos.createdAt)));
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]); // Still fetching all subtasks globally for now
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    if (!db) return;
    try {
      setIsLoading(true);
      const result = await db.select().from(schema.todos).orderBy(desc(schema.todos.createdAt));
      setTodos(result);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      setTodos([]);
    } finally {
      setIsLoading(false); // Set loading false regardless of main todos fetch, subtasks separate
    }
  }, [db]);

  const fetchSubTasks = useCallback(async () => {
    if (!db) return;
    try {
      // Consider if all subtasks are needed or if they should be fetched per todo
      const result = await db.select().from(schema.subTasks).orderBy(asc(schema.subTasks.createdAt));
      setSubTasks(result);
    } catch (error) {
      console.error("Failed to fetch subtasks:", error);
      setSubTasks([]);
    }
  }, [db]);

  useEffect(() => {
    fetchTodos();
    fetchSubTasks(); // Fetch all subtasks initially
  }, [fetchTodos, fetchSubTasks]);

  const addTodo = useCallback(async (text: string) => {
    if (!db) return;
    try {
      await db.insert(schema.todos).values({ text: text, completed: false, createdAt: new Date() });
      fetchTodos(); // Re-fetch todos
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [db, fetchTodos]);

  const toggleTodo = useCallback(async (todoId: string, currentCompleted: boolean) => {
    if (!db) return;
    try {
      await db.update(schema.todos).set({ completed: !currentCompleted }).where(eq(schema.todos.id, todoId));
      fetchTodos(); // Re-fetch todos
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, [db, fetchTodos]);

  const deleteTodo = useCallback(async (todoId: string) => {
    if (!db) return;
    try {
      // Drizzle schema has onDelete: 'cascade' for subTasks.todoId, so SQLite should handle subtask deletion.
      await db.delete(schema.todos).where(eq(schema.todos.id, todoId));
      fetchTodos(); // Re-fetch todos
      fetchSubTasks(); // Re-fetch subtasks as cascade might have altered them
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, [db, fetchTodos, fetchSubTasks]);

  const addSubTask = useCallback(async (todoId: string, text: string) => {
    if (!db) return;
    try {
      await db.insert(schema.subTasks).values({ todoId: todoId, text: text, completed: false, createdAt: new Date() });
      fetchSubTasks(); // Re-fetch subtasks
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db, fetchSubTasks]);

  const toggleSubTask = useCallback(async (subTaskId: string, currentCompleted: boolean) => {
    if (!db) return;
    try {
      await db.update(schema.subTasks).set({ completed: !currentCompleted }).where(eq(schema.subTasks.id, subTaskId));
      fetchSubTasks(); // Re-fetch subtasks
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  }, [db, fetchSubTasks]);

  const deleteSubTask = useCallback(async (subTaskId: string) => {
    if (!db) return;
    try {
      await db.delete(schema.subTasks).where(eq(schema.subTasks.id, subTaskId));
      fetchSubTasks(); // Re-fetch subtasks
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, [db, fetchSubTasks]);

  return {
    todos,
    subTasks,
    addTodo,
    toggleTodo,
    deleteTodo,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    isLoading,
    refreshTodos: fetchTodos, // Expose refresh functions if needed by UI
    refreshSubTasks: fetchSubTasks,
  };
} 

