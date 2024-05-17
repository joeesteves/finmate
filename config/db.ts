import { Config, Secret } from 'effect'
import * as Pg from '@effect/sql-pg'
import * as PgLite from '@effect/sql-sqlite-bun'

export const PgLive = Pg.client.layer({
  database: Config.succeed('mate_back_dev'),
  host: Config.succeed('0.0.0.0'),
  port: Config.succeed(5433),
  username: Config.succeed('postgres'),
  password: Config.succeed(Secret.fromString('postgres')),
})

export const PgLiveLite = PgLite.client.layer({
  filename: Config.succeed('db.sqlite'),
})
