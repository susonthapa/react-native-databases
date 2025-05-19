import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()), // Use uuidv4 for IDs
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()), // Store as ms timestamp
});

export const subTasks = sqliteTable('sub_tasks', {
  id: text('id').primaryKey().$defaultFn(() => uuidv4()), // Use uuidv4 for IDs
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  todoId: text('todo_id').notNull().references(() => todos.id, { onDelete: 'cascade' }), // Foreign key with cascade delete
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

// Define relations for Drizzle (optional but good for type safety and potential relational queries)
export const todosRelations = relations(todos, ({ many }) => ({
  subTasks: many(subTasks),
}));

export const subTasksRelations = relations(subTasks, ({ one }) => ({
  todo: one(todos, {
    fields: [subTasks.todoId],
    references: [todos.id],
  }),
})); 

export type Todo = typeof todos.$inferSelect;
export type SubTask = typeof subTasks.$inferSelect;