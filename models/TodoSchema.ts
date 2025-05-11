import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb';

// 1. Define Schema Literal with 'as const'
export const todoSchemaLiteral = {
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
} as const;

// 2. Create Typed Schema and Extract Document Type 
const schemaTyped = toTypedRxJsonSchema(todoSchemaLiteral);
export type TodoDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// 3. Create the typed RxJsonSchema from the literal typed object
export const todoSchema: RxJsonSchema<TodoDocType> = todoSchemaLiteral;

// 4. Define Document Methods
export type TodoDocMethods = {
  markAsCompleted: () => Promise<void>;
  toggleComplete: () => Promise<void>;
};

// 5. Create RxDocument Type
export type TodoDocument = RxDocument<TodoDocType, TodoDocMethods>;

// 6. Define Collection Methods
export type TodoCollectionMethods = {
  countCompleted: () => Promise<number>;
  countActive: () => Promise<number>;
};

// 7. Create RxCollection Type
export type TodoCollection = RxCollection<
  TodoDocType,
  TodoDocMethods,
  TodoCollectionMethods
>; 