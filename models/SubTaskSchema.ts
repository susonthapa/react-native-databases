import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDocument,
  RxJsonSchema,
  toTypedRxJsonSchema
} from 'rxdb';

// 1. Define Schema Literal with 'as const'
export const subTaskSchemaLiteral = {
  title: 'subtask schema',
  description: 'describes a subtask item',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    taskId: { // Foreign key to link to the parent TodoDocument
      type: 'string',
      ref: 'todos', // This establishes the relation to the 'todos' collection
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
  required: ['id', 'taskId', 'text', 'createdAt'],
  indexes: ['taskId'] // Index for faster querying by taskId
} as const;

// 2. Create Typed Schema and Extract Document Type
const schemaTyped = toTypedRxJsonSchema(subTaskSchemaLiteral);
export type SubTaskDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// 3. Create the typed RxJsonSchema from the literal typed object
export const subTaskSchema: RxJsonSchema<SubTaskDocType> = subTaskSchemaLiteral;

// 4. Define Document Methods
export type SubTaskDocMethods = {
  toggleComplete: () => Promise<void>;
};

// 5. Create RxDocument Type
export type SubTaskDocument = RxDocument<SubTaskDocType, SubTaskDocMethods>;

// 6. Define Collection Methods
export type SubTaskCollectionMethods = {
  countByTask: (taskId: string) => Promise<number>;
};

// 7. Create RxCollection Type
export type SubTaskCollection = RxCollection<
  SubTaskDocType,
  SubTaskDocMethods,
  SubTaskCollectionMethods
>; 