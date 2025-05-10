import { RxJsonSchema } from 'rxdb';

export type TodoDocType = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number; // Using number for date (timestamp)
};

export const todoSchema: RxJsonSchema<TodoDocType> = {
  title: 'todo schema',
  description: 'describes a todo item',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    text: {
      type: 'string'
    },
    completed: {
      type: 'boolean',
      default: false
    },
    createdAt: {
      type: 'number', // Timestamp
    }
  },
  required: ['id', 'text', 'createdAt'],
}; 