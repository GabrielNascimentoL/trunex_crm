import { createSupabaseServer } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

// GET: Buscar perfil do usuário
export async function GET() {
  try {
    const supabase = await createSupabaseServer()
    
    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

  // Buscar perfil
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (profileError && profileError.code !== 'PGRST116') {
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
  }

  // Se não existir perfil, criar um
  if (!profile) {
    // Tentar localizar perfil legado pelo id
    const { data: legacyProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (legacyProfile) {
      // Atualizar para o novo schema
      const { data: updatedLegacy } = await supabase
        .from('profiles')
        .update({
          user_id: user.id,
          full_name: legacyProfile.full_name ?? (user.email?.split('@')[0] || 'Usuário'),
        })
        .eq('id', legacyProfile.id)
        .select()
        .single()

      return NextResponse.json({ 
        profile: updatedLegacy,
        user: {
          id: user.id,
          email: user.email,
        }
      })
    }

    // Criar novo perfil
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        full_name: user.email?.split('@')[0] || 'Usuário',
        avatar_url: null,
      })
      .select()
      .single()

    if (createError) {
      return NextResponse.json({ error: "Erro ao criar perfil" }, { status: 500 })
    }

    return NextResponse.json({ 
      profile: newProfile,
      user: {
        id: user.id,
        email: user.email,
      }
    })
  }

    return NextResponse.json({ 
      profile,
      user: {
        id: user.id,
        email: user.email,
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

// PUT: Atualizar perfil
export async function PUT(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    
    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()
    const { full_name, avatar_url } = body

    // Validar dados
    if (!full_name || typeof full_name !== 'string') {
      return NextResponse.json({ error: "Nome completo é obrigatório" }, { status: 400 })
    }

    // Atualizar perfil
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: full_name.trim(),
        avatar_url: avatar_url || null,
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}