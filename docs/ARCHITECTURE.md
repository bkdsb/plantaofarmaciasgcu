# Arquitetura Técnica - Plantão Farmácias GCU

## 1) Visão Geral
Arquitetura orientada a **App Router + Supabase** com separação entre:
- **Área pública**: foco no plantão atual, promoções e preferências.
- **Área admin (superadmin)**: gestão centralizada de farmácias, plantões, promoções, banners e notificações.
- **Camada de domínio**: validações Zod, regras de agendamento e templates de notificação.

Modelo inicial de tenant único (superadmin central), preparado para evolução multi-tenant.

## 2) Estrutura de Pastas

```txt
src/
  app/
    (public)/
      page.tsx
      plantao/page.tsx
      plantao/historico/page.tsx
      promocoes/page.tsx
      farmacias/[slug]/page.tsx
      preferencias/page.tsx
      institucional/page.tsx
    (auth)/
      login/page.tsx
    (admin)/
      admin/layout.tsx
      admin/page.tsx
      admin/farmacias/page.tsx
      admin/plantoes/page.tsx
      admin/promocoes/page.tsx
      admin/banners/page.tsx
      admin/notificacoes/page.tsx
      admin/configuracoes/page.tsx
    api/
      push/subscribe/route.ts
      push/preferences/route.ts
      notifications/dispatch/route.ts
      duties/generate/route.ts
  actions/
    admin/
      duty-actions.ts
      promotion-actions.ts
    public/
      preferences-actions.ts
  components/
    ui/
    public/
    admin/
    auth/
  lib/
    auth/
    notifications/
    schedules/
    supabase/
    validators/
  types/
public/
  sw.js
  manifest.webmanifest
supabase/
  migrations/
    20260407162000_initial_schema.sql
```

## 3) Modelagem de Dados
Tabelas principais implementadas no migration:
- `profiles`
- `pharmacies`
- `pharmacy_users`
- `duty_schedules`
- `promotion_weeks`
- `promotion_products`
- `banners`
- `push_subscriptions`
- `user_notification_preferences`
- `user_favorite_pharmacies`
- `notifications`
- `notification_deliveries`
- `settings`

Regras de integridade importantes:
- `slug` único em `pharmacies`
- bloqueio de sobreposição de plantão por intervalo com `EXCLUDE USING gist` em `duty_schedules`
- máximo de 10 produtos ativos por semana via trigger `enforce_product_limit_per_week`
- `promotion_price <= normal_price`
- `event_key + type + channel` único em `notifications` (idempotência)
- uma favorita principal por usuário (índice parcial)

## 4) Perfis e Permissões (RLS)

### Superadmin
- CRUD total em todas as tabelas de gestão.

### Farmácia
- leitura dos dados da própria farmácia, seus plantões/promoções associados.

### Público autenticado
- leitura pública de dados publicados/ativos.
- gerencia próprios favoritos, inscrição push e preferências.

### Público anônimo
- leitura de plantões publicados, promoções publicadas e banners ativos.

Políticas RLS definidas em SQL com funções auxiliares:
- `current_user_role()`
- `is_superadmin()`
- `belongs_to_pharmacy(pharmacy_id)`

## 5) Rotas e Telas

### Área pública
- `/` Home
- `/plantao`
- `/plantao/historico`
- `/promocoes`
- `/farmacias/[slug]`
- `/preferencias`
- `/institucional`

### Área administrativa
- `/admin`
- `/admin/farmacias`
- `/admin/plantoes`
- `/admin/promocoes`
- `/admin/banners`
- `/admin/notificacoes`
- `/admin/configuracoes`

### Auth
- `/login` (magic link Supabase)

## 6) Fluxos de Negócio

### 6.1 Cadastro de plantões
1. Superadmin cria manualmente ou gera automático.
2. Validação de datas e ausência de sobreposição.
3. Salva em `duty_schedules`.
4. Se publicado, agenda notificações relacionadas.

### 6.2 Cadastro de promoções
1. Superadmin seleciona farmácia e semana.
2. Cadastra até 10 produtos.
3. Publica semana promocional.
4. Front público consome apenas semanas/produtos publicados e ativos.

### 6.3 Favoritos e notificações
1. Usuário ativa push e salva favoritas.
2. Define preferências (geral, favorita, antecipada).
3. Scheduler cria eventos em `notifications`.
4. Dispatcher envia e registra em `notification_deliveries`.
5. `event_key` + restrições de entrega evitam duplicidade.

## 7) Estratégia de Push Notifications
- Service Worker em `public/sw.js`.
- Inscrição salva em `push_subscriptions`.
- Preferências em `user_notification_preferences`.
- Tipos suportados:
  - `weekly_general`
  - `favorite_start`
  - `favorite_reminder` (ex.: 1 dia antes)
- Endpoint de despacho protegido por `CRON_SECRET`.
- Ideal de produção: usar `web-push` com VAPID + retries + DLQ.

## 8) Estratégia Mobile-First
- Layout em coluna única no mobile.
- Cards com alto espaçamento e CTA touch-friendly (`h-11`).
- Bloco de plantão sempre como herói da tela.
- Promoções em segundo nível.
- Banners discretos com baixa competição visual.
- Navegação curta e direta.

## 9) Componentes UI Sugeridos
- Públicos:
  - `DutyHighlight`
  - `PromotionGrid`
  - `FavoriteButton`
  - `PushOptinCard`
  - `BannerSlot`
- Admin:
  - `KpiCard`
  - `SectionHeader`
  - `DutyGeneratorForm`
  - `PromotionWeekForm`

## 10) Roadmap MVP -> Completo

### MVP (2-4 semanas)
- Auth + perfis
- CRUD farmácias
- CRUD plantões manuais
- CRUD promoções com limite de 10
- Home pública com plantão + promoções
- Favoritos + preferências
- Base de push + histórico

### V1 (4-8 semanas)
- geração automática de rodízio
- calendário semanal/mensal
- duplicação de promoções da semana anterior
- painel de notificações com métricas
- banners/parceiros operacionais

### V2 SaaS/Municipal
- multi-tenant (município/cliente)
- temas/branding por tenant
- faturamento e planos
- analytics avançado de engajamento e conversão
- integrações externas (CRM, BI, WhatsApp API)

## 11) Segurança Operacional
- Não versionar segredo em git.
- Variáveis apenas em `.env.local` e secret manager.
- Rotacionar credenciais expostas imediatamente.
- Logs sem tokens.
- Endpoints internos protegidos por bearer secret + auditoria.
