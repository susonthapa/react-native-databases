import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SubTaskDocType } from '../models/SubTaskSchema';
import { TodoDocType } from '../models/TodoSchema';
import { useDatabase } from '../providers/RxDBProvider';

export function useTodos() {
  const db = useDatabase();
  const [todos, setTodos] = useState<TodoDocType[]>([]);
  const [subTasks, setSubTasks] = useState<SubTaskDocType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to changes in the todos collection
  useEffect(() => {
    const todoSubscription = db.todos.find().$.subscribe(newTodos => {
      const sortedTodos = [...newTodos].sort((a, b) => b.createdAt - a.createdAt);
      setTodos(sortedTodos);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      todoSubscription.unsubscribe();
    };
  }, [db]);

  // Subscribe to changes in the subtasks collection
  useEffect(() => {
    if (!db.subtasks) return;

    const subTaskSubscription = db.subtasks.find().$.subscribe(newSubTasks => {
      const sortedSubTasks = [...newSubTasks].sort((a, b) => a.createdAt - b.createdAt);
      setSubTasks(sortedSubTasks);
    });

    return () => {
      subTaskSubscription.unsubscribe();
    };
  }, [db, db.subtasks]);

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

  // Delete a todo and its subtasks
  const deleteTodo = useCallback(async (todo: TodoDocType) => {
    try {
      const todoDoc = await db.todos.findOne({ selector: { id: todo.id } }).exec();
      if (todoDoc) {
        // Delete associated subtasks first
        const relatedSubTasks = await db.subtasks.find({ selector: { taskId: todo.id } }).exec();
        for (const subTask of relatedSubTasks) {
          await subTask.remove();
        }
        await todoDoc.remove();
      }
    } catch (error) {
      console.error('Failed to delete todo and its subtasks:', error);
    }
  }, [db]);

  // Add a new subtask
  const addSubTask = useCallback(async (taskId: string, text: string) => {
    try {
      const newSubTask = {
        id: uuidv4(),
        taskId,
        text,
        completed: false,
        createdAt: Date.now()
      };
      await db.subtasks.insert(newSubTask);
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db]);

  // Toggle the completed status of a subtask
  const toggleSubTask = useCallback(async (subTask: SubTaskDocType) => {
    try {
      const subTaskDoc = await db.subtasks.findOne({ selector: { id: subTask.id } }).exec();
      if (subTaskDoc) {
        await subTaskDoc.patch({ completed: !subTask.completed });
      }
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  }, [db]);

  // Delete a subtask
  const deleteSubTask = useCallback(async (subTask: SubTaskDocType) => {
    try {
      const subTaskDoc = await db.subtasks.findOne({ selector: { id: subTask.id } }).exec();
      if (subTaskDoc) {
        await subTaskDoc.remove();
      }
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, [db]);

  return {
    todos,
    subTasks,
    addTodo,
    toggleTodo,
    deleteTodo,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    isLoading
  };
} 