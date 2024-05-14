import { Schema as S } from '@effect/schema'
import { pipe } from 'effect'

export const account = S.Struct({
  id: S.Number,
  name: S.String,
  type: S.Literal('assets', 'liabilities', 'equity', 'revenues', 'expenses'),
})

export type Account = S.Schema.Type<typeof account>
export type AccountType = Account['type']

export const accountDTO = pipe(account, S.omit('id'))

export type AccountDTO = S.Schema.Type<typeof accountDTO>
