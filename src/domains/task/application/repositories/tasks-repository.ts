import { Task } from '../../enterprise/entities/task'

export interface TasksRepository {
  create(task: Task): Promise<Task>
  update(task: Task): Promise<void>
  deleteById(taskId: string): Promise<void>
  getById(taskId: string): Promise<Task | null>
  fetchMany(): Promise<Task[]>
}
