import { Schema } from '@effect/schema'
import type { Row } from '@effect/sql/Connection'
import { Effect } from 'effect'

interface TodoEncoded extends Schema.Schema.Encoded<typeof Task> {}

export class Task extends Schema.Class<Task>('Task')({
  id: Schema.optional(Schema.Number),
  title: Schema.String,
  completed: Schema.Boolean,
  created: Schema.DateFromSelf,
}) {
  static decodeOne(input: readonly Row[]) {
    return Effect.succeed(input).pipe(
      Effect.head,
      Effect.andThen(Schema.decodeUnknown(Task)),
    )
  }

  encode() {
    return Schema.encode(Task)(this).pipe(Effect.map((t: TodoEncoded) => t))
  }
}
