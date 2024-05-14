import { Schema } from '@effect/schema'
import { pipe } from 'effect'

export const role = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  userId: Schema.Number,
  organizationId: Schema.Number,
})

export type Role = Schema.Schema.Type<typeof role>

export const roleDTO = pipe(role, Schema.omit('id'))

export type RoleDTO = Schema.Schema.Type<typeof roleDTO>
