import { Schema } from '@effect/schema'
import { pipe } from 'effect'

export const organization = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  role: Schema.String,
})

export type Organization = Schema.Schema.Type<typeof organization>

export const organizationDTO = pipe(organization, Schema.omit('id', 'role'))

export type OrganizationDTO = Schema.Schema.Type<typeof organizationDTO>
