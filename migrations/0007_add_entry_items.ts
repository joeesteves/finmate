import * as E from 'effect/Effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE entry_items (
      id serial PRIMARY KEY,
      due_date DATE NOT NULL,
      type varchar(50) NOT NULL,

      entry_id integer NOT NULL,

      account_id integer NOT NULL,
      source_id integer NOT NULL,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

      FOREIGN KEY (entry_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (account_id) REFERENCES accounts(id),
      FOREIGN KEY (source_id) REFERENCES accounts(id)
    );
  `,
    ),
  down: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    DROP TABLE IF EXISTS entries
  `,
    ),
}
