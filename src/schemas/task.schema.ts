import { Schema } from '@effect/schema'

export class Task extends Schema.Class<Task>('Task')({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Number,
  created: Schema.DateFromString,
}) {
  static decode(input: unknown) {
    return Schema.decodeUnknown(Task)(input)
  }

  encode() {
    return Schema.encode(Task)(this)
  }
}
