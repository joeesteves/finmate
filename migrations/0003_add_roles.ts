import * as E from 'effect/Effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE roles (
      id serial PRIMARY KEY,
      name varchar(255) NOT NULL,
      user_id integer NOT NULL,
      organization_id integer NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE INDEX ON roles (name);
    CREATE UNIQUE INDEX ON roles (userId, organizationId);
  `,
    ),
  down: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    DROP TABLE IF EXISTS roles
  `,
    ),
}
