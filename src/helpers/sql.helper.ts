import type { Statement } from '@effect/sql/Statement'
import type { Row } from '@effect/sql/Connection'

import { Console, Effect, pipe } from 'effect'
import { highlight as hl } from 'sql-highlight'

export const logSql = (statement: Statement<Row>) => {
  const [sql, params] = statement.compile()

  const log = pipe(sql, hl, (a) => Console.log(a, params))

  return Effect.all([statement, log]).pipe(Effect.map(([r, _l]) => r))
}
