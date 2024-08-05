import type { Row } from '@effect/sql/Connection'

import { Schema } from '@effect/schema'
import { Console, Effect } from 'effect'
import { passwordHash } from './passwordHash'

interface UserEncoded extends Schema.Schema.Encoded<typeof User> {}

export class User extends Schema.Class<User>('User')({
  id: Schema.optional(Schema.Number),
  name: Schema.String,
  email: Schema.String,
}) {
  // static decodeOne(input: readonly Row[]) {
  //   return Effect.succeed(input).pipe(
  //     Effect.head,
  //     Effect.andThen(Schema.decodeUnknown(this)),
  //   )
  // }
  //
  // encode() {
  //   return Schema.encode(User)(this).pipe(Effect.map((t: UserEncoded) => t))
  // }
}

export class UserWithPassword extends User.extend<UserWithPassword>(
  'UserWithPassword',
)({
  password: Schema.String,
}) {}

export class UserWithPasswordHash extends User.extend<UserWithPasswordHash>(
  'UserWithPassword',
)({
  password_hash: passwordHash,
}) {}

const userInput = {
  name: 'John Doe',
  email: 'dsadsa',
  password: 'dsadsa',
}

Schema.decodeUnknown(UserWithPassword)(userInput).pipe(
  Effect.map((t) => ({ ...t, password_hash: t.password })),
  Effect.andThen(Schema.encode(UserWithPasswordHash)),
  Effect.tap(Console.log),
  Effect.andThen(Schema.decodeUnknown(UserWithPasswordHash)),
  Effect.tap((a) => Console.log(a.toString())),
  Effect.runSync,
)
