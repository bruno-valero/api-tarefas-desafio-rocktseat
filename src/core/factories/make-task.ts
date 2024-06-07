import { Task } from '@/domains/task/enterprise/entities/task'
import { faker } from '@faker-js/faker'
import UniqueEntityId from '../entities/unique-entity-id'

export function makeTask(override?: Partial<Task>, id?: string) {
  return Task.create(
    {
      title: faker.lorem.sentence(),
      description: faker.lorem.text(),
      ...override,
    },
    new UniqueEntityId(id),
  )
}
