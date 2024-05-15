import { getUserByEmail } from '@/services/user.service'
import { compareSync } from 'bcrypt'
import { Effect } from 'effect'

export async function POST(request: Request) {
  const res = await request.json()

  return getUserByEmail(res.email).pipe(
    Effect.andThen((user) => ({
      valid: compareSync(res.password, user.password_hash),
    })),
    Effect.andThen(Response.json),
    Effect.runPromise,
  )
}
