import { NextResponse } from "next/server"
import { newCsrfToken } from "../../../../lib/csrf"

export async function GET() {
  const token = newCsrfToken()
  const res = NextResponse.json({ token })
  res.cookies.set("csrf-token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  })
  return res
}