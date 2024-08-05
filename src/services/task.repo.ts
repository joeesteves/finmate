import { Task } from '@/schemas/task.schema'
import { client as Sql } from '@effect/sql'
import { Effect, Layer, pipe } from 'effect'
import { logStatement } from '@/helpers/sql.helper'
import { PgLiveLayer } from './account.service'

const makeTodoRepo = Effect.gen(function* () {
  const sql = yield* Sql.Client

  return {
    find: (id: number) =>
      pipe(
        sql`SELECT * FROM tasks WHERE id=${id}`,
        logStatement,
        Effect.andThen(Task.decodeOne),
      ),
    insert: (task: Task) =>
      pipe(
        task.encode(),
        Effect.map(
          (eTask) => sql`INSERT INTO tasks ${sql.insert(eTask)} RETURNING *`,
        ),
        Effect.andThen(logStatement),
        Effect.andThen(Task.decodeOne),
      ),
    update: (task: Task) =>
      pipe(
        task.encode(),
        Effect.map(
          (eTask) =>
            sql`UPDATE tasks SET ${sql.update(eTask)} where id=${eTask.id || 1} RETURNING *`,
        ),
        Effect.andThen(logStatement),
        Effect.andThen(Task.decodeOne),
      ),
  }
})

export class TaskRepo extends Effect.Tag('@services/TaskRepo')<
  TaskRepo,
  Effect.Effect.Success<typeof makeTodoRepo>
>() {
  static layer = Layer.effect(this, makeTodoRepo)
}

const get = (id: number) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.find(id)),
    Effect.andThen((r) => r.encode()),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLiveLayer),
    Effect.runPromise,
  )

get(17).then(console.log)
