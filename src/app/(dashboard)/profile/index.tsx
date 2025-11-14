'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import { Loader2, Upload, User } from 'lucide-react'
import { useProfile } from './index.hook'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'

export default function ProfileForm() {
  const {
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
  } = useProfile()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarPreview(URL.createObjectURL(file))
      handleUploadAvatar(file)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="password">Alterar Senha</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e foto de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={avatarPreview || profile?.avatar_url || undefined} 
                      alt="Foto de perfil" 
                    />
                    <AvatarFallback>
                      {profile?.full_name ? getInitials(profile.full_name) : <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-overlay/50 rounded-full">
                      <Loader2 className="h-4 w-4 animate-spin text-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="avatar">Foto de Perfil</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={uploadingAvatar}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, GIF até 5MB
                  </p>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    {...profileForm.register('full_name')}
                    placeholder="Seu nome completo"
                  />
                  {profileForm.formState.errors.full_name && (
                    <p className="text-sm text-destructive">
                      {profileForm.formState.errors.full_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register('email')}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email não pode ser alterado
                  </p>
                </div>

                <Button type="submit" disabled={updatingProfile}>
                  {updatingProfile && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Altere sua senha de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Senha Atual</Label>
                  <Input
                    id="current_password"
                    type="password"
                    {...passwordForm.register('current_password')}
                    placeholder="Sua senha atual"
                  />
                  {passwordForm.formState.errors.current_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.current_password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new_password">Nova Senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    {...passwordForm.register('new_password')}
                    placeholder="Sua nova senha"
                  />
                  {passwordForm.formState.errors.new_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.new_password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmar Nova Senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    {...passwordForm.register('confirm_password')}
                    placeholder="Confirme sua nova senha"
                  />
                  {passwordForm.formState.errors.confirm_password && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirm_password.message}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={updatingPassword}>
                  {updatingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Alterar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}