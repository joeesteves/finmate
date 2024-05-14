import * as S from '@effect/schema/Schema'
import * as Pg from '@sqlfx/pg'
import { Effect as E, Option as O, pipe, Array as A } from 'effect'
import Db from '../layers/db.layer'
import { Schema } from '@effect/schema'
import {
  entryWrapper,
  entryWrapperDTO,
  type EntryWrapper,
} from '../schemas/entryWrapper'

export const getEntryWrappers = () =>
  pipe(
    Pg.tag,
    E.map(
      (sql) => sql`
      SELECT * FROM entry_wrappers;
    `,
    ),
    Db<EntryWrapper[]>,
    E.map(Schema.decodeUnknownOption(Schema.Array(entryWrapper))),
    E.map(O.getOrElse(() => [])),
  )

export const getEntryWrapper = (id: string) =>
  pipe(
    Pg.tag,
    E.map(
      (sql) => sql`
      SELECT * FROM entry_wrappers WHERE id = ${id}
    `,
    ),
    Db<EntryWrapper[]>,
    E.map(Schema.decodeUnknownOption(Schema.Array(entryWrapper))),
    E.map(O.flatMap(A.head)),
    E.flatMap(recordNotFound(`Accound with id ${id}`)),
  )

export const createAccount = (entryWrapperInputDTO: unknown) =>
  pipe(
    E.Do.pipe(
      E.bind('sql', () => Pg.tag),
      E.bind('decodedEntryWrapper', () =>
        S.decodeUnknown(entryWrapperDTO)(entryWrapperInputDTO),
      ),
      E.map(({ decodedEntryWrapper, sql }) => {
        return sql`INSERT INTO entry_wrappers ${sql.insert(decodedEntryWrapper)} RETURNING *`
      }),
    ),
    Db<EntryWrapper[]>,
    E.map(Schema.decodeUnknownOption(Schema.Array(entryWrapper))),
    E.map(O.flatMap(A.head)),
    E.flatMap(recordNotFound('Failed to create EntryWrapper')),
  )

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
