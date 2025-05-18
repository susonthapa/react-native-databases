import { Model, Query } from '@nozbe/watermelondb'
import { action, children, date, field, readonly, text } from '@nozbe/watermelondb/decorators'
import SubTask from './SubTask'

export default class Todo extends Model {
  static table = 'todos'

  static associations = {
    sub_tasks: { type: 'has_many', foreignKey: 'todo_id' },
  } as const

  @text('text') text!: string
  @field('completed') completed!: boolean
  @readonly @date('created_at') createdAt!: Date

  @children('sub_tasks') subTasks!: Query<SubTask>

  // In WatermelonDB, associations define relationships.
  // If subtasks were a direct children list, you might define it here.
  // For now, subtasks will query based on todo_id.

  @action async toggleComplete() {
    await this.update(todo => {
      todo.completed = !todo.completed
    })
  }

  // Equivalent of RxDB's markAsCompleted (if different from toggleComplete)
  @action async markAsCompleted() {
    await this.update(todo => {
      todo.completed = true
    })
  }
} 