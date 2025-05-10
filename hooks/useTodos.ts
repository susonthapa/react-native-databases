import { useQuery, useRealm } from "@realm/react";
import { useCallback } from "react";
import { Todo } from "../models/Todo";

export function useTodos() {
  const realm = useRealm();
  const todos = useQuery(Todo).sorted("createdAt", true);

  const addTodo = useCallback((text: string) => {
    realm.write(() => {
      realm.create(Todo, Todo.getProperties(text));
    });
  }, [realm]);

  const toggleTodo = useCallback((todo: Todo) => {
    realm.write(() => {
      todo.completed = !todo.completed;
    });
  }, [realm]);

  const deleteTodo = useCallback((todo: Todo) => {
    realm.write(() => {
      realm.delete(todo);
    });
  }, [realm]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo
  };
} 