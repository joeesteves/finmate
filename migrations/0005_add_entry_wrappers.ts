import * as E from 'effect/Effect'
import * as Pg from '@sqlfx/pg'

export default {
  up: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    CREATE TABLE entry_wrappers (
      id serial PRIMARY KEY,
      status varchar(50) NOT NULL,
      amount decimal NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      recurring boolean NOT NULL DEFAULT false,
      periodicity_type varchar(50) NOT NULL,
      periodicity integer NOT NULL,

      organization_id integer NOT NULL,

      account_debit_id integer NOT NULL,
      account_credit_id integer NOT NULL,
      account_pay_id integer NOT NULL,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

      FOREIGN KEY (organization_id) REFERENCES organizations(id),

      FOREIGN KEY (account_debit_id) REFERENCES accounts(id),
      FOREIGN KEY (account_credit_id) REFERENCES accounts(id),
      FOREIGN KEY (account_pay_id) REFERENCES accounts(id)
    );
  `,
    ),
  down: () =>
    E.map(
      Pg.tag,
      (sql) => sql`
    DROP TABLE IF EXISTS entry_wrappers
  `,
    ),
}
