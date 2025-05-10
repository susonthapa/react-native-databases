import { Realm } from '@realm/react';

export class Todo extends Realm.Object<Todo> {
  _id!: Realm.BSON.ObjectId;
  text!: string;
  completed!: boolean;
  createdAt!: Date;

  static schema = {
    name: 'Todo',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      text: 'string',
      completed: 'bool',
      createdAt: 'date',
    },
  };

  // This method returns the properties to create a new Todo
  static getProperties(text: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      text,
      completed: false,
      createdAt: new Date(),
    };
  }
} 