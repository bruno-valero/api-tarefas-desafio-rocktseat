import Entity from '@/core/entities/entity'
import UniqueEntityId from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface TaskProps {
  title: string
  description: string
  completed_at: Date | null
  created_at: Date
  updated_at: Date | null
}

export type TaskCreateProps = Optional<
  TaskProps,
  'completed_at' | 'updated_at' | 'created_at'
>

export class Task extends Entity<TaskProps> {
  static create(props: TaskCreateProps, id?: UniqueEntityId) {
    return new Task(
      {
        ...props,
        completed_at: props.completed_at ?? null,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? null,
      },
      id,
    )
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get completed_at() {
    return this.props.completed_at
  }

  get created_at() {
    return this.props.created_at
  }

  get updated_at() {
    return this.props.updated_at
  }

  get rawData() {
    return {
      id: this.id.value,
      title: this.title,
      description: this.description,
      completed_at: this.completed_at,
      created_at: this.created_at,
      updated_at: this.updated_at,
    }
  }

  touch() {
    this.props.updated_at = new Date()
  }

  complete() {
    this.props.completed_at = new Date()
    this.touch()
  }

  set title(text: string) {
    this.props.title = text
    this.touch()
  }

  set description(text: string) {
    this.props.description = text
    this.touch()
  }
}
