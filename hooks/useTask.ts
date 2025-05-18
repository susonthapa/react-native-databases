import { useDatabase } from '@/providers/DBProvider';
import SubTask from '@/src/models/watermelon/SubTask';
import Todo from '@/src/models/watermelon/Todo';
import { Database } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';
import { Subscription as ZenSubscription } from 'rxjs';

export function useTask(taskId: string | undefined) {
  const db = useDatabase() as Database;
  const [task, setTask] = useState<Todo | null | undefined>(undefined);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!db || !taskId) {
      setIsLoading(false); // Set to false if no taskId
      setTask(undefined); // Clear task if no taskId
      setSubTasks([]);
      return;
    }

    setIsLoading(true);
    let taskSubscription: ZenSubscription | undefined;
    let subTaskSubscription: ZenSubscription | undefined;

    // Observe the specific task by ID
    const taskObservable = db.get<Todo>('todos').findAndObserve(taskId);
    taskSubscription = taskObservable.subscribe(
      foundTask => {
        setTask(foundTask); // foundTask will be null if not found after initial fetch
        if (!foundTask) {
          setIsLoading(false); // Task not found, stop loading
          setSubTasks([]); // Clear subtasks
        } else {
          // If task is found, observe its subtasks
          if (subTaskSubscription) subTaskSubscription.unsubscribe(); // Unsubscribe from previous subtask listener
          
          subTaskSubscription = foundTask.subTasks
            .observe()
            .subscribe(relatedSubTasks => {
              const sortedSubTasks = [...relatedSubTasks].sort((a, b) => {
                const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
                const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;

                if (!(a.createdAt instanceof Date)) {
                  console.warn(`SubTask with id ${a.id} has invalid createdAt:`, a.createdAt);
                }
                if (!(b.createdAt instanceof Date)) {
                  console.warn(`SubTask with id ${b.id} has invalid createdAt:`, b.createdAt);
                }
                return aTime - bTime;
              });
              setSubTasks(sortedSubTasks);
              setIsLoading(false);
            });
        }
      },
      error => {
        console.error("Error observing task:", error);
        setIsLoading(false);
        setTask(null); // Indicate error / not found
      }
    );

    return () => {
      if (taskSubscription) taskSubscription.unsubscribe();
      if (subTaskSubscription) subTaskSubscription.unsubscribe();
    };
  }, [db, taskId]);

  // Toggle the completed status of the main task
  const toggleTaskCompleted = useCallback(async () => {
    if (task && task.toggleComplete) {
      try {
        await task.toggleComplete();
      } catch (error) {
        console.error('Failed to toggle task completion:', error);
      }
    }
  }, [task]);

  // Delete the main task and its subtasks
  const deleteTask = useCallback(async () => {
    if (!db || !task) return;
    try {
      await db.write(async () => {
        const relatedSubTasks = await task.subTasks.fetch();
        const subTasksToDelete = relatedSubTasks.map(st => st.prepareDestroyPermanently());
        await db.batch(
          ...subTasksToDelete,
          task.prepareDestroyPermanently()
        );
      });
      // After deletion, the task observable will emit null, updating the state.
      // Navigation (e.g., router.back()) should be handled in the component using this hook.
    } catch (error) {
      console.error('Failed to delete task and its subtasks:', error);
    }
  }, [db, task]);

  // Add a new subtask
  const addSubTask = useCallback(async (text: string) => {
    if (!db || !taskId || !task) return; // Ensure task exists to associate with
    try {
      await db.write(async () => {
        await db.get<SubTask>('sub_tasks').create(st => {
          st.text = text;
          st.completed = false;
          st.todoId = taskId; // or task.id
        });
      });
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db, taskId, task]);

  // Toggle the completed status of a subtask
  const toggleSubTask = useCallback(async (subTask: SubTask) => {
    try {
      await subTask.toggleComplete();
    } catch (error) {
      console.error('Failed to toggle subtask:', error);
    }
  }, []);

  // Delete a subtask
  const deleteSubTask = useCallback(async (subTask: SubTask) => {
    try {
      await subTask.destroyPermanently();
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, []);

  return {
    task,
    subTasks,
    isLoading,
    toggleTaskCompleted,
    deleteTask,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
  };
} 