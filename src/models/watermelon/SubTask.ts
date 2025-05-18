import { Model, Relation } from '@nozbe/watermelondb';
import { action, date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import Todo from './Todo'; // Import Todo for relation type

export default class SubTask extends Model {
  static table = 'sub_tasks'

  // Define the relation to the Todo model
  static associations = {
    todos: { type: 'belongs_to', key: 'todo_id' },
  } as const

  @text('text') text!: string
  @field('completed') completed!: boolean
  @readonly @date('created_at') createdAt!: Date
  @field('todo_id') todoId!: string

  @relation('todos', 'todo_id') todo!: Relation<Todo>

  @action async toggleComplete() {
    await this.update(subTask => {
      subTask.completed = !subTask.completed
    })
  }
} 