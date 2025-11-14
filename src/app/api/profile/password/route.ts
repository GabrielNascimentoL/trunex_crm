import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"

export async function PUT(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    
    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { current_password, new_password } = body

    // Validar dados
    if (!current_password || !new_password) {
      return NextResponse.json({ error: "Senhas são obrigatórias" }, { status: 400 })
    }

    if (new_password.length < 6) {
      return NextResponse.json({ error: "Nova senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    // Verificar senha atual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: current_password,
    })

    if (signInError) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 })
    }

    // Atualizar senha
    const { error: updateError } = await supabase.auth.updateUser({
      password: new_password,
    })

    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar senha" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}