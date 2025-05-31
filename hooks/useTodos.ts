import { useDatabase } from '@/providers/DBProvider';
import * as schema from '@/src/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useCallback } from 'react';

// Define types for Todo and SubTask based on Drizzle schema for hook usage
export type Todo = typeof schema.todos.$inferSelect;
export type SubTask = typeof schema.subTasks.$inferSelect;

export function useTodos() {
  const db = useDatabase();
  const {data: todos} = useLiveQuery(db.select().from(schema.todos).orderBy(desc(schema.todos.createdAt)));
  const {data: subTasks} = useLiveQuery(db.select().from(schema.subTasks).orderBy(asc(schema.subTasks.createdAt)));


  return {
    todos,
    subTasks,
  };
} 

export function useTodoActions() {
  const db = useDatabase();

  const addTodo = useCallback(async (text: string) => {
    if (!db) return;
    try {
      await db.insert(schema.todos).values({ text: text, completed: false, createdAt: new Date() });
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [db]);

  const toggleTodo = useCallback(async (todoId: string, currentCompleted: boolean) => {
    if (!db) return;
    try {
      await db.update(schema.todos).set({ completed: !currentCompleted }).where(eq(schema.todos.id, todoId));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, [db]);

  const deleteTodo = useCallback(async (todoId: string) => {
    if (!db) return;
    try {
      // Drizzle schema has onDelete: 'cascade' for subTasks.todoId, so SQLite should handle subtask deletion.
      await db.delete(schema.todos).where(eq(schema.todos.id, todoId));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, [db]);

  const addSubTask = useCallback(async (todoId: string, text: string) => {
    if (!db) return;
    try {
      await db.insert(schema.subTasks).values({ todoId: todoId, text: text, completed: false, createdAt: new Date() });
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db]);

  const toggleSubTask = useCallback(async (subTaskId: string, currentCompleted: boolean) => {
    if (!db) return;
    try {
      await db.update(schema.subTasks).set({ completed: !currentCompleted }).where(eq(schema.subTasks.id, subTaskId));
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  }, [db]);

  const deleteSubTask = useCallback(async (subTaskId: string) => {
    if (!db) return;
    try {
      await db.delete(schema.subTasks).where(eq(schema.subTasks.id, subTaskId));
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, [db]);

  const editTodo = useCallback(async (todoId: string, newText: string) => {
    if (!db) return;
    try {
      await db.update(schema.todos).set({ text: newText }).where(eq(schema.todos.id, todoId));
    } catch (error) {
      console.error('Failed to edit todo:', error);
    }
  }, [db]);

  const editSubTask = useCallback(async (subTaskId: string, newText: string) => {
    if (!db) return;
    try {
      await db.update(schema.subTasks).set({ text: newText }).where(eq(schema.subTasks.id, subTaskId));
    } catch (error) {
      console.error('Failed to edit subtask:', error);
    }
  }, [db]);

  const duplicateTodo = useCallback(async (todo: Todo) => {
    if (!db) return;
    try {
      const newTodo = await db.insert(schema.todos).values({ 
        text: `${todo.text} (copy)`, 
        completed: false, 
        createdAt: new Date() 
      }).returning();
      
      // Also duplicate subtasks if any
      const todoSubTasks = await db.select().from(schema.subTasks).where(eq(schema.subTasks.todoId, todo.id));
      if (todoSubTasks.length > 0 && newTodo[0]) {
        for (const subTask of todoSubTasks) {
          await db.insert(schema.subTasks).values({
            todoId: newTodo[0].id,
            text: subTask.text,
            completed: false,
            createdAt: new Date()
          });
        }
      }
      
    } catch (error) {
      console.error('Failed to duplicate todo:', error);
    }
  }, [db]);

  return {
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    editSubTask,
    duplicateTodo,
  }
}

