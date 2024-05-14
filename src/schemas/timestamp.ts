import { Schema } from '@effect/schema'

export const timestamps = Schema.Struct({
  created_at: Schema.DateFromSelf,
  updated_at: Schema.DateFromSelf,
}).pipe(Schema.rename({ created_at: 'createdAt', updated_at: 'updatedAt' }))
