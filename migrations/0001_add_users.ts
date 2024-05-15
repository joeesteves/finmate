import { Effect as E } from 'effect'
import * as Sql from '@effect/sql'

const migration = {
  up: () =>
    E.map(
      Sql.client.Client,
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
      Sql.client.Client,
      (sql) => sql`
    DROP TABLE IF EXISTS users
  `,
    ),
}

export default migration
