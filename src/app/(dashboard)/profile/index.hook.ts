'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Profile } from '@/types/profile'
import { updatePasswordSchema, updateProfileSchema } from '@/validations/profile'

type ProfileFormData = {
  full_name: string
  email: string
  avatar_url?: string | null
}

type PasswordFormData = {
  current_password: string
  new_password: string
  confirm_password: string
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      avatar_url: null,
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })

  // Carregar dados do perfil
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/profile')
      
      if (!response.ok) {
        throw new Error('Erro ao carregar perfil')
      }

      const data = await response.json()
      setProfile(data.profile)
      
      profileForm.reset({
        full_name: data.profile?.full_name || '',
        email: data.user?.email || '',
        avatar_url: data.profile?.avatar_url || null,
      })
    } catch (error) {
      toast.error('Erro ao carregar perfil')
    } finally {
      setLoading(false)
    }
  }

  // Atualizar perfil
  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      setUpdatingProfile(true)
      
      // Remover email dos dados enviados, pois não deve ser atualizado
      const { email, ...updateData } = data

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar perfil')
      }

      const result = await response.json()
      setProfile(result.profile)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
    } finally {
      setUpdatingProfile(false)
    }
  }

  // Atualizar senha
  const handleUpdatePassword = async (data: PasswordFormData) => {
    try {
      setUpdatingPassword(true)
      
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: data.current_password,
          new_password: data.new_password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar senha')
      }

      toast.success('Senha atualizada com sucesso!')
      passwordForm.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar senha')
    } finally {
      setUpdatingPassword(false)
    }
  }

  // Upload de avatar
  const handleUploadAvatar = async (file: File) => {
    try {
      setUploadingAvatar(true)
      
      // Validar tipo e tamanho do arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem')
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Imagem deve ter no máximo 5MB')
      }

      // Fazer upload
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao fazer upload do avatar')
      }

      const result = await response.json()
      
      // Atualizar avatar_url no formulário e no estado
      profileForm.setValue('avatar_url', result.avatar_url)
      if (profile) {
        setProfile({ ...profile, avatar_url: result.avatar_url })
      }
      
      toast.success('Avatar atualizado com sucesso!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload do avatar')
    } finally {
      setUploadingAvatar(false)
    }
  }

  return {
    profile,
    loading,
    updatingProfile,
    updatingPassword,
    uploadingAvatar,
    profileForm,
    passwordForm,
    handleUpdateProfile,
    handleUpdatePassword,
    handleUploadAvatar,
  }
}