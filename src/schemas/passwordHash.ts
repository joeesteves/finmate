import { AST, ParseResult } from '@effect/schema'
import { type Annotable, transformOrFail, make } from '@effect/schema/Schema'

interface $String extends Annotable<$String, string> {}
interface PasswordHash extends Annotable<PasswordHash, string, string> {}

const $String: $String = make(AST.stringKeyword)

export const passwordHash: PasswordHash = transformOrFail($String, $String, {
  decode: (s) => ParseResult.succeed(Bun.password.hashSync(s)),
  encode: (s) => ParseResult.succeed(s),
}).annotations({ identifier: 'StringFromNumber' })
