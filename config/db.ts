import { Config, Secret } from 'effect'
import * as P from '@effect/sql-pg'

export default P.client.layer({
  database: Config.succeed('mate_back_dev'),
  host: Config.succeed('0.0.0.0'),
  port: Config.succeed(5433),
  username: Config.succeed('postgres'),
  password: Config.succeed(Secret.fromString('postgres')),
})
