#!/usr/bin/env node
/**
 * Gera imagens profissionais de produtos com Nano Banana (Gemini 2.5 Flash Image)
 * e atribui aos 341 produtos por TIPO (não 1 imagem por SKU — 1 por tipo, ~21 tipos).
 *
 * Uso: node supabase/generate-product-images.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
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
const GEMINI = env.GEMINI_API_KEY;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" };

const STORAGE_BASE = `${SB}/storage/v1/object/public/product-images/generated`;
const localCache = path.join(__dirname, "generated-images");
await mkdir(localCache, { recursive: true });

// Tipos de produto + prompts otimizados para Nano Banana
// Cada tipo tem: name, slug, prompt, matchers (categoria + regex/keywords no name)
const TYPES = [
  // CONSTRUÇÃO / LAJES
  {
    slug: "disco-concreto-grande",
    prompt:
      "Professional product photography of a large diameter industrial diamond cutting disc (800mm), used for cutting hollow-core concrete slabs (lajes alveolares protendidas), heavy duty segmented edge, polished steel core with red branding, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog style, hyperrealistic, no text overlay",
    matchers: [{ category: "lajes-alveolares-protendidas" }, { category: "construcao-civil", name: /TR-7\d0|concreto|asfalto/i }],
  },
  {
    slug: "disco-concreto-medio",
    prompt:
      "Professional product photography of a medium 350mm diamond cutting disc for concrete, segmented diamond edge with cooling slots, steel core, isolated on pure white background, studio lighting, commercial e-commerce style, hyperrealistic industrial tool, no text",
    matchers: [{ category: "construcao-civil" }],
  },

  // PEDRAS / MÁRMORE
  {
    slug: "disco-granito-segmentado",
    prompt:
      "Professional product photography of a 350mm diamond cutting disc for granite, segmented edge with diamond pellets, polished silver steel core with brand decal, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic, no text",
    matchers: [{ category: "pedras-marmore", name: /TR-(540|570|580|001|002|003)|Segmentado|granito/i }],
  },
  {
    slug: "disco-marmore-continuo",
    prompt:
      "Professional product photography of a continuous-rim diamond disc 300mm for marble cutting, smooth uninterrupted diamond edge, mirror-polished steel core, isolated on pure white background, professional studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ category: "pedras-marmore", name: /BLACK|Liso|TR-60|continuo|marmore|TR-30/i }],
  },
  {
    slug: "disco-turbo",
    prompt:
      "Professional product photography of a turbo-rim diamond disc 230mm, characteristic wavy notched edge for fast cutting, steel core with branding, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic",
    matchers: [{ category: "pedras-marmore", name: /Turbo/i }],
  },
  {
    slug: "disco-porcelanato",
    prompt:
      "Professional product photography of a thin 115mm diamond disc for porcelain and ceramic tile cutting, very thin profile, smooth continuous edge, steel core, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ category: "pedras-marmore", name: /VIDRO|cristal|porcelan/i }],
  },
  {
    slug: "prato-lixadeira",
    prompt:
      "Professional product photography of an industrial diamond grinding cup wheel (prato para lixadeira) 100mm, with diamond segments arranged on the face, threaded backing, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /^Prato|Prato.*Lixadeira|Pratos para/i }],
  },
  {
    slug: "lixa-diamantada-jogo",
    prompt:
      "Professional product photography of a set of 7 hook-and-loop diamond polishing pads, flexible discs in graduated colors (each grit different color), arranged in a fan layout, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /Lixa.*Diamantada|^Lixa|JOGO.*LIXA/i }],
  },
  {
    slug: "suporte-flexivel",
    prompt:
      "Professional product photography of a flexible rubber backing pad with hook-and-loop attachment for polishing discs, 100mm, isolated on pure white background, studio lighting, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /Suporte/i }],
  },
  {
    slug: "broca-serra-copo",
    prompt:
      "Professional product photography of a diamond core drill bit / hole saw (broca serra copo) 50mm, cylindrical with diamond crown edge, threaded shank adapter, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog style, hyperrealistic, industrial tool",
    matchers: [{ name: /Serra.*Copo|Broca.*Copo|serra-copo/i }],
  },
  {
    slug: "broca-diamantada",
    prompt:
      "Professional product photography of a diamond drill bit 12mm for stone, with diamond plated tip and steel shaft, isolated on pure white background, studio lighting, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /Broca.*Diamantada|Brocas Diamantadas/i }],
  },

  // SEGMENTOS / CÁLICES / COROAS
  {
    slug: "segmento-diamantado",
    prompt:
      "Professional product photography of a single industrial diamond segment (rectangular sintered diamond cutting tip), showing the metallic bond matrix with embedded diamonds, isolated on pure white background, macro shot, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ category: "segmentos-diamantados", name: /Segmento/i }],
  },
  {
    slug: "calice-diamantado",
    prompt:
      "Professional product photography of a small diamond core bit (cálice) cylindrical with diamond crown edge at the top, polished steel body 1 to 2 inch diameter, threaded base, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic",
    matchers: [{ category: "segmentos-diamantados", name: /C[áa]lice|Calice/i }],
  },
  {
    slug: "coroa-diamantada",
    prompt:
      "Professional product photography of a diamond core drill crown bit (coroa diamantada), larger cylindrical bit with diamond segments around the rim, 50mm diameter, steel body, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ category: "segmentos-diamantados", name: /Coroa/i }],
  },

  // FERRAMENTARIA
  {
    slug: "broca-madeira",
    prompt:
      "Professional product photography of a flat spade wood drill bit (broca chata para madeira), with hex shank and sharp paddle tip, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog style, hyperrealistic, industrial tool",
    matchers: [{ name: /Madeira|Chata/i }],
  },
  {
    slug: "broca-ferro-aco",
    prompt:
      "Professional product photography of an HSS twist drill bit for steel and iron, polished cobalt finish, helical flutes, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /Ferro|A[çc]o|HSS/i }],
  },
  {
    slug: "broca-eletrica",
    prompt:
      "Professional product photography of an SDS-plus hammer drill bit for masonry and concrete, carbide tip, spiral flutes, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /El[ée]trica|SDS|martelete/i }],
  },
  {
    slug: "alicate",
    prompt:
      "Professional product photography of a heavy-duty professional pliers (alicate universal), red rubber grips, polished chrome jaws, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic industrial tool",
    matchers: [{ name: /^Alicate|Alicates/i }],
  },
  {
    slug: "chave",
    prompt:
      "Professional product photography of a set of combination wrenches (chaves combinadas), chrome vanadium steel, polished mirror finish, arranged in graduated sizes, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /^Chave|Chaves/i }],
  },
  {
    slug: "escova-aco",
    prompt:
      "Professional product photography of a steel wire wheel brush for angle grinder, cup-shaped brass-coated steel bristles, threaded base M14, isolated on pure white background, studio lighting, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /Escova/i }],
  },
  {
    slug: "disco-corte-fino",
    prompt:
      "Professional product photography of a thin metal cutting disc (disco de corte) 115mm for steel and stainless steel, fiber-reinforced abrasive, blue color, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /Disco.*Corte|Disco de Corte/i }],
  },
  {
    slug: "disco-desbaste",
    prompt:
      "Professional product photography of a grinding disc (disco de desbaste) 115mm, thicker abrasive wheel for metal grinding, red and black colors, isolated on pure white background, studio lighting, e-commerce catalog photography, hyperrealistic",
    matchers: [{ name: /Disco.*Desbaste/i }],
  },
  {
    slug: "maleta-ferramentas",
    prompt:
      "Professional product photography of a professional aluminum tool case (maleta de ferramentas) with combination lock, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /Maleta/i }],
  },
  {
    slug: "adesivo-pu",
    prompt:
      "Professional product photography of a tube of polyurethane adhesive (adesivo PU) for stone and marble bonding, branded packaging, beige color, isolated on pure white background, studio lighting, e-commerce catalog style, hyperrealistic",
    matchers: [{ name: /Adesivo|PU/i }],
  },

  // RECAPAGEM (mesma imagem visual que disco original, pois é o disco resegmentado)
  {
    slug: "disco-recapado",
    prompt:
      "Professional product photography of a refurbished diamond cutting disc, segmented edge with fresh new diamond segments brazed onto a reconditioned steel core, 350mm, polished, isolated on pure white background, studio lighting, e-commerce catalog photography, hyperrealistic",
    matchers: [{ category: "recapagem" }],
  },

  // FALLBACK / DEFAULT
  {
    slug: "ferramenta-generica",
    prompt:
      "Professional product photography of an industrial diamond tool, polished steel and chrome finish, isolated on pure white background, studio lighting, sharp focus, e-commerce catalog photography, hyperrealistic",
    matchers: [{ category: null }], // catch-all
  },
];

function matchType(product) {
  const catSlug = product.category?.slug;
  const name = product.name || "";
  for (const t of TYPES) {
    for (const m of t.matchers) {
      const catOk = !m.category || m.category === catSlug || m.category === null;
      const nameOk = !m.name || m.name.test(name);
      if (catOk && nameOk) return t;
    }
  }
  return TYPES[TYPES.length - 1]; // fallback
}

// 1. Buscar produtos
console.log("📦 Carregando produtos...");
const products = await fetch(
  `${SB}/rest/v1/products?select=id,name,slug,category:categories(slug)`,
  { headers: H },
).then((r) => r.json());
console.log(`  ✓ ${products.length} produtos`);

// 2. Agrupar por tipo
const groups = new Map();
for (const p of products) {
  const type = matchType(p);
  if (!groups.has(type.slug)) {
    groups.set(type.slug, { type, products: [] });
  }
  groups.get(type.slug).products.push(p);
}

console.log(`\n🎨 Tipos em uso: ${groups.size}`);
for (const [slug, g] of groups) {
  console.log(`  ${slug.padEnd(28)} → ${g.products.length} produtos`);
}

// 3. Gerar imagens (1 por tipo) - cache local pra não regerar
console.log("\n🤖 Gerando imagens com Nano Banana...");
const generatedUrls = new Map();

for (const [slug, g] of groups) {
  const localFile = path.join(localCache, `${slug}.png`);
  const storagePath = `generated/${slug}.png`;
  const publicUrl = `${STORAGE_BASE}/${slug}.png`;

  // Verificar cache local
  let buffer;
  try {
    buffer = await readFile(localFile);
    console.log(`  ↻ ${slug} (cache local)`);
  } catch {
    process.stdout.write(`  + ${slug}... `);
    const t0 = Date.now();
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: g.type.prompt }] }],
        }),
      },
    );
    const data = await r.json();
    const imgPart = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!imgPart) {
      console.log(`✗ falha: ${JSON.stringify(data).slice(0, 200)}`);
      continue;
    }
    buffer = Buffer.from(imgPart.inlineData.data, "base64");
    await writeFile(localFile, buffer);
    console.log(`OK (${((Date.now() - t0) / 1000).toFixed(1)}s, ${(buffer.length / 1024).toFixed(0)}KB)`);
  }

  // Upload pro Storage (sempre, pra garantir)
  const up = await fetch(
    `${SB}/storage/v1/object/product-images/${storagePath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        apikey: KEY,
        "Content-Type": "image/png",
        "x-upsert": "true",
      },
      body: buffer,
    },
  );
  if (up.ok) {
    generatedUrls.set(slug, publicUrl);
  } else {
    const err = await up.text();
    console.log(`    ✗ Upload ${slug}: ${err.slice(0, 100)}`);
  }
}

console.log(`\n✓ ${generatedUrls.size} imagens no Storage`);

// 4. Apagar product_images antigas e inserir novas
console.log("\n🧹 Apagando associações antigas...");
const del = await fetch(
  `${SB}/rest/v1/product_images?id=neq.00000000-0000-0000-0000-000000000000`,
  { method: "DELETE", headers: H },
);
console.log(`  Status: ${del.status}`);

console.log("\n💾 Inserindo novas associações...");
const newImages = [];
for (const p of products) {
  const type = matchType(p);
  const url = generatedUrls.get(type.slug);
  if (!url) continue;
  newImages.push({
    product_id: p.id,
    url,
    alt: `${p.name} - Trust Tools`,
    is_primary: true,
    display_order: 0,
  });
}

const BATCH = 100;
let ok = 0;
for (let i = 0; i < newImages.length; i += BATCH) {
  const batch = newImages.slice(i, i + BATCH);
  const res = await fetch(`${SB}/rest/v1/product_images`, {
    method: "POST",
    headers: { ...H, Prefer: "return=minimal" },
    body: JSON.stringify(batch),
  });
  if (res.ok) {
    ok += batch.length;
    process.stdout.write(`\r  ${ok}/${newImages.length}...`);
  } else {
    console.error(`\n  ✗ Batch: ${(await res.text()).slice(0, 200)}`);
  }
}

console.log(`\n\n✓ ${ok} produtos com imagem gerada por Nano Banana`);
