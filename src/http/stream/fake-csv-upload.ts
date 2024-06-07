import { faker } from '@faker-js/faker'
import { Readable, Writable } from 'node:stream'

export class FakeCsvReadable extends Readable {
  _read(): void {
    const firstLine = 'title,description'
    const anyLine = () =>
      `${faker.lorem.sentence(3)},${faker.lorem.sentence(8)}`

    for (let i = 1; i <= 6; i++) {
      const line = i === 1 ? `${firstLine}\n` : `${anyLine()}\n`
      const buffer = Buffer.from(line)

      this.push(buffer)
    }
    this.push(null)
  }
}

export class FakeCsvWritable extends Writable {
  _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null | undefined) => void,
  ): void {
    console.log('FakeCsvWritable -- chunk', chunk.toString())
    console.log('\n\n')
    callback()
  }
}
