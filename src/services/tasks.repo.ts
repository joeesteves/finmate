import { Task } from '../schemas/task.schema'
import { client as Sql } from '@effect/sql'
import { Console, Effect, Layer, pipe } from 'effect'
import { PgLive } from '../../config/db'
import { logSql } from '../helpers/sql.helper'
type LogSqlParams = Parameters<typeof logSql>

const logSqlAndDecodeOneResult = (a: LogSqlParams[0]) =>
  pipe(a, logSql, Effect.andThen(Task.decodeOne))

const makeTodoRepo = Effect.gen(function* () {
  const sql = yield* Sql.Client

  return {
    find: (id: number) =>
      pipe(sql`SELECT * FROM tasks WHERE id=${id}`, logSqlAndDecodeOneResult),
    insert: (task: Task) =>
      pipe(
        task.encode(),
        Effect.map(
          (eTask) => sql`INSERT INTO tasks ${sql.insert(eTask)} RETURNING *`,
        ),
        Effect.andThen(logSqlAndDecodeOneResult),
      ),
    update: (task: Task) =>
      pipe(
        task.encode(),
        Effect.map(
          (eTask) =>
            sql`UPDATE tasks SET ${sql.update(eTask)} where id=${eTask.id || 1} RETURNING *`,
        ),
        Effect.andThen(logSqlAndDecodeOneResult),
      ),
  }
})

export class TaskRepo extends Effect.Tag('@services/TaskRepo')<
  TaskRepo,
  Effect.Effect.Success<typeof makeTodoRepo>
>() {
  static layer = Layer.effect(this, makeTodoRepo)
}

const logSchema = (encodable: {
  encode: () => Effect.Effect<unknown, unknown, never>
}) => encodable.encode().pipe(Effect.tap(Console.log))

const find = (id: number) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.find(id)),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLive),
    Effect.andThen(logSchema),
    Effect.runPromise,
  )

const insert = (task: Task) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.insert(task)),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLive),
    Effect.andThen(logSchema),
    Effect.runPromise,
  )

const update = (task: Task) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.update(task)),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLive),
    Effect.andThen(logSchema),
    Effect.runPromise,
  )

// insert(new Task({ title: 'updated', completed: true, created: new Date() }))
find(17)
