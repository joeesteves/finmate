import { getAccounts } from '@/services/account.service'
import { debug } from 'console'
import { Effect } from 'effect'

export async function GET(
  _request: Request,
  { params: { resource } }: { params: { resource: string } },
) {
  debugger
  const accounts = await Effect.runPromise(getAccounts())
  return Response.json(accounts)
}
