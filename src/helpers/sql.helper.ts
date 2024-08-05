import type { Statement } from '@effect/sql/Statement'
import type { Row } from '@effect/sql/Connection'

import { Console, Effect, pipe } from 'effect'
import { highlight } from 'sql-highlight'

export const logStatement = (statement: Statement<Row>) => {
  const [sql, params] = statement.compile()

  const log = pipe(sql, highlight, (statement) =>
    Console.log(statement, params),
  )

  return Effect.all([statement, log]).pipe(Effect.map(([r, _l]) => r))
}
