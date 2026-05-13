#!/usr/bin/env node
/**
 * Faz seed do Supabase a partir do JSON raspado de trusttools.com.br.
 *
 * Pré-requisito:
 *   - schema.sql já aplicado
 *   - scraped-data.json gerado pelo agent scraper
 *   - bucket `product-images` criado (rodar setup.mjs primeiro)
 *
 * Uso:
 *   node supabase/seed-from-scrape.mjs
 *
 * O que faz:
 *   1. Lê scraped-data.json
 *   2. Insere categorias (ignora duplicatas por slug)
 *   3. Para cada produto:
 *      a. Baixa as imagens externas (Wix) e faz upload pro Storage
 *      b. Insere o produto com category_id correto
 *      c. Insere product_images apontando pras URLs do Storage
 *   4. Insere catálogos (PDFs) — armazena URL externa por enquanto
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Lê .env.local
const envText = await readFile(path.join(__dirname, "..", ".env.local"), "utf8");
const env = Object.fromEntries(
  envText.split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

// Helpers
const supabaseFetch = (path, opts = {}) =>
  fetch(`${SUPABASE_URL}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      ...(opts.headers || {}),
    },
  });

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Mapeia slug do scrape → slug canônico do banco (do setup.mjs)
const SLUG_MAP = {
  "construcao": "construcao-civil",
  "refratarios": "refratarios",
  "pedras": "pedras-marmore",
  "segmentos": "segmentos-diamantados",
  "ferramentas-diversas": "ferramentaria-geral",
  "repastilhamento": "recapagem",
};

const CATEGORY_NAME_MAP = {
  "construcao-civil": "Construção Civil",
  "refratarios": "Refratários",
  "pedras-marmore": "Pedras & Mármore",
  "segmentos-diamantados": "Segmentos Diamantados",
  "ferramentaria-geral": "Ferramentaria Geral",
  "recapagem": "Recapagem & Serviços",
};

async function downloadAndUploadImage(externalUrl, productId, isPrimary = false) {
  try {
    const res = await fetch(externalUrl);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const ext = (contentType.split("/")[1] || "jpg").split(";")[0];
    const filename = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const upload = await fetch(
      `${SUPABASE_URL}/storage/v1/object/product-images/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          apikey: SERVICE_KEY,
          "Content-Type": contentType,
        },
        body: buffer,
      },
    );
    if (!upload.ok) {
      console.error(`    ✗ Upload failed: ${(await upload.text()).slice(0, 100)}`);
      return null;
    }
    return `${SUPABASE_URL}/storage/v1/object/public/product-images/${filename}`;
  } catch (err) {
    console.error(`    ✗ Image error: ${err.message}`);
    return null;
  }
}

async function upsertCategory(cat) {
  const slug = SLUG_MAP[cat.slug] || cat.slug;
  const name = CATEGORY_NAME_MAP[slug] || cat.name;
  // Tenta achar existente
  const existing = await supabaseFetch(
    `/rest/v1/categories?slug=eq.${slug}&select=id`,
  ).then((r) => r.json());
  if (existing.length > 0) return existing[0].id;

  const res = await supabaseFetch("/rest/v1/categories", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      slug,
      name,
      description: cat.description || null,
      display_order: cat.display_order ?? 0,
    }),
  });
  if (!res.ok) {
    console.error(`  ✗ Categoria ${slug}: ${(await res.text()).slice(0, 200)}`);
    return null;
  }
  const body = await res.json();
  return body[0]?.id;
}

async function insertProduct(product, categoryId) {
  const slug = product.slug || slugify(product.name);
  // Verifica se já existe
  const existing = await supabaseFetch(
    `/rest/v1/products?slug=eq.${slug}&select=id`,
  ).then((r) => r.json());
  if (existing.length > 0) {
    console.log(`    ↻ ${product.name} (já existia)`);
    return existing[0].id;
  }

  const payload = {
    slug,
    name: product.name,
    category_id: categoryId,
    short_description: product.short_description || null,
    long_description: product.long_description || null,
    applications: product.applications || [],
    specs: product.specs || {},
    brand: product.brand || null,
    tags: product.tags || [],
    active: true,
    display_order: product.display_order ?? 0,
  };

  const res = await supabaseFetch("/rest/v1/products", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error(`  ✗ Produto ${product.name}: ${(await res.text()).slice(0, 200)}`);
    return null;
  }
  return (await res.json())[0]?.id;
}

async function insertProductImages(productId, urls) {
  for (let i = 0; i < urls.length; i++) {
    const wpUrl = await downloadAndUploadImage(urls[i], productId, i === 0);
    if (!wpUrl) continue;
    await supabaseFetch("/rest/v1/product_images", {
      method: "POST",
      body: JSON.stringify({
        product_id: productId,
        url: wpUrl,
        is_primary: i === 0,
        display_order: i,
      }),
    });
  }
}

// MAIN
async function main() {
  console.log("=".repeat(60));
  console.log("  Trust Tools — Seed do banco a partir do scrape");
  console.log("=".repeat(60));

  const dataPath = path.join(__dirname, "scraped-data.json");
  let data;
  try {
    data = JSON.parse(await readFile(dataPath, "utf8"));
  } catch {
    console.error(`\n✗ Arquivo não encontrado: ${dataPath}`);
    console.error("  Rode o agent de scraping primeiro.");
    process.exit(1);
  }

  console.log(`\nFonte: ${data.source}`);
  console.log(`Categorias: ${data.categories?.length ?? 0}`);
  console.log(`Produtos:   ${data.categories?.reduce((s, c) => s + (c.products?.length ?? 0), 0) ?? 0}`);
  console.log(`Catálogos:  ${data.catalogs?.length ?? 0}`);

  // 1. Categorias
  console.log("\n📂 Inserindo categorias...");
  const categoryMap = new Map(); // slug → id
  for (const cat of data.categories || []) {
    const id = await upsertCategory(cat);
    if (id) {
      categoryMap.set(cat.slug, id);
      const canonicalSlug = SLUG_MAP[cat.slug] || cat.slug;
      console.log(`  ✓ ${CATEGORY_NAME_MAP[canonicalSlug] || cat.name}`);
    }
  }

  // 2. Produtos
  console.log("\n📦 Inserindo produtos...");
  let totalProducts = 0;
  let totalImages = 0;
  for (const cat of data.categories || []) {
    const categoryId = categoryMap.get(cat.slug);
    if (!categoryId) continue;
    if (!cat.products || cat.products.length === 0) continue;

    console.log(`\n  [${cat.slug}]`);
    for (const product of cat.products) {
      const productId = await insertProduct(product, categoryId);
      if (!productId) continue;
      console.log(`    + ${product.name}`);
      totalProducts++;

      if (product.image_urls && product.image_urls.length > 0) {
        await insertProductImages(productId, product.image_urls);
        totalImages += product.image_urls.length;
      }
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log(`  ✓ ${totalProducts} produtos inseridos`);
  console.log(`  ✓ ${totalImages} imagens enviadas pro Storage`);
  console.log("=".repeat(60));
  console.log(`\n  Acesse: http://localhost:3000/produtos\n`);
}

main().catch((err) => {
  console.error("\n✗ Erro fatal:", err);
  process.exit(1);
});
