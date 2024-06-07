import { createWriteStream } from 'node:fs'
import { FakeCsvReadable } from './fake-csv-upload'
import { resolve } from 'node:path'

console.log('init...')
const fakeCsvReadable = new FakeCsvReadable()
const fakeCsvWritable = createWriteStream(
  resolve(__dirname, 'content.csv'),
  'utf8',
)

fakeCsvReadable.pipe(fakeCsvWritable)
