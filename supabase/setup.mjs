#!/usr/bin/env node
/**
 * Setup completo do Supabase:
 *  1. Aplica o schema.sql via conexão Postgres direta
 *  2. Cria bucket de Storage `product-images` (público)
 *  3. Cria usuário admin (email/senha)
 *  4. Faz seed das 6 categorias iniciais
 *
 * Uso:
 *   DB_PASSWORD=xxxx ADMIN_EMAIL=xx ADMIN_PASSWORD=xx node supabase/setup.mjs
 *
 * Onde:
 *   DB_PASSWORD     = senha do banco (Dashboard → Settings → Database)
 *   ADMIN_EMAIL     = email do admin que vai logar no painel
 *   ADMIN_PASSWORD  = senha do admin (mín. 6 caracteres)
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lê .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const envText = await readFile(envPath, "utf8");
const env = Object.fromEntries(
  envText
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "comercial@trusttools.com.br";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("✗ Faltam variáveis em .env.local");
  process.exit(1);
}

// ───────────────────────────────────────────────────────
// 1. APLICA O SCHEMA SQL
// ───────────────────────────────────────────────────────
async function applySchema() {
  if (!DB_PASSWORD) {
    console.log("⚠ DB_PASSWORD não fornecida — pulando schema. Aplique manualmente em SQL Editor.");
    return;
  }
  console.log("\n📋 Aplicando schema...");
  const sql = await readFile(path.join(__dirname, "schema.sql"), "utf8");

  // Pega ref do projeto a partir da URL
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  const connStr = `postgresql://postgres.${ref}:${encodeURIComponent(DB_PASSWORD)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  const client = new pg.Client({ connectionString: connStr });
  try {
    await client.connect();
    await client.query(sql);
    console.log("  ✓ Schema aplicado");
  } catch (err) {
    console.error("  ✗ Erro:", err.message);
    if (err.message.includes("ENOTFOUND") || err.message.includes("authentication failed")) {
      // Tenta outras regiões
      console.log("  Tentando outras regiões do pooler...");
      const regions = ["us-east-1", "us-west-1", "sa-east-1", "eu-west-1", "ap-southeast-1"];
      for (const region of regions) {
        const altStr = `postgresql://postgres.${ref}:${encodeURIComponent(DB_PASSWORD)}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
        const altClient = new pg.Client({ connectionString: altStr });
        try {
          await altClient.connect();
          await altClient.query(sql);
          console.log(`  ✓ Schema aplicado via ${region}`);
          await altClient.end();
          return;
        } catch (e) {
          await altClient.end().catch(() => {});
        }
      }
      console.error("  ✗ Não foi possível conectar em nenhuma região. Aplique manualmente em SQL Editor.");
    }
  } finally {
    await client.end().catch(() => {});
  }
}

// ───────────────────────────────────────────────────────
// 2. CRIA BUCKET DE STORAGE
// ───────────────────────────────────────────────────────
async function createBucket() {
  console.log("\n🗄  Criando bucket 'product-images'...");
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
    },
    body: JSON.stringify({
      id: "product-images",
      name: "product-images",
      public: true,
      file_size_limit: 5 * 1024 * 1024, // 5 MB
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    }),
  });
  if (res.ok) console.log("  ✓ Bucket criado");
  else {
    const text = await res.text();
    if (text.includes("already exists")) console.log("  ✓ Bucket já existia");
    else console.error("  ✗ Erro:", text.slice(0, 200));
  }
}

// ───────────────────────────────────────────────────────
// 3. CRIA USUÁRIO ADMIN
// ───────────────────────────────────────────────────────
async function createAdminUser() {
  if (!ADMIN_PASSWORD) {
    console.log("\n⚠ ADMIN_PASSWORD não fornecida — pulando criação de usuário.");
    return;
  }
  console.log(`\n👤 Criando admin ${ADMIN_EMAIL}...`);
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
    }),
  });
  if (res.ok) {
    console.log("  ✓ Admin criado");
  } else {
    const text = await res.text();
    if (text.includes("already") || text.includes("registered")) {
      console.log("  ✓ Admin já existia");
    } else {
      console.error("  ✗ Erro:", text.slice(0, 200));
    }
  }
}

// ───────────────────────────────────────────────────────
// 4. SEED DE CATEGORIAS
// ───────────────────────────────────────────────────────
const SEEDS = [
  { slug: "construcao-civil",     name: "Construção Civil",     description: "Discos diamantados, brocas, serras, fixadores e ferramenta elétrica para construtoras que tocam obra pesada.", image_url: "/cat-construcao.jpg",  display_order: 1 },
  { slug: "refratarios",          name: "Refratários",          description: "Brocas, fresas e abrasivos especiais para indústrias siderúrgicas, cimenteiras e cerâmicas.",                  image_url: "/cat-refratarios.jpg", display_order: 2 },
  { slug: "pedras-marmore",       name: "Pedras & Mármore",     description: "Discos, fresas, frankfurts, polidores e abrasivos para marmorarias e beneficiamento.",                          image_url: "/cat-pedras.jpg",      display_order: 3 },
  { slug: "segmentos-diamantados",name: "Segmentos Diamantados",description: "Linha completa de segmentos para fios, serras e discos de grande porte.",                                       image_url: "/cat-segmentos.jpg",   display_order: 4 },
  { slug: "ferramentaria-geral",  name: "Ferramentaria Geral",  description: "EPIs, manuais, medição, fixação, abrasivos convencionais.",                                                    image_url: "/cat-diversos.jpg",    display_order: 5 },
  { slug: "recapagem",            name: "Recapagem & Serviços", description: "Recapagem de segmentos diamantados e reaproveitamento de ferramentas.",                                         image_url: "/cat-recapagem.jpg",   display_order: 6 },
];

async function seedCategories() {
  console.log("\n🌱 Inserindo categorias...");
  for (const cat of SEEDS) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/categories?on_conflict=slug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        Prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify(cat),
    });
    if (res.ok) {
      const body = await res.text();
      console.log(`  ✓ ${cat.name}${body === "[]" ? " (já existia)" : ""}`);
    } else {
      console.error(`  ✗ ${cat.name}: ${(await res.text()).slice(0, 150)}`);
    }
  }
}

// ───────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────
async function main() {
  console.log("=".repeat(60));
  console.log("  Trust Tools — Setup do Supabase");
  console.log(`  ${SUPABASE_URL}`);
  console.log("=".repeat(60));

  await applySchema();
  await createBucket();
  await createAdminUser();
  await seedCategories();

  console.log("\n" + "=".repeat(60));
  console.log("  ✓ Setup concluído!");
  console.log("=".repeat(60));
  console.log(`\n  Login admin: ${ADMIN_EMAIL}`);
  console.log(`  Acesse:      http://localhost:3000/admin/login\n`);
}

main().catch((err) => {
  console.error("\n✗ Erro fatal:", err);
  process.exit(1);
});
