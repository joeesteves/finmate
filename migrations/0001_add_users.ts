import { Effect as E } from 'effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE INDEX ON users (name);
  `,
    ),
  down: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    DROP TABLE IF EXISTS users
  `,
    ),
}
