"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const passwordSchema = z
  .string()
  .min(8, "Senha deve ter ao menos 8 caracteres")
  .regex(/[A-Z]/, "Inclua letra maiúscula")
  .regex(/[a-z]/, "Inclua letra minúscula")
  .regex(/\d/, "Inclua número")

const schema = z
  .object({
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })
  .refine((v) => v.acceptTerms === true, {
    message: "É necessário aceitar os termos",
    path: ["acceptTerms"],
  })

export function useRegister() {
  const router = useRouter()
  const [csrf, setCsrf] = useState<string>("")
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { acceptTerms: false } })

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {})
  }, [])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify({ email: values.email, password: values.password, acceptTerms: values.acceptTerms }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error ?? "Falha no cadastro")
      return
    }
    toast.success("Cadastro realizado. Verifique seu email.")
    router.replace("/dashboard")
  }

  const goToLogin = () => router.push("/login")

  return { ...form, onSubmit, goToLogin }
}