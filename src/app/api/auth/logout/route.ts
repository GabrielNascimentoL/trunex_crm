import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"
import { verifyCsrf } from "../../../../lib/csrf"

export async function POST(req: Request) {
  if (!(await verifyCsrf(req))) {
    return NextResponse.json({ error: "CSRF inválido" }, { status: 403 })
  }
  const supabase = await createSupabaseServer()
  await supabase.auth.signOut()
  
  const response = NextResponse.json({ ok: true })
  
  // Limpar cookie de autenticação
  response.cookies.delete('sb-access-token')
  
  return response
}