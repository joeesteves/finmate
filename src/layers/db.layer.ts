import { Effect as E, LogLevel, Logger, pipe } from 'effect'
import type * as Pg from '@sqlfx/pg'
import PgLive from '../../config/db'
import { highlight as hl } from 'sql-highlight'
import type { Statement } from '@sqlfx/sql/Statement'
import type { Row } from '@sqlfx/sql/Connection'
import type { ParseError } from '@effect/schema/ParseResult'

export default <T>(ef: E.Effect<Statement<Row>, ParseError, Pg.PgClient>) =>
  pipe(
    ef,
    E.flatMap((statement) => {
      const [sql, _params] = statement.compile()

      const log = pipe(sql, hl, E.logInfo)

      return E.all([log, statement])
    }),
    E.map(([_, result]) => result as T),
    E.provide(PgLive),
    E.provide(Logger.minimumLogLevel(LogLevel.Info)),
  )
