import { Schema as S } from '@effect/schema'
import { pipe } from 'effect'

export const entryWrapper = S.Struct({
  id: S.Number,
  status: S.optional(S.Literal('active', 'inactive'), {
    default: () => 'active',
  }),
  startDate: S.Date,
  endDate: S.Date,
  amount: S.Number,
  recurrent: S.optional(S.Boolean, { default: () => false }),
  periodicity: S.optional(S.Number, { default: () => 1 }),
  // periodictyBuffer: S.Number,
  periodictyType: S.optional(S.Literal('day', 'month', 'years'), {
    default: () => 'month',
  }),
})

export type EntryWrapper = S.Schema.Type<typeof entryWrapper>

export const entryWrapperDTO = pipe(entryWrapper, S.omit('id'))

export type EntryWrapperDTO = S.Schema.Type<typeof entryWrapperDTO>
