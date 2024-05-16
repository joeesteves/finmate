import * as Pg from '@effect/sql'
import { Effect as E, Option as O, pipe, Array as A } from 'effect'
import { DB_LAYER } from '../layers/db.layer'
import { account, accountDTO, type Account } from '../schemas/account'
import { Schema } from '@effect/schema'

class NotFoundError {
  readonly _tag = 'NotFoundError'
  constructor(readonly message: string) {
    this.message = message
  }
}

const recordNotFound =
  (msg: string) =>
  <T>(o: O.Option<T>) =>
      pipe(
        o,
        O.map(E.succeed),
        O.getOrElse(() => E.fail(new NotFoundError(`${msg} not Found`))),
      )

export const getAccounts = () =>
  pipe(
    Pg.client.Client,
    E.map(
      (sql) => sql`
      SELECT * FROM accounts;
    `,
    ),
    DB_LAYER<Account[]>,
    E.flatMap(Schema.decodeUnknown(Schema.Array(account))),
  )

export const getAccount = (id: string) =>
  pipe(
    Pg.client.Client,
    E.map(
      (sql) => sql`
      SELECT * FROM accounts WHERE id = ${id}
    `,
    ),
    DB_LAYER<Account[]>,
    E.map(Schema.decodeUnknownOption(Schema.Array(account))),
    E.map(O.flatMap(A.head)),
    E.flatMap(recordNotFound(`Accound with id ${id}`)),
  )

export const createAccount = (accountDto: unknown) =>
  pipe(
    E.Do.pipe(
      E.bind('sql', () => Pg.client.Client),
      E.bind('decodedAccount', () =>
        Schema.decodeUnknown(accountDTO)(accountDto),
      ),
      E.map(({ decodedAccount, sql }) => {
        return sql`INSERT INTO accounts ${sql.insert(decodedAccount)} RETURNING *`
      }),
    ),
    DB_LAYER<Account[]>,
    E.map(Schema.decodeUnknownOption(Schema.Array(account))),
    E.map(O.flatMap(A.head)),
    E.flatMap(recordNotFound('Failed to create Account')),
  )
