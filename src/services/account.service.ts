import * as SqlClient from '@effect/sql'
import { Console, Effect as E, pipe } from 'effect'

import { Config, Secret } from 'effect'
import * as PgClient from '@effect/sql-pg'
import * as PgClientLite from '@effect/sql-sqlite-bun'

// Using Pg client (using bun runtime) the promise keeps pending
// The code is halted on the Effect.provide(layer) line
export const PgLiveLayer = PgClient.client.layer({
  database: Config.succeed('mate_back_dev'),
  host: Config.succeed('0.0.0.0'),
  port: Config.succeed(5433),
  username: Config.succeed('postgres'),
  password: Config.succeed(Secret.fromString('postgres')),
})

// Using Sqlite client works as expected
export const PgLiveLiteLayer = PgClientLite.client.layer({
  filename: Config.succeed('db.sqlite'),
})

// if I move the console 1 line up, before providing the layer I can see the result
// but promise is still pending, so I can't see the lenght of the array
// Using the sqlite library, works as expected. It resolves the promise and I can see the length of the array
// No matter where I provide the layer
export const getAccounts = () =>
  pipe(
    SqlClient.client.Client,
    E.flatMap((sql) => sql`SELECT * FROM accounts limit 1`),
    E.tap(Console.log),
    E.provide(PgLiveLayer),
  )

getAccounts()
  .pipe(E.runPromise)
  .then((a) => console.log(`Total accounts: ${a.length}`))

// export const getAccount = (id: string) =>
//   pipe(
//     SqlClient.client.Client,
//     E.map(
//       (sql) => sql`
//       SELECT * FROM accounts WHERE id = ${id}
//     `,
//     ),
//     E.map(Schema.decodeUnknownOption(Schema.Array(account))),
//     E.map(O.flatMap(A.head)),
//     E.flatMap(recordNotFound(`Accound with id ${id}`)),
//     E.provide(PgLive),
//     E.tap(Console.log),
//   )
//
// export const createAccount = (accountDto: unknown) =>
//   pipe(
//     E.Do.pipe(
//       E.bind('sql', () => SqlClient.client.Client),
//       E.bind('decodedAccount', () =>
//         Schema.decodeUnknown(accountDTO)(accountDto),
//       ),
//       E.map(({ decodedAccount, sql }) => {
//         return sql`INSERT INTO accounts ${sql.insert(decodedAccount)} RETURNING *`
//       }),
//     ),
//     DBLayer<Account[]>,
//     E.map(Schema.decodeUnknownOption(Schema.Array(account))),
//     E.map(O.flatMap(A.head)),
//     E.flatMap(recordNotFound('Failed to create Account')),
//   )
//
// const recordNotFound =
//   (msg: string) =>
//   <T>(o: O.Option<T>) =>
//       pipe(
//         o,
//         O.map(E.succeed),
//         O.getOrElse(() => E.fail(new NotFoundError(`${msg} not Found`))),
//       )
//
// class NotFoundError {
//   readonly _tag = 'NotFoundError'
//   constructor(readonly message: string) {
//     this.message = message
//   }
// }
