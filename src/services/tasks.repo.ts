import { client as SqlClient, resolver as SqlResolver } from '@effect/sql'
import { Task } from '@/schemas/task.schema'
import { Schema } from '@effect/schema'

import { Effect, Layer } from 'effect'
import { PgLiveLiteLayer } from '../../config/db'

interface TodoEncoded extends Schema.Schema.Encoded<typeof Task> {}

const makeTodoRepo = Effect.sync(() => {
  return {
    getOneDB: SqlClient.Client.pipe(
      Effect.andThen((sql) =>
        SqlResolver.findById('GetTaskById', {
          Id: Schema.Number,
          Result: Task,
          ResultId: (_) => _.id,
          execute: (ids) => sql`SELECT * FROM tasks WHERE ${sql.in('id', ids)}`,
        }),
      ),
      Effect.andThen((r) => r.execute),
    ),
    getOne: () =>
      new Task({
        id: 1,
        title: 'test',
        completed: 1,
        created: new Date(),
      })
        .encode()
        .pipe(Effect.andThen((t): TodoEncoded => t)),
  }
})

export class TaskRepo extends Effect.Tag('@services/TaskRepo')<
  TaskRepo,
  Effect.Effect.Success<typeof makeTodoRepo>
>() {
  static layer = Layer.effect(this, makeTodoRepo)
}

const getById = (id: number) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.getOneDB(1)),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLiveLiteLayer),
    Effect.runSync,
  )

console.log(getById(1))
