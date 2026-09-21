# Rotas desativadas (set/2026)

Pasta privada do App Router (prefixo `_`): nada aqui vira rota.

O cliente pediu para desativar o catálogo de produtos do banco (Supabase).
Agora cada linha em `/linhas/[slug]` lista subcategorias que abrem um PDF
(ver `lib/linhas.ts` e `/public/catalogos`).

Guardado aqui para eventual reativação:

- `catalogo/`      → antiga `/catalogo` (grade com filtros, produtos do banco)
- `catalogos/`     → antiga `/catalogos` (download Fabricadas / Importadas)
- `produto-slug/`  → antiga `/produtos/[slug]` (página individual do produto)

Os redirects dessas URLs estão em `next.config.ts`. O painel `/admin` e as
tabelas no Supabase continuam intactos.
