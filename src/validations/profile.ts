import { z } from 'zod'

export const updateProfileSchema = z.object({
  full_name: z.string().min(1, 'Nome completo é obrigatório').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  avatar_url: z.string().url('URL inválida').nullable().optional(),
})

export const updatePasswordSchema = z.object({
  current_password: z.string().min(1, 'Senha atual é obrigatória'),
  new_password: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirm_password: z.string().min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: 'As senhas não coincidem',
  path: ['confirm_password'],
})