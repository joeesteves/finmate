import * as E from 'effect/Effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE accounts (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      type varchar(255) NOT NULL,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE UNIQUE INDEX ON accounts (name);
  `,
    ),
  down: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    DROP TABLE IF EXISTS accounts
  `,
    ),
}
