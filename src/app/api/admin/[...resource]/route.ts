import { getAccounts } from '@/services/account.service'
import { getUsers } from '@/services/user.service'
import { Effect, Match } from 'effect'

class UnexistantResourceError extends Error {
  readonly _tag = 'UnexistantResource'
  constructor(resource: string) {
    super(`Resource ${resource} doesn't existe. Check your url and try again`)
  }
}

export async function GET(
  request: Request,
  { params: { resource } }: { params: { resource: string[] } },
) {
  const [service, _] = resource

  return Match.value(service).pipe(
    Match.when('accounts', () => getAccounts()),
    Match.when('users', () => getUsers()),
    Match.orElse((resource) =>
      Effect.fail(new UnexistantResourceError(resource)),
    ),
    Effect.catchTag('UnexistantResource', (e) =>
      Effect.succeed({ error: e.message }),
    ),
    Effect.andThen((a) =>
      Response.json(a, { headers: { Cookie: 'token=123' } }),
    ),
    Effect.runPromise,
  )
}
