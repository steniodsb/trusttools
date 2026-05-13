#!/usr/bin/env node
/**
 * Importa os 341 produtos do products-from-xlsx.json pro Supabase.
 * 1. Apaga todos os produtos existentes (placeholders do scrape)
 * 2. Insere produtos reais com specs preenchidas
 *
 * Uso: node supabase/seed-from-xlsx.mjs
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envText = await readFile(path.join(__dirname, "..", ".env.local"), "utf8");
const env = Object.fromEntries(
  envText.split("\n").filter((l) => l && !l.startsWith("#")).map((l) => {
    const i = l.indexOf("=");
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }),
);

const SB = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

console.log("=".repeat(60));
console.log("  Trust Tools — Import de produtos do XLSX");
console.log("=".repeat(60));

// 1. Wipe products + product_images
console.log("\n🧹 Apagando produtos antigos...");
const delImg = await fetch(`${SB}/rest/v1/product_images?id=neq.00000000-0000-0000-0000-000000000000`, { method: "DELETE", headers: H });
console.log(`  ✓ product_images: ${delImg.status}`);
const delProd = await fetch(`${SB}/rest/v1/products?id=neq.00000000-0000-0000-0000-000000000000`, { method: "DELETE", headers: H });
console.log(`  ✓ products: ${delProd.status}`);

// 2. Buscar categorias existentes (mapa slug → id)
console.log("\n📂 Carregando categorias...");
const cats = await fetch(`${SB}/rest/v1/categories?select=id,slug`, { headers: H }).then((r) => r.json());
const catMap = new Map(cats.map((c) => [c.slug, c.id]));
console.log(`  ✓ ${catMap.size} categorias encontradas`);
for (const [slug, id] of catMap) console.log(`    - ${slug}: ${id.slice(0, 8)}...`);

// 3. Ler JSON
const json = JSON.parse(await readFile(path.join(__dirname, "products-from-xlsx.json"), "utf8"));
console.log(`\n📦 Importando ${json.products.length} produtos...`);

// 4. Inserir em lotes de 50
const BATCH = 50;
const rows = json.products.map((p) => {
  const catId = catMap.get(p.category_slug);
  if (!catId) return null;

  // Mover price oculto para specs como referência (não exibido na UI por padrão)
  const specs = { ...(p.specs || {}) };
  if (p._price_brl_current) {
    specs["Preço (tabela)"] = `R$ ${p._price_brl_current.toFixed(2).replace(".", ",")}`;
  }

  return {
    slug: p.slug,
    name: p.name,
    category_id: catId,
    short_description: p.short_description || null,
    long_description: null,
    applications: p.applications || [],
    specs,
    brand: p.brand || "Trust",
    tags: p.tags || [],
    featured: false,
    active: true,
    display_order: p.display_order || 0,
  };
}).filter(Boolean);

let inserted = 0, failed = 0;
for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const res = await fetch(`${SB}/rest/v1/products`, {
    method: "POST",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  });
  if (res.ok) {
    inserted += batch.length;
    process.stdout.write(`\r  ${inserted}/${rows.length} produtos...`);
  } else {
    failed += batch.length;
    console.error(`\n  ✗ Batch ${i}: ${(await res.text()).slice(0, 300)}`);
  }
}

console.log("\n\n" + "=".repeat(60));
console.log(`  ✓ ${inserted} produtos inseridos`);
if (failed) console.log(`  ✗ ${failed} falharam`);
console.log("=".repeat(60));
