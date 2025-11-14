"use client"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card"
import { useLogin } from "./index.hook"

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, onSubmit, goToForgot, goToRegister } = useLogin()

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="seu@email.com" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email?.message && <span className="text-sm text-destructive">{errors.email.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
              {errors.password?.message && <span className="text-sm text-destructive">{errors.password.message}</span>}
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="link" onClick={goToForgot}>Esqueci minha senha</Button>
          <Button variant="link" onClick={goToRegister}>Cadastrar</Button>
        </CardFooter>
      </Card>
    </div>
  )
}