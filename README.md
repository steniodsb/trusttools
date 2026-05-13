# Trust Tools — Next.js + Supabase

Site institucional + catálogo de produtos + painel admin para a Trust Tools.
Stack: **Next.js 16** (App Router) · **Supabase** (Postgres + Auth + Storage) · **Tailwind CSS v4**.

---

## 📁 Estrutura

```
app/
├── (site)/             # Site público (marketing)
│   ├── layout.tsx      # Header + footer + WhatsApp flutuante
│   ├── page.tsx        # Home
│   ├── sobre/
│   ├── produtos/       # Catálogo + filtros
│   │   └── [slug]/     # Página individual (SSG)
│   ├── catalogos/
│   └── contato/        # Form com Server Action
├── admin/
│   ├── login/          # Login Supabase Auth
│   └── (panel)/        # Rotas protegidas (sidebar)
│       ├── page.tsx    # Dashboard
│       ├── produtos/   # CRUD + galeria de imagens
│       ├── categorias/ # CRUD
│       └── leads/      # Mensagens do form de contato
├── layout.tsx          # Root layout + metadados SEO
├── sitemap.ts          # Sitemap dinâmico
└── robots.ts

lib/
├── supabase/           # Clients (browser, server, admin, proxy)
├── database.types.ts   # Tipos
└── utils.ts            # Helpers + siteConfig

supabase/
├── schema.sql          # Schema completo (tabelas, RLS, índices)
└── setup.mjs           # Script de setup automatizado

proxy.ts                # Auth middleware (Next 16 rebranded)
```

---

## 🚀 Setup local

### 1. Variáveis de ambiente

Copie `.env.example` → `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5511978311084
```

### 2. Aplicar schema no Supabase

**Opção A — Manual (mais simples):**

1. Abra o Supabase Dashboard → **SQL Editor**
2. Cole o conteúdo de `supabase/schema.sql`
3. Clique **Run**

**Opção B — Automatizado:**

Pegue a senha do banco em **Project Settings → Database → Connection String**, depois:

```bash
DB_PASSWORD="sua-senha-do-banco" \
ADMIN_EMAIL="comercial@trusttools.com.br" \
ADMIN_PASSWORD="senha-temporaria-do-admin" \
node supabase/setup.mjs
```

Esse script faz:
- Aplica o `schema.sql`
- Cria bucket `product-images` (público) para upload de fotos
- Cria usuário admin (email/senha) que pode logar em `/admin/login`
- Faz seed das 6 categorias padrão (Construção, Refratários, etc.)

### 3. Rodar dev server

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login

---

## 🔐 Criar/resetar usuário admin

Sem o script, dá pra criar via **Supabase Dashboard → Authentication → Users → Add user → "Create new user"**. Marque "Auto Confirm User".

Para resetar senha, use a opção **"Send password recovery"** no mesmo painel.

---

## 🚢 Deploy na Vercel

1. **Push o repo pro GitHub** (qualquer repo privado serve):
   ```bash
   git init
   git add .
   git commit -m "Initial Trust Tools site"
   git remote add origin git@github.com:seu-user/trust-tools.git
   git push -u origin main
   ```

2. **Vercel** → New Project → importe o repo → configure as env vars (mesmas do `.env.local`, mas troque `NEXT_PUBLIC_SITE_URL` pelo domínio final, ex.: `https://trusttools.com.br`).

3. **Build settings**: deixe os defaults da Vercel — ela detecta Next.js automaticamente.

4. **Domínio**: aponte o DNS de `trusttools.com.br` pra Vercel (registros A/CNAME que ela exibir).

---

## 🏠 Migração futura para VPS

O projeto já está empacotado pra rodar em qualquer Node 20+. Pra VPS:

```bash
npm run build
NODE_ENV=production npm start
```

Recomendado: Docker + nginx reverso. Crie `Dockerfile`:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎨 Design system

Todas as variáveis estão em `app/globals.css` dentro de `@theme` (Tailwind v4):

- Cores: `--color-brand-500` (azul), `--color-accent` (ciano), `--color-ink` (texto), etc.
- Gradientes prontos: `var(--grad-primary)`, `var(--grad-aurora)`
- Classes utilitárias custom: `.h-display`, `.h-section`, `.eyebrow`, `.grad-text`, `.btn`, `.btn-primary`, `.btn-whatsapp`, `.reveal`, `.stagger`, `.tt-card`, `.tt-container`

Para mudar a cor principal: edite `--color-brand-500` no `globals.css`. Tudo recalcula automaticamente.

---

## 📊 SEO

- Metadados base em `app/layout.tsx`
- Metadados por página via `export const metadata`
- Metadados dinâmicos por produto via `generateMetadata`
- `sitemap.xml` gerado em runtime a partir do banco
- `robots.txt` bloqueia `/admin`
- Schema.org JSON-LD nas páginas de produto

---

## 🧩 Adicionar uma página nova

Crie `app/(site)/minha-pagina/page.tsx`:

```tsx
import { SubHero } from "@/components/site/sub-hero";
import { Reveal } from "@/components/site/reveal";

export const metadata = { title: "Minha página" };

export default function Page() {
  return (
    <>
      <SubHero eyebrow="..." title="..." />
      <section className="tt-section">
        <div className="tt-container">
          <Reveal>...</Reveal>
        </div>
      </section>
    </>
  );
}
```

Pronto — header, footer, animações e SEO já vêm do layout.
