import { Schema as S, Schema } from '@effect/schema'
import type { User } from '../schemas/user'
import { user, userDTO, userGET } from '../schemas/user'
import * as Pg from '@effect/sql'
import { Effect as E, Array as A, Option as O, pipe } from 'effect'
import Db from '../layers/db.layer'
import { organization, type Organization } from '../schemas/organization'

export const getUserWithOrganizations = (id: string) => {
  const user = getUser(id)
  const organizations = getUserOrganizations(id)

  return E.all([user, organizations]).pipe(
    E.map(([user, organizations]) => {
      return { ...user, organizations }
    }),
  )
}

const getUserOrganizations = (id: string) =>
  pipe(
    Pg.client.Client,
    E.map(
      (sql) => sql`
      SELECT organizations.*, roles.name as role FROM organizations
      JOIN roles on roles.organizationId = organizations.id
      WHERE roles.userId = ${id}
    `,
    ),
    Db<Organization[]>,
    E.map(S.decodeUnknownOption(S.Array(organization))),
    E.map(O.getOrElse(() => [])),
  )

export const getUser = (id: string) =>
  pipe(
    Pg.client.Client,
    E.map((sql) => sql`SELECT * FROM users where id = ${id}`),
    Db<User[]>,
    E.map(A.head),
    E.map(O.map(S.decodeUnknownOption(user))),
    E.flatMap(O.getOrThrowWith(() => 'User not found')),
  )

export const getUsers = () =>
  pipe(
    Pg.client.Client,
    E.map((sql) => sql`SELECT * FROM users`),
    Db<User[]>,
    E.flatMap(Schema.decodeUnknown(Schema.Array(user))),
  )

export const registerUser = (userInput: unknown) =>
  pipe(
    E.Do.pipe(
      E.bind('sql', () => Pg.client.Client),
      E.bind('decodedUser', () => S.decodeUnknown(userDTO)(userInput)),
      E.tap(E.logInfo),
      E.map(({ decodedUser, sql }) => {
        return sql`INSERT INTO users ${sql.insert(decodedUser)} RETURNING *`
      }),
    ),
    Db<User[]>,
    E.flatMap(Schema.decodeUnknown(Schema.Array(userGET))),
  )

export const getUserByEmail = (email: string) =>
  pipe(
    Pg.client.Client,
    E.map((sql) => sql`SELECT * FROM users where email = ${email}`),
    Db<User[]>,
    E.map(A.head),
    E.map(O.map(S.decodeUnknownOption(userGET))),
    E.flatMap(O.getOrThrowWith(() => 'User not found')),
  )
