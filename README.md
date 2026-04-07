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
3. `npm install`
4. `npm run dev`

## Endpoints internos
- `POST /api/push/subscribe`
- `PATCH /api/push/preferences`
- `POST /api/notifications/dispatch` (com `Authorization: Bearer <CRON_SECRET>`)
- `POST /api/duties/generate` (com `Authorization: Bearer <CRON_SECRET>`)
