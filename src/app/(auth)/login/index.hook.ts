"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

export function useLogin() {
  const router = useRouter()
  const [csrf, setCsrf] = useState<string>("")
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {})
  }, [])

  const onSubmit = async (values: z.infer<typeof schema>) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: JSON.stringify(values),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error ?? "Falha no login")
      return
    }
    toast.success("Login realizado")
    router.replace("/dashboard")
  }

  const goToForgot = () => router.push("/forgot-password")
  const goToRegister = () => router.push("/register")

  return { ...form, onSubmit, goToForgot, goToRegister }
}