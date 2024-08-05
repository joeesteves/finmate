import { hashSync } from 'bcrypt'
import { AST, ParseResult } from '@effect/schema'
import { type Annotable, transformOrFail, make } from '@effect/schema/Schema'

interface $String extends Annotable<$String, string> {}
interface PasswordHash extends Annotable<PasswordHash, string, string> {}

const $String: $String = make(AST.stringKeyword)

export const passwordHash: PasswordHash = transformOrFail($String, $String, {
  decode: (s) => ParseResult.succeed(s),
  encode: (s) => ParseResult.succeed(hashSync(s, 10)),
}).annotations({ identifier: 'PasswordHash' })
