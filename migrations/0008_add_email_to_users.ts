import { Effect as E } from 'effect'
import * as Sql from '@effect/sql'

export const migration = {
  up: () =>
    E.map(
      Sql.client.Client,
      (sql) => sql`
    CREATE EXTENSION IF NOT EXISTS citext;

    ALTER TABLE users
    ADD COLUMN email citext NOT NULL,
    ADD COLUMN password_hash BYTEA NOT NULL;

    CREATE UNIQUE INDEX ON users (email);
  `,
    ),
  down: () =>
    E.map(
      Sql.client.Client,
      (sql) => sql`
    ALTER TABLE users
    DROP COLUMN email
  `,
    ),
}
