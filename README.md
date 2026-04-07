# Plantão Farmácias GCU

Base inicial de um sistema web completo para gestão de plantão rotativo de farmácias, promoções semanais e notificações push.

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase + PostgreSQL
- Supabase Auth + RLS
- React Hook Form + Zod
- date-fns

## Estrutura principal
- Arquitetura e roadmap: `docs/ARCHITECTURE.md`
- Modelagem SQL completa + RLS: `supabase/migrations/20260407162000_initial_schema.sql`
- Tipos de domínio: `src/types/domain.ts`

## Segurança
- Nunca commitar `.env*` privados.
- Use `.env.example` como template.
- Se qualquer senha/token for exposta, rotacionar imediatamente no provedor.

## Setup rápido
1. `cp .env.example .env.local`
2. Preencher variáveis do Supabase e Web Push.
3. Definir no mínimo:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
   - `SUPABASE_SERVICE_ROLE_KEY` (ou `SUPABASE_SECRET_KEY`)
   - `NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS` (ex.: `brunokalebe@gmail.com`)
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - `TURNSTILE_SECRET_KEY`
4. `npm install`
5. `npm run dev`

## Configuração Auth (Supabase)
- Em `Auth > URL Configuration`, adicionar:
  - `https://plantaofarmaciasgcu.vercel.app/auth/callback`
- Para favoritar/notificações sem login manual, habilitar `Anonymous Sign-Ins` em `Auth > Providers > Anonymous`.

## Captcha invisível (Cloudflare Turnstile)
- O envio de link mágico em `/login` passa por captcha invisível via endpoint `POST /api/auth/magic-link`.
- Sem as variáveis do Turnstile, o envio do link é bloqueado para evitar abuso/spam.

## Endpoints internos
- `POST /api/push/subscribe`
- `PATCH /api/push/preferences`
- `POST /api/notifications/dispatch` (com `Authorization: Bearer <CRON_SECRET>`)
- `POST /api/duties/generate` (com `Authorization: Bearer <CRON_SECRET>`)
