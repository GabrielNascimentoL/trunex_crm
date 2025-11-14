import { cookies } from "next/headers"

export async function verifyCsrf(req: Request) {
  const headerToken = req.headers.get("x-csrf-token")
  const cookieToken = (await cookies()).get("csrf-token")?.value
  return Boolean(headerToken && cookieToken && headerToken === cookieToken)
}

export function newCsrfToken() {
  return crypto.randomUUID()
}