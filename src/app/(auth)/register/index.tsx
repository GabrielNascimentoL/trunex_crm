"use client"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../../components/ui/card"
import { useRegister } from "./index.hook"

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, onSubmit, goToLogin } = useRegister()

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastrar</CardTitle>
          <CardDescription>Crie sua conta</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input id="confirmPassword" type="password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
              {errors.confirmPassword?.message && <span className="text-sm text-destructive">{errors.confirmPassword.message}</span>}
            </div>
            <div className="flex items-center gap-2">
              <input id="terms" type="checkbox" {...register("acceptTerms")} />
              <Label htmlFor="terms">Aceito os <a href="#" className="underline">Termos</a> e a <a href="#" className="underline">Política de Privacidade</a></Label>
            </div>
            {errors.acceptTerms?.message && <span className="text-sm text-destructive">{errors.acceptTerms.message}</span>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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