import { Schema } from '@effect/schema'
import { Effect } from 'effect'

interface TodoEncoded extends Schema.Schema.Encoded<typeof Task> {}

export class Task extends Schema.Class<Task>('Task')({
  id: Schema.Number,
  title: Schema.String,
  completed: Schema.Number,
  created: Schema.DateFromString,
}) {
  static decodeOne(input: readonly unknown[]) {
    return Effect.succeed(input).pipe(
      Effect.head,
      Effect.andThen(Schema.decodeUnknown(Task)),
    )
  }

  encode() {
    return Schema.encode(Task)(this).pipe(Effect.map((t: TodoEncoded) => t))
  }
}
