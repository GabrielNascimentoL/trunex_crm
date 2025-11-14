import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"
import { verifyCsrf } from "../../../../lib/csrf"

export async function POST(req: Request) {
  if (!(await verifyCsrf(req))) {
    return NextResponse.json({ error: "CSRF inválido" }, { status: 403 })
  }
  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
  }
  const supabase = await createSupabaseServer()
  const { error } = await supabase.auth.resetPasswordForEmail(email)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}