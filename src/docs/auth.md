# Autenticação e Autorização (Supabase Auth)

## Endpoints

- `GET /api/auth/csrf`
  - Retorna `{ token }` e seta cookie `csrf-token` (httpOnly) para proteção CSRF.

- `POST /api/auth/login`
  - Body: `{ email: string, password: string }`
  - Headers: `x-csrf-token: <token>`
  - Sucesso: `200 { user }` e cookies de sessão (`sb-access-token`, `sb-refresh-token`).
  - Erro: `401 { error: string }`.

- `POST /api/auth/register`
  - Body: `{ email: string, password: string, acceptTerms: boolean }`
  - Headers: `x-csrf-token: <token>`
  - Sucesso: `200 { user }`. Cria registro em `public.profiles`.
  - Erro: `400 { error: string }`.

- `POST /api/auth/logout`
  - Headers: `x-csrf-token: <token>`
  - Sucesso: `200 { ok: true }` (invalida sessão).

- `POST /api/auth/reset-password`
  - Body: `{ email: string }`
  - Headers: `x-csrf-token: <token>`
  - Sucesso: `200 { ok: true }` (envia email de redefinição).

## Fluxos

- Login
  - Usuário envia email/senha via formulário.
  - Cliente busca `csrf` e inclui cabeçalho na requisição.
  - Endpoint autentica via Supabase e persiste cookies de sessão.
  - Redireciona para `/dashboard`.

- Registro
  - Usuário informa email/senha/confirmar e aceita os termos.
  - Endpoint `signUp` no Supabase e cria `profiles` com `user_id` e `email`.
  - Supabase dispara email de confirmação (se habilitado).
  - Redireciona para `/dashboard`.

- Recuperação de Senha
  - Usuário informa email.
  - Endpoint aciona `resetPasswordForEmail`.
  - Usuário recebe email para redefinir.

## Segurança

- CSRF: Double-submit (cookie `csrf-token` + header `x-csrf-token`).
- RLS em `public.profiles`:
  - Visualizar/atualizar apenas o próprio registro.
  - Inserção restrita ao próprio `user_id`.

## Sessão

- Persistência via cookies gerenciados pelo `@supabase/ssr`.
- Middleware protege `/dashboard` verificando presença de `sb-access-token`.

## Tabela `public.profiles`

- `user_id uuid` (PK, referência `auth.users.id`, cascade delete)
- `email text` (único, não nulo)
- `created_at timestamptz` (default `now()`)

## Variáveis de Ambiente

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`