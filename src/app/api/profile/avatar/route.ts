import { NextResponse } from "next/server"
import { createSupabaseServer } from "../../../../lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    
    // Verificar usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: "Arquivo não fornecido" }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não permitido" }, { status: 400 })
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Arquivo muito grande (máximo 5MB)" }, { status: 400 })
    }

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `avatars/${user.id}/${fileName}`

    // Converter o arquivo para buffer (compatível com ambiente Node)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fazer upload para o storage com contentType explícito
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error("Upload avatar error:", uploadError.message)
      return NextResponse.json({ error: "Erro ao fazer upload do arquivo", details: uploadError.message }, { status: 500 })
    }

    // Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('profiles')
      .getPublicUrl(filePath)

    // Atualizar perfil com a nova URL do avatar
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      // Se falhar ao atualizar o perfil, remover o arquivo
      await supabase.storage.from('profiles').remove([filePath])
      return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
    }

    return NextResponse.json({ 
      avatar_url: publicUrl,
      profile 
    })
  } catch (error) {
    console.error("Avatar route error:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}