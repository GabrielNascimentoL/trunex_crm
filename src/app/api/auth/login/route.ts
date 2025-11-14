import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"
import { verifyCsrf } from "../../../../lib/csrf"

export async function POST(req: Request) {
  if (!(await verifyCsrf(req))) {
    return NextResponse.json({ error: "CSRF inválido" }, { status: 403 })
  }

  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
  }

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  const response = NextResponse.json({ user: data.user })
  
  // Definir cookie de autenticação para o middleware
  response.cookies.set('sb-access-token', data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: data.session.expires_in
  })

  return response
}