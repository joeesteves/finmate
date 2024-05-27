import { Console, Effect, Option } from 'effect'
Effect.succeed(null).pipe(
  Effect.map(Option.fromNullable),
  Effect.map(Option.getOrElse(() => 'default')),
  Effect.tap(Console.log),
  Effect.runSync,
)
