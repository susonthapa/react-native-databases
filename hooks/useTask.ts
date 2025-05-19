import { useDatabase } from '@/providers/DBProvider';
import { DrizzleDB } from '@/src/db';
import * as schema from '@/src/db/schema';
import { asc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

// Types from useTodos can be reused or redefined here if preferred
import { SubTask, Todo } from './useTodos'; // Assuming useTodos exports these types

export function useTask(taskId: string | undefined) {
  const db = useDatabase() as DrizzleDB;
  const [task, setTask] = useState<Todo | null | undefined>(undefined);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTaskAndSubTasks = useCallback(async () => {
    if (!db || !taskId) {
      setTask(undefined);
      setSubTasks([]);
      setIsLoading(!taskId); // Only loading if taskId is present
      return;
    }
    setIsLoading(true);
    try {
      const taskResult = await db.select().from(schema.todos).where(eq(schema.todos.id, taskId)).limit(1);
      const currentTask = taskResult[0] || null;
      setTask(currentTask);

      if (currentTask) {
        const subTasksResult = await db.select().from(schema.subTasks)
          .where(eq(schema.subTasks.todoId, taskId))
          .orderBy(asc(schema.subTasks.createdAt));
        setSubTasks(subTasksResult);
      } else {
        setSubTasks([]); // No task, no subtasks
      }
    } catch (error) {
      console.error("Failed to fetch task and subtasks:", error);
      setTask(null);
      setSubTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [db, taskId]);

  useEffect(() => {
    fetchTaskAndSubTasks();
  }, [fetchTaskAndSubTasks]);

  const toggleTaskCompleted = useCallback(async () => {
    if (!db || !task) return;
    try {
      await db.update(schema.todos).set({ completed: !task.completed }).where(eq(schema.todos.id, task.id));
      fetchTaskAndSubTasks(); // Re-fetch
    } catch (error) {
      console.error('Failed to toggle task completion:', error);
    }
  }, [db, task, fetchTaskAndSubTasks]);

  const deleteTask = useCallback(async () => {
    if (!db || !task) return;
    try {
      // Cascade delete should handle subtasks as per schema
      await db.delete(schema.todos).where(eq(schema.todos.id, task.id));
      // After deletion, task will be set to null by the next fetch or manually
      setTask(null); // Optimistically set to null or navigate away in component
      setSubTasks([]);
      // Potentially call a navigation function here if provided
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [db, task]); // fetchTaskAndSubTasks could be added if we want to confirm deletion from DB

  const addSubTaskToCurrent = useCallback(async (text: string) => {
    if (!db || !taskId) return;
    try {
      await db.insert(schema.subTasks).values({ todoId: taskId, text: text, completed: false, createdAt: new Date() });
      fetchTaskAndSubTasks(); // Re-fetch subtasks for the current task
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db, taskId, fetchTaskAndSubTasks]);

  const toggleSubTask = useCallback(async (subTaskId: string, currentCompleted: boolean) => {
    if (!db) return;
    try {
      await db.update(schema.subTasks).set({ completed: !currentCompleted }).where(eq(schema.subTasks.id, subTaskId));
      fetchTaskAndSubTasks(); // Re-fetch
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  }, [db, fetchTaskAndSubTasks]);

  const deleteSubTask = useCallback(async (subTaskId: string) => {
    if (!db) return;
    try {
      await db.delete(schema.subTasks).where(eq(schema.subTasks.id, subTaskId));
      fetchTaskAndSubTasks(); // Re-fetch
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, [db, fetchTaskAndSubTasks]);

  return {
    task,
    subTasks,
    isLoading,
    toggleTaskCompleted,
    deleteTask,
    addSubTask: addSubTaskToCurrent, // Renamed to avoid confusion if useTodos.addSubTask is also imported
    toggleSubTask,
    deleteSubTask,
    refreshTask: fetchTaskAndSubTasks, // Expose refresh
  };
} 