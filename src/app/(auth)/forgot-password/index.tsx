"use client"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card"
import { useForgotPassword } from "./index.hook"

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, onSubmit, goToLogin } = useForgotPassword()

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar senha</CardTitle>
          <CardDescription>Informe seu email para redefinir sua senha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email?.message && <span className="text-sm text-destructive">{errors.email.message}</span>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="link" onClick={goToLogin}>Voltar ao login</Button>
        </CardFooter>
      </Card>
    </div>
  )
}