import { Effect as E, LogLevel, Logger, Match, pipe } from 'effect'
import PgLive from '../config/db'
import migration from '../migrations/0001_add_users'
import { highlight as hl } from 'sql-highlight'

const migrationFx = pipe(
  process.env.MIGRATION_DIRECTION,
  Match.value,
  Match.when('up', migration.up),
  Match.when('down', migration.down),
  Match.orElse(() => E.fail('Invalid migration direction')),
)

pipe(
  migrationFx,
  E.flatMap((statement) => {
    const [sql, _params] = statement.compile()

    const log = pipe(sql, hl, E.logInfo)

    return E.all([log, statement])
  }),
  E.provide(PgLive),
  E.provide(Logger.minimumLogLevel(LogLevel.Info)),
  E.runPromise,
)
