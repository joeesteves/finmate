import { Task } from '@/schemas/task.schema'
import { client as Sql } from '@effect/sql'
import { Console, Effect, Layer, pipe } from 'effect'
import { PgLiveLiteLayer } from '../../config/db'
import type { Statement } from '@effect/sql/Statement'
import type { Row } from '@effect/sql/Connection'
import { highlight as hl } from 'sql-highlight'

const logSql = (statement: Statement<Row>) => {
  const [sql, params] = statement.compile()

  pipe(sql, hl, (a) => console.log(a, params))
  return statement
}

const makeTodoRepo = Sql.Client.pipe(
  Effect.andThen((sql) => ({
    getOne: (id: number) =>
      sql`SELECT * FROM tasks WHERE id=${id}`.pipe(
        Effect.andThen(Task.decodeOne),
      ),
    upsert: (task: Task) =>
      task
        .encode()
        .pipe(
          Effect.map((encodedTask) =>
            sql`INSERT INTO tasks ${sql.insert(encodedTask)} returning *`.pipe(
              logSql,
              Effect.andThen(Task.decodeOne),
            ),
          ),
        ),
  })),
)

export class TaskRepo extends Effect.Tag('@services/TaskRepo')<
  TaskRepo,
  Effect.Effect.Success<typeof makeTodoRepo>
>() {
  static layer = Layer.effect(this, makeTodoRepo)
}

const logSchema = (encodable: {
  encode: () => Effect.Effect<unknown, unknown, never>
}) => encodable.encode().pipe(Effect.tap(Console.log))

// const getById = (id: number) =>
//   TaskRepo.pipe(
//     Effect.andThen((r) => r.getOne(id)),
//     Effect.tap(logSchema),
//     Effect.provide(TaskRepo.layer),
//     Effect.provide(),
//     Effect.runSync,
//   )

const upsertTask = (task: Task) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.upsert(task)),
    Effect.provide(TaskRepo.layer),
    Effect.provide(PgLiveLiteLayer),
    Effect.runSync,
  )

upsertTask(
  new Task({ id: 2, title: 'update', completed: 0, created: new Date() }),
)
