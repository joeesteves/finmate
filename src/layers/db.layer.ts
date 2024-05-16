import { Effect as E, LogLevel, Logger, pipe } from 'effect'
import type * as SQL from '@effect/sql'
import PgLive from '../../config/db'
import { highlight as hl } from 'sql-highlight'

import type { ParseError } from '@effect/schema/ParseResult'
import type { Statement } from '@effect/sql/Statement'
import type { Row } from '@effect/sql/Connection'

const DB_LAYER = <T>(
  ef: E.Effect<Statement<Row>, ParseError, SQL.client.Client>,
) =>
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

export { DB_LAYER }
