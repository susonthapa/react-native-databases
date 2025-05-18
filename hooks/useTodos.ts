import { useDatabase } from '@/providers/DBProvider';
import SubTask from '@/src/models/watermelon/SubTask';
import Todo from '@/src/models/watermelon/Todo';
import { Database, Q } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';

export function useTodos() {
  const db = useDatabase() as Database;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to changes in the todos collection
  useEffect(() => {
    if (!db) return;
    const todosCollection = db.get<Todo>('todos');
    const observer = todosCollection
      .query(Q.sortBy('created_at', Q.desc))
      .observe();

    const subscription = observer.subscribe(newTodos => {
      setTodos(newTodos);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  // Subscribe to changes in the subtasks collection
  useEffect(() => {
    if (!db) return;
    const subTasksCollection = db.get<SubTask>('sub_tasks');
    const observer = subTasksCollection
      .query(Q.sortBy('created_at', Q.asc))
      .observe();

    const subscription = observer.subscribe(newSubTasks => {
      setSubTasks(newSubTasks);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [db]);

  // Add a new todo
  const addTodo = useCallback(async (text: string) => {
    if (!db) return;
    try {
      await db.write(async () => {
        await db.get<Todo>('todos').create(todo => {
          todo.text = text;
          todo.completed = false;
          // createdAt is handled automatically by WatermelonDB if schema is set up for it
        });
      });
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [db]);

  // Toggle the completed status of a todo
  const toggleTodo = useCallback(async (todo: Todo) => {
    try {
      await todo.toggleComplete();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }, []);

  // Delete a todo and its subtasks
  const deleteTodo = useCallback(async (todo: Todo) => {
    if (!db) return;
    try {
      await db.write(async () => {
        // Fetch and delete associated subtasks first
        const relatedSubTasks = await todo.subTasks.fetch();
        const subTasksToDelete = relatedSubTasks.map(subTask => subTask.prepareDestroyPermanently());
        
        await db.batch(
          ...subTasksToDelete,
          todo.prepareDestroyPermanently()
        );
      });
    } catch (error) {
      console.error('Failed to delete todo and its subtasks:', error);
    }
  }, [db]); // db is needed for batch operation

  // Add a new subtask
  const addSubTask = useCallback(async (todoId: string, text: string) => {
    if (!db) return;
    try {
      await db.write(async () => {
        await db.get<SubTask>('sub_tasks').create(subTask => {
          subTask.todoId = todoId;
          subTask.text = text;
          subTask.completed = false;
          // createdAt is handled automatically
        });
      });
    } catch (error) {
      console.error('Failed to add subtask:', error);
    }
  }, [db]);

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
      await subTask.destroyPermanently(); // This is a direct action, db.write is implicit
    } catch (error) {
      console.error('Failed to delete subtask:', error);
    }
  }, []);

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
  };
} 