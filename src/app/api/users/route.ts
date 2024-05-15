import { registerUser } from '@/services/user.service'
import { Effect } from 'effect'

export async function POST(request: Request) {
  const res = await request.json()

  return registerUser(res).pipe(
    Effect.andThen(Response.json),
    Effect.runPromise,
  )
}
