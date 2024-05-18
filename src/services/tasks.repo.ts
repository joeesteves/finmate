import { client as SqlClient } from '@effect/sql'
import { highlight as hl } from 'sql-highlight'
import { Task } from '@/schemas/task.schema'

import { Console, Context, Effect, Layer, pipe } from 'effect'
import { PgLiveLiteLayer } from '../../config/db'
import type { Argument } from '@effect/sql/Statement'

const sqlClientWithDebug = (
  sqlString: TemplateStringsArray,
  ...params: Argument[]
) =>
  SqlClient.Client.pipe(
    Effect.flatMap((sql) =>
      sql(sqlString, ...params).pipe((statement) => {
        const [sql, params] = statement.compile()

        pipe(sql, hl, (psql) => console.log(psql, params))

        return statement
      }),
    ),
    Effect.provide(PgLiveLiteLayer),
  )

const sqlClient = (sqlString: TemplateStringsArray, ...params: Argument[]) =>
  SqlClient.Client.pipe(
    Effect.flatMap((sql) => sql(sqlString, ...params)),
    Effect.provide(PgLiveLiteLayer),
  )

const tag = Context.GenericTag<typeof sqlClient>('@services/sqlClient')
const l1 = Layer.effect(tag, Effect.succeed(sqlClient))
const l2 = Layer.effect(tag, Effect.succeed(sqlClientWithDebug))

const makeTodoRepo = tag.pipe(
  Effect.andThen((sql) => ({
    getOne: (id: number) =>
      sql`SELECT * FROM tasks WHERE id=${id}`.pipe(
        Effect.andThen(Task.decodeOne),
      ),
    upsert: (task: Task) =>
      sql`INSERT INTO tasks (id, title, completed, created) VALUES (${task.id}, ${task.title}, ${task.completed}, date('now')) ON CONFLICT (id) DO UPDATE SET title=${task.title}, completed=${task.completed}  returning *`.pipe(
        Effect.andThen(Task.decodeOne),
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

const getById = (id: number) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.getOne(id)),
    Effect.tap(logSchema),
    Effect.provide(TaskRepo.layer),
    Effect.provide(l2),
    Effect.runSync,
  )

const upsertTask = (task: Task) =>
  TaskRepo.pipe(
    Effect.andThen((r) => r.upsert(task)),
    Effect.tap(logSchema),
    Effect.provide(TaskRepo.layer),
    Effect.provide(l2),
    Effect.runSync,
  )

upsertTask(
  new Task({ id: 2, title: 'update', completed: 0, created: new Date() }),
)
