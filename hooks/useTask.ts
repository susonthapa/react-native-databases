import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SubTaskDocType } from '../models/SubTaskSchema';
import { TodoDocument } from '../models/TodoSchema';
import { useDatabase } from '../providers/RxDBProvider';

export function useTask(taskId: string | undefined) {
  const db = useDatabase();
  const [task, setTask] = useState<TodoDocument | null | undefined>(undefined); // undefined: loading, null: not found
  const [subTasks, setSubTasks] = useState<SubTaskDocType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db || !taskId) {
      setIsLoading(!taskId); // if no taskId, not loading unless taskId was previously defined
      setTask(taskId ? null : undefined); // if no taskId but was trying to load, set to null (not found)
      setSubTasks([]);
      return;
    }

    setIsLoading(true);
    let taskSubscription: any;
    let subTaskSubscription: any;

    const loadData = async () => {
      // Fetch the specific task
      taskSubscription = db.todos.findOne(taskId).$.subscribe(foundTask => {
        setTask(foundTask);
        // Combined loading state: set isLoading false only when both task and subtasks are loaded initially.
        // Subsequent updates to task or subtasks won't set isLoading true again.
        if (subTaskSubscription) setIsLoading(false); 
      });

      // Fetch subtasks for this task
      subTaskSubscription = db.subtasks.find({ selector: { taskId: taskId } }).$.subscribe(foundSubTasks => {
        const sortedSubTasks = [...foundSubTasks].sort((a, b) => a.createdAt - b.createdAt);
        setSubTasks(sortedSubTasks);
        if (taskSubscription) setIsLoading(false); 
      });
    };

    loadData();

    // Cleanup subscriptions
    return () => {
      if (taskSubscription) taskSubscription.unsubscribe();
      if (subTaskSubscription) subTaskSubscription.unsubscribe();
    };
  }, [db, taskId]);

  // Toggle the completed status of the main task
  const toggleTaskCompleted = useCallback(async () => {
    if (task && task.patch) { // Check for existence of a method like .patch to ensure it's an RxDocument
      try {
        await task.patch({ completed: !task.completed });
      } catch (error) {
        console.error('Failed to toggle task completion:', error);
      }
    }
  }, [task]);

  // Delete the main task and its subtasks
  const deleteTask = useCallback(async () => {
    if (task && task.remove) { // Check for existence of a method like .remove
      try {
        // Subtasks are fetched separately and can be deleted using their own collection based on taskId
        const relatedSubTasks = await db.subtasks.find({ selector: { taskId: task.id } }).exec();
        for (const subDoc of relatedSubTasks) {
          await subDoc.remove();
        }
        await task.remove();
        // After deletion, task will become null via subscription, router.back() should be in component
      } catch (error) {
        console.error('Failed to delete task and its subtasks:', error);
      }
    }
  }, [db, task]);

  // Add a new subtask
  const addSubTask = useCallback(async (text: string) => {
    if (!taskId) return;
    try {
      await db.subtasks.insert({
        id: uuidv4(),
        taskId,
        text,
        completed: false,
        createdAt: Date.now()
      });
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db, taskId]);

  // Toggle the completed status of a subtask
  const toggleSubTask = useCallback(async (subTask: SubTaskDocType) => {
    try {
      const subTaskDoc = await db.subtasks.findOne(subTask.id).exec();
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
      const subTaskDoc = await db.subtasks.findOne(subTask.id).exec();
      if (subTaskDoc) {
        await subTaskDoc.remove();
      }
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, [db]);

  return {
    task,
    subTasks,
    isLoading,
    toggleTaskCompleted,
    deleteTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask
  };
} 