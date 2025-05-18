import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'todos',
      columns: [
        { name: 'text', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'created_at', type: 'number' }, // WatermelonDB uses created_at and updated_at by convention
      ],
    }),
    tableSchema({
      name: 'sub_tasks', // Snake case is conventional in WatermelonDB table names
      columns: [
        { name: 'text', type: 'string' },
        { name: 'completed', type: 'boolean' },
        { name: 'todo_id', type: 'string', isIndexed: true }, // Foreign key
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
}) 