import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"
import { verifyCsrf } from "../../../../lib/csrf"

export async function POST(req: Request) {
  if (!(await verifyCsrf(req))) {
    return NextResponse.json({ error: "CSRF inválido" }, { status: 403 })
  }

  const { email, password, acceptTerms } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
  }
  if (!acceptTerms) {
    return NextResponse.json({ error: "É necessário aceitar os termos" }, { status: 400 })
  }

  const supabase = await createSupabaseServer()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (data.user) {
    await supabase
      .from("profiles")
      .insert({ id: data.user.id, email })
  }

  return NextResponse.json({ user: data.user })
}