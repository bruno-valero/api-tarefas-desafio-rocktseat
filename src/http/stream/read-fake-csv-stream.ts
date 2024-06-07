import { Req } from '@/customServer'
import {
  CreateTaskUseCase,
  CreateTaskUseCaseRequest,
} from '@/domains/task/application/use-cases/create-task-use-case'
import { Task } from '@/domains/task/enterprise/entities/task'
import { ZodType, ZodTypeDef } from 'zod'

export class ReadFakeCsvStreamAndSaveOnDatabase {
  lineItemsPosition = { title: 0, description: 1 }
  firstLine: string[][] = []
  tasks: Task[] = []

  constructor(
    protected req: Req,
    protected dataSchema: ZodType<
      CreateTaskUseCaseRequest,
      ZodTypeDef,
      CreateTaskUseCaseRequest
    >,
    protected createTaskUseCase: CreateTaskUseCase,
  ) {}

  protected async saveOnDatabase({
    title,
    description,
  }: {
    title: string
    description: string
  }) {
    const data = {
      title,
      description,
    }

    const body = this.dataSchema.parse(data)
    const useCase = this.createTaskUseCase
    const useCaseResp = await useCase.execute(body)

    if (useCaseResp.isRight()) {
      const task = useCaseResp.value.task
      this.tasks.push(task)
    } else {
      throw new Error('Internal Server Error')
    }
  }

  protected isCsvHeader(possibleHeaders: string[], line: string[]) {
    const isHeaderArray = line.map((item) => {
      const isInHeaders = possibleHeaders.some((header) =>
        new RegExp(header, 'ig').test(item),
      )

      return isInHeaders
    })

    const oneIsNotHeader = isHeaderArray.some((item) => item === false)

    return !oneIsNotHeader
  }

  async read() {
    const parts = this.req

    for await (const chunk of parts) {
      const line = ((chunk as Buffer).toString().split('\n') as string[]).map(
        (item) =>
          item
            .trim()
            .split(',')
            .map((field) => field.trim()),
      )

      for (let i = 0; i < line.length - 1; i++) {
        const lineItem = line[i].filter((item) => !!item)

        if (lineItem.length === 2) {
          if (
            this.firstLine.length === 0 &&
            this.isCsvHeader(['description', 'title'], lineItem)
          ) {
            this.firstLine.push(lineItem)

            if (/description/.test(lineItem[0])) {
              this.lineItemsPosition.title = 1
              this.lineItemsPosition.description = 0
            }

            continue
          }

          if (this.firstLine.length === 1) {
            const title = lineItem[this.lineItemsPosition.title]
            const description = lineItem[this.lineItemsPosition.description]

            await this.saveOnDatabase({ title, description })
          }
        }
      }
    }
  }
}
