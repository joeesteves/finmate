import { Schema as S } from '@effect/schema'
import { pipe } from 'effect'
import { organization } from './organization'
import { passwordHash } from './passwordHash'

export const user = S.Struct({
  id: S.Number,
  name: S.String,
  email: S.String,
  organizations: S.optional(S.Array(organization), { default: () => [] }),
})

export type User = S.Schema.Type<typeof user>

export const userDTO = pipe(
  user,
  S.extend(S.Struct({ password: passwordHash })),
  S.omit('id', 'organizations'),
  S.rename({ password: 'password_hash' }),
)

export const userGET = pipe(
  user,
  S.extend(S.Struct({ password_hash: S.String })),
  S.omit('id', 'organizations'),
)

export type UserDTO = S.Schema.Type<typeof userDTO>
