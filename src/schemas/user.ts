import { Schema as S } from '@effect/schema'
import { pipe } from 'effect'
import { organization } from './organization'

export const user = S.Struct({
  id: S.Number,
  name: S.String,
  organizations: S.optional(S.Array(organization)),
})

export type User = S.Schema.Type<typeof user>

export const userDTO = pipe(user, S.omit('id', 'organizations'))

export type UserDTO = S.Schema.Type<typeof userDTO>
