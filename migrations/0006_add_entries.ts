import * as E from 'effect/Effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE entries (
      id serial PRIMARY KEY,
      date DATE NOT NULL,
      type varchar(50) NOT NULL,

      organization_id integer NOT NULL,

      account_debit_id integer NOT NULL,
      account_credit_id integer NOT NULL,
      account_pay_id integer NOT NULL,
      entry_wrapper_id integer NOT NULL,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

      FOREIGN KEY (organization_id) REFERENCES organizations(id),
      FOREIGN KEY (account_debit_id) REFERENCES accounts(id),
      FOREIGN KEY (account_credit_id) REFERENCES accounts(id),
      FOREIGN KEY (account_pay_id) REFERENCES accounts(id),
      FOREIGN KEY (entry_wrapper_id) REFERENCES entry_wrappers(id)
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
