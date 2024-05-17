import { Effect as E, Console, pipe } from 'effect'
import type * as SQL from '@effect/sql'
import { PgLiveLiteLayer } from '../../config/db'
import { highlight as hl } from 'sql-highlight'

import type { ParseError } from '@effect/schema/ParseResult'
import type { Statement } from '@effect/sql/Statement'
import type { Row } from '@effect/sql/Connection'

const DBLayer = <T>(
  ef: E.Effect<Statement<Row>, ParseError, SQL.client.Client>,
) =>
    pipe(
      ef,
      E.flatMap((statement) => {
        const [sql, _params] = statement.compile()

        const log = pipe(sql, hl, Console.log)
        return E.all([log, statement])
      }),
      E.map(([_, result]) => result as T),
      E.tap(E.logInfo),
      E.provide(PgLiveLiteLayer),
    )

export { DBLayer }
