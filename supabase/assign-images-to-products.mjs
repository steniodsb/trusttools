#!/usr/bin/env node
/**
 * Atribui fotos da fábrica aos 341 produtos, distribuídas por categoria.
 *
 * Estratégia:
 *   - Cada categoria tem um conjunto curado de fotos candidatas
 *   - Para cada produto, atribui 2 fotos (primary + secondary) rotacionadas
 *   - Mesmo produto sempre recebe as mesmas fotos (determinístico)
 *   - Variedade visual dentro da mesma categoria
 *
 * Uso: node supabase/assign-images-to-products.mjs
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

const STORAGE = `${SB}/storage/v1/object/public/product-images/factory`;
const photo = (n) => `${STORAGE}/factory-${String(n).padStart(3, "0")}.jpeg`;

// Fotos curadas por categoria (índices entre 1 e 60)
// Selecionei ranges variados pra cada categoria ter "cara própria"
const PHOTOS_BY_CATEGORY = {
  "lajes-alveolares-protendidas": [7, 10, 11, 16, 31, 41, 51],
  "construcao-civil":             [2, 8, 9, 11, 16, 21, 31, 41, 51],
  "pedras-marmore":               [1, 5, 6, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 12, 17, 22, 27, 32, 37, 42, 47, 52, 57],
  "segmentos-diamantados":        [3, 4, 6, 12, 13, 14, 21, 22, 26, 32, 36, 42, 46, 52, 56, 23, 33, 43, 53],
  "ferramentaria-geral":          [17, 18, 19, 23, 24, 28, 29, 33, 38, 39, 44, 48, 54, 59],
  "recapagem":                    [18, 27, 28, 29, 30, 38, 39, 48, 49, 58, 59, 8, 13, 23, 33, 43, 53],
  "refratarios":                  [1, 5, 15, 25, 35, 45, 55],
};

// 1. Buscar todos os produtos
console.log("📦 Carregando produtos...");
const products = await fetch(
  `${SB}/rest/v1/products?select=id,slug,category_id,category:categories(slug)&order=created_at`,
  { headers: H },
).then((r) => r.json());
console.log(`  ✓ ${products.length} produtos carregados`);

// 2. Agrupar por categoria
const byCategory = {};
for (const p of products) {
  const slug = p.category?.slug;
  if (!slug) continue;
  (byCategory[slug] ||= []).push(p);
}

// 3. Atribuir fotos
console.log("\n🎨 Atribuindo fotos...");
const imagesToInsert = [];
for (const [catSlug, prods] of Object.entries(byCategory)) {
  const pool = PHOTOS_BY_CATEGORY[catSlug] || [1, 2, 3];
  console.log(`  [${catSlug}] ${prods.length} produtos × pool de ${pool.length} fotos`);

  prods.forEach((p, i) => {
    // Primary: rotaciona pelo pool
    const primaryIdx = pool[i % pool.length];
    // Secondary: outra foto do pool, deslocada
    const secondaryIdx = pool[(i + Math.floor(pool.length / 2)) % pool.length];

    imagesToInsert.push({
      product_id: p.id,
      url: photo(primaryIdx),
      alt: `Trust Tools - ${catSlug}`,
      is_primary: true,
      display_order: 0,
    });

    // Só adiciona secundária se for diferente da primária
    if (secondaryIdx !== primaryIdx) {
      imagesToInsert.push({
        product_id: p.id,
        url: photo(secondaryIdx),
        alt: `Trust Tools - ${catSlug} (detalhe)`,
        is_primary: false,
        display_order: 1,
      });
    }
  });
}

console.log(`\n  Total: ${imagesToInsert.length} associações de imagem`);

// 4. Limpar product_images existente
console.log("\n🧹 Apagando product_images existentes...");
const del = await fetch(
  `${SB}/rest/v1/product_images?id=neq.00000000-0000-0000-0000-000000000000`,
  { method: "DELETE", headers: H },
);
console.log(`  Status: ${del.status}`);

// 5. Inserir em lotes
console.log("\n💾 Inserindo imagens...");
const BATCH = 100;
let ok = 0, fail = 0;
for (let i = 0; i < imagesToInsert.length; i += BATCH) {
  const batch = imagesToInsert.slice(i, i + BATCH);
  const res = await fetch(`${SB}/rest/v1/product_images`, {
    method: "POST",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  });
  if (res.ok) {
    ok += batch.length;
    process.stdout.write(`\r  ${ok}/${imagesToInsert.length}...`);
  } else {
    fail += batch.length;
    console.error(`\n  ✗ Batch ${i}: ${(await res.text()).slice(0, 200)}`);
  }
}

console.log(`\n\n✓ ${ok} imagens associadas`);
if (fail) console.log(`✗ ${fail} falharam`);
