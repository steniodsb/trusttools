/**
 * seed-catalog-images.mjs
 *
 * Popula o banco com os produtos extraídos do catálogo PDF de Ferramentas Importadas.
 * As imagens ficam em /public/catalog-images/ e são servidas como estáticas.
 *
 * Uso:
 *   node supabase/seed-catalog-images.mjs
 *
 * Requer .env com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");

// Lê .env manualmente
let envVars = {};
try {
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length) envVars[k.trim()] = rest.join("=").trim();
  }
} catch {
  // fallback to process.env
}

const SUPABASE_URL =
  envVars["NEXT_PUBLIC_SUPABASE_URL"] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  envVars["SUPABASE_SERVICE_ROLE_KEY"] || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌  Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── BASE URL para as imagens (servidas como estáticas do /public) ───────────
const IMG = (file) => `/catalog-images/${file}`;

// ─── MAPEAMENTO DE PRODUTOS ───────────────────────────────────────────────────
//
// Cada entrada: { slug, name, categorySlug, shortDesc, specs, origem, image, featured }
//

const PRODUCTS = [
  // ── FERRAMENTARIA GERAL (fabricadas) ─────────────────────────────────────
  {
    slug: "abracadeira-nylon-100mm",
    name: "Abraçadeira de Nylon 100mm x 2.5mm",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Abraçadeira preta de nylon, embalagem com 100 unidades. Ideal para organização de cabos.",
    specs: { Comprimento: "100mm", Espessura: "2.5mm", Quantidade: "100 un", Origem: "Produzido no Brasil" },
    image: IMG("img-016.jpg"),
    featured: true,
  },
  {
    slug: "abracadeira-nylon-200mm-36",
    name: "Abraçadeira de Nylon 200mm x 3.6mm",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Abraçadeira preta de nylon, embalagem com 100 unidades.",
    specs: { Comprimento: "200mm", Espessura: "3.6mm", Quantidade: "100 un", Origem: "Produzido no Brasil" },
    image: IMG("img-017.jpg"),
  },
  {
    slug: "abracadeira-nylon-200mm-48",
    name: "Abraçadeira de Nylon 200mm x 4.8mm",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Abraçadeira preta de nylon reforçada, embalagem com 100 unidades.",
    specs: { Comprimento: "200mm", Espessura: "4.8mm", Quantidade: "100 un", Origem: "Produzido no Brasil" },
    image: IMG("img-018.jpg"),
  },
  {
    slug: "abracadeira-nylon-300mm-36",
    name: "Abraçadeira de Nylon 300mm x 3.6mm",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Abraçadeira preta de nylon tamanho grande, embalagem com 100 unidades.",
    specs: { Comprimento: "300mm", Espessura: "3.6mm", Quantidade: "100 un", Origem: "Produzido no Brasil" },
    image: IMG("img-019.jpg"),
  },
  {
    slug: "abracadeira-nylon-300mm-48",
    name: "Abraçadeira de Nylon 300mm x 4.8mm",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Abraçadeira preta de nylon tamanho grande e reforçada, embalagem com 100 unidades.",
    specs: { Comprimento: "300mm", Espessura: "4.8mm", Quantidade: "100 un", Origem: "Produzido no Brasil" },
    image: IMG("img-020.jpg"),
  },
  {
    slug: "alicate-bico-fino",
    name: "Alicate Bico Fino Trust Tools",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Alicate bico fino com cabo emborrachado bicolor. Ideal para trabalhos de precisão e eletricidade.",
    specs: { Tipo: "Bico Fino", Origem: "Produzido no Brasil" },
    image: IMG("img-026.jpg"),
    featured: true,
  },
  {
    slug: "alicate-diagonal",
    name: "Alicate Diagonal Trust Tools",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Alicate de corte diagonal com cabo emborrachado. Para corte de fios e cabos.",
    specs: { Tipo: "Diagonal", Origem: "Produzido no Brasil" },
    image: IMG("img-027.jpg"),
  },
  {
    slug: "alicate-universal-combinado",
    name: "Alicate Universal Combinado Trust Tools",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Alicate universal combinado com cabo emborrachado bicolor. Multiuso para obras e manutenção.",
    specs: { Tipo: "Universal Combinado", Origem: "Produzido no Brasil" },
    image: IMG("img-028.jpg"),
  },
  {
    slug: "jogo-chaves-allen-9pc",
    name: "Jogo de Chaves Allen 9 Peças Trust Tools",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Jogo de chaves hexagonais (allen) com 9 peças em suporte plástico. Aço cromo-vanádio.",
    specs: { Quantidade: "9 peças", Origem: "Produzido no Brasil" },
    image: IMG("img-034.jpg"),
  },
  {
    slug: "bits-parafusadeira-110mm-ph2",
    name: "Bits para Parafusadeira 110mm PH2",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Kit com 10 bits magnéticos PH2 de 110mm para parafusadeira. Aço S2.",
    specs: { Comprimento: "110mm", Tipo: "PH2", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-041.jpg"),
    featured: true,
  },
  {
    slug: "estilete-18mm",
    name: "Estilete 18mm com Lâminas Reserva",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Estilete profissional 18mm com trava e lâminas de reposição incluídas.",
    specs: { Largura: "18mm", Origem: "Produzido no Brasil" },
    image: IMG("img-050.jpg"),
  },
  {
    slug: "fita-isolante-10m",
    name: "Fita Isolante 10m x 18mm Antichama",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Fita isolante preta 10m x 18mm x 0.13mm. Proteção contra raios UV, máx. 600V/90°C. Antichama.",
    specs: { Comprimento: "10m", Largura: "18mm", Espessura: "0.13mm", Origem: "Produzido no Brasil" },
    image: IMG("img-056.jpg"),
  },
  {
    slug: "jogo-soquetes-46pc",
    name: "Jogo de Soquetes 46 Peças com Catraca",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Jogo completo com 46 peças: soquetes, extensões, catraca e bits. Maleta vermelha.",
    specs: { Quantidade: "46 peças", Origem: "Importado" },
    image: IMG("img-062.jpg"),
  },
  {
    slug: "martelo-unha-25mm",
    name: "Martelo de Unha 25mm Trust Tools",
    categorySlug: "ferramentaria-geral",
    shortDesc: "Martelo de unha com cabo de madeira e cabeça de aço 25mm. Para pregar e arrancar pregos.",
    specs: { Tipo: "Martelo de Unha", Tamanho: "25mm", Origem: "Produzido no Brasil" },
    image: IMG("img-068.jpg"),
  },

  // ── CONSTRUÇÃO CIVIL (fabricadas) ─────────────────────────────────────────
  {
    slug: "broca-aco-rapido-2mm",
    name: "Broca de Aço Rápido 2.0mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 2.0mm, embalagem com 10 unidades. Para metal, plástico e madeira.",
    specs: { Diâmetro: "2.0mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-111.jpg"),
    featured: true,
  },
  {
    slug: "broca-aco-rapido-28mm",
    name: "Broca de Aço Rápido 2.8mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 2.8mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "2.8mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-112.jpg"),
  },
  {
    slug: "broca-aco-rapido-3mm",
    name: "Broca de Aço Rápido 3.0mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 3.0mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "3.0mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-113.jpg"),
  },
  {
    slug: "broca-aco-rapido-4mm",
    name: "Broca de Aço Rápido 4.0mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 4.0mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "4.0mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-115.jpg"),
  },
  {
    slug: "broca-aco-rapido-45mm",
    name: "Broca de Aço Rápido 4.5mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 4.5mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "4.5mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-116.jpg"),
  },
  {
    slug: "broca-aco-rapido-55mm",
    name: "Broca de Aço Rápido 5.5mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 5.5mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "5.5mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-118.jpg"),
  },
  {
    slug: "broca-aco-rapido-65mm",
    name: "Broca de Aço Rápido 6.5mm — Kit 10 un",
    categorySlug: "construcao-civil",
    shortDesc: "Brocas de aço rápido HSS 6.5mm, embalagem com 10 unidades.",
    specs: { Diâmetro: "6.5mm", Quantidade: "10 un", Origem: "Produzido no Brasil" },
    image: IMG("img-126.jpg"),
  },
  {
    slug: "kit-brocas-metal-muro-madeira",
    name: "Kit de Brocas Metal, Muro e Madeira — 9pc",
    categorySlug: "construcao-civil",
    shortDesc: "Kit com 9 brocas em suporte (3 pares de 5, 6 e 8mm) para metal, muro e madeira.",
    specs: { Quantidade: "9 peças", Inclui: "Metal, Muro, Madeira", Origem: "Produzido no Brasil" },
    image: IMG("img-163.jpg"),
    featured: true,
  },
  {
    slug: "serra-circular-24t",
    name: "Serra Circular 24 Dentes Trust Tools",
    categorySlug: "construcao-civil",
    shortDesc: "Lâmina de serra circular 24 dentes com pastilha de metal duro. Para madeira e derivados.",
    specs: { Dentes: "24", Tipo: "Serra Circular", Origem: "Produzido no Brasil" },
    image: IMG("img-175.jpg"),
  },
  {
    slug: "disco-corte-aco-inox-115mm",
    name: "Disco de Corte Aço/Inox 115mm x 1.0mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco de corte profissional para aço e inox. 115x1.0x22.2mm. WA60 TBF41. Máx. 13.300 RPM.",
    specs: { Diâmetro: "115mm", Espessura: "1.0mm", Furo: "22.2mm", Origem: "Produzido no Brasil" },
    image: IMG("img-131.jpg"),
    featured: true,
  },
  {
    slug: "disco-corte-inox-180mm",
    name: "Disco de Corte Inox 180mm Trust Diamond",
    categorySlug: "construcao-civil",
    shortDesc: "Disco de corte para inox 180x1.6x22mm. Máx. 8.500 RPM. Linha Trust Diamond.",
    specs: { Diâmetro: "180mm", Espessura: "1.6mm", Furo: "22mm", Origem: "Importado" },
    image: IMG("img-133.jpg"),
  },
  {
    slug: "disco-limpeza-remocao-115mm",
    name: "Disco de Limpeza e Remoção 115mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco abrasivo de fibra para remoção de tinta, ferrugem e resíduos em metal. 115mm.",
    specs: { Diâmetro: "115mm", Tipo: "Remoção/Strip", Origem: "Importado" },
    image: IMG("img-139.jpg"),
  },
  {
    slug: "disco-flap-115mm-g40",
    name: "Disco Flap 115mm G40 Reto Trust Diamond",
    categorySlug: "construcao-civil",
    shortDesc: "Disco flap reto 4.5\" G40. 115x22.2mm. Máx. 13.300 RPM. Para desbaste de metal e inox.",
    specs: { Diâmetro: "115mm", Furo: "22.2mm", Granulação: "G40", Tipo: "Flap Reto", Origem: "Importado" },
    image: IMG("img-147.jpg"),
  },
  {
    slug: "disco-diamantado-segmentado-350mm",
    name: "Disco Diamantado Segmentado 350mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco diamantado segmentado para concreto e asfalto. 350x10x25.4mm. Alta durabilidade.",
    specs: { Diâmetro: "350mm", Tipo: "Segmentado", Aplicação: "Concreto e Asfalto", Origem: "Importado" },
    image: IMG("img-104.jpg"),
    featured: true,
  },
  {
    slug: "coroa-diamantada-42mm",
    name: "Coroa Diamantada 42mm Trust Tools",
    categorySlug: "construcao-civil",
    shortDesc: "Coroa diamantada 42mm para furação de concreto, cerâmica e alvenaria. Encaixe rosca.",
    specs: { Diâmetro: "42mm", Tipo: "Coroa Diamantada", Origem: "Importado" },
    image: IMG("img-203.jpg"),
  },
  {
    slug: "disco-diamantado-turbo-115mm",
    name: "Disco Diamantado Turbo 115mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco diamantado turbo para corte rápido de concreto, tijolo e cerâmica. 115mm.",
    specs: { Diâmetro: "115mm", Tipo: "Turbo Segmentado", Origem: "Importado" },
    image: IMG("img-229.jpg"),
  },
  {
    slug: "disco-diamantado-segmentado-200mm",
    name: "Disco Diamantado Segmentado 200mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco diamantado de grande porte para corte de concreto e alvenaria. 200mm.",
    specs: { Diâmetro: "200mm", Tipo: "Segmentado", Origem: "Importado" },
    image: IMG("img-238.jpg"),
  },
  {
    slug: "disco-turbo-fino-110mm",
    name: "Disco Turbo Fino 110mm",
    categorySlug: "construcao-civil",
    shortDesc: "Disco diamantado turbo fino 110x20mm para corte preciso de cerâmica e porcelana.",
    specs: { Diâmetro: "110mm", Furo: "20mm", Tipo: "Turbo Fino", Origem: "Importado" },
    image: IMG("img-315.jpg"),
  },

  // ── PEDRAS & MÁRMORE (importadas) ─────────────────────────────────────────
  {
    slug: "disco-copa-single-row",
    name: "Disco de Copa Diamantado Single Row",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco de copa diamantado single row para desbaste de granito, mármore e pedras.",
    specs: { Tipo: "Copa Single Row", Rosca: "M14", Origem: "Importado" },
    image: IMG("img-086.jpg"),
    featured: true,
  },
  {
    slug: "disco-copa-double-row",
    name: "Disco de Copa Diamantado Double Row",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco de copa diamantado double row para desbaste agressivo de granito e mármore.",
    specs: { Tipo: "Copa Double Row", Rosca: "M14", Origem: "Importado" },
    image: IMG("img-087.jpg"),
  },
  {
    slug: "disco-copa-continuo",
    name: "Disco de Copa Diamantado Contínuo",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco de copa contínuo para acabamento em granito, mármore e pedras naturais.",
    specs: { Tipo: "Copa Contínuo", Rosca: "M14", Origem: "Importado" },
    image: IMG("img-088.jpg"),
  },
  {
    slug: "calice-diamantado-m14",
    name: "Cálice Diamantado M14",
    categorySlug: "pedras-marmore",
    shortDesc: "Cálice diamantado com rosca M14 para bordas e perfis em granito e mármore.",
    specs: { Rosca: "M14", Tipo: "Cálice", Origem: "Importado" },
    image: IMG("img-184.jpg"),
    featured: true,
  },
  {
    slug: "disco-diamantado-porcelana",
    name: "Disco Diamantado para Porcelana e Cerâmica",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco diamantado contínuo específico para corte de porcelana, cerâmica e granilite.",
    specs: { Tipo: "Contínuo", Aplicação: "Porcelana e Cerâmica", Origem: "Importado" },
    image: IMG("img-215.jpg"),
  },
  {
    slug: "silent-granite-blade-350mm",
    name: "Silent Granite Blade 350mm",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco diamantado Silent para corte de granito. 350x15x50mm. Corte silencioso e preciso.",
    specs: { Diâmetro: "350mm", Espessura: "15mm", Furo: "50mm", Tipo: "Silent Blade", Origem: "Importado" },
    image: IMG("img-265.jpg"),
  },
  {
    slug: "rebolo-copo-conico-100mm",
    name: "Rebolo Tipo Copo Cônico 100mm Trust Diamond",
    categorySlug: "pedras-marmore",
    shortDesc: "Rebolo copo cônico 100x50mm, rosca M14. 9.000 RPM. Para granito, cerâmica e porcelana.",
    specs: { Diâmetro: "100mm", Altura: "50mm", Rosca: "M14", "Máx. RPM": "9.000", Origem: "Importado" },
    image: IMG("img-257.jpg"),
  },
  {
    slug: "pad-polimento-pro-1",
    name: "Pad de Polimento PRO Nº1 — Amarelo",
    categorySlug: "pedras-marmore",
    shortDesc: "Pad de polimento diamantado Trust Tools PRO, grão 1 (amarelo). Para granito e mármore.",
    specs: { Granulação: "1", Cor: "Amarelo", Tipo: "Polimento Diamantado", Origem: "Importado" },
    image: IMG("img-297.jpg"),
  },
  {
    slug: "pad-polimento-pro-2",
    name: "Pad de Polimento PRO Nº2 — Vermelho",
    categorySlug: "pedras-marmore",
    shortDesc: "Pad de polimento diamantado Trust Tools PRO, grão 2 (vermelho). Para granito e mármore.",
    specs: { Granulação: "2", Cor: "Vermelho", Tipo: "Polimento Diamantado", Origem: "Importado" },
    image: IMG("img-298.jpg"),
  },
  {
    slug: "kit-pads-polimento-7pc",
    name: "Kit Pads de Polimento 7 Peças 50–3000",
    categorySlug: "pedras-marmore",
    shortDesc: "Kit completo com 7 pads diamantados (50, 100, 200, 400, 800, 1500, 3000) + backing pad. Para polimento de pedras.",
    specs: {
      Quantidade: "7 peças + backing",
      Granulação: "50 a 3000",
      Tipo: "Kit Polimento",
      Origem: "Importado",
    },
    image: IMG("img-305.jpg"),
    featured: true,
  },
  {
    slug: "disco-diamantado-liso-verde",
    name: "Disco Diamantado Liso Verde Trust Tools",
    categorySlug: "pedras-marmore",
    shortDesc: "Disco diamantado liso contínuo verde para corte de porcelana, vidro e cerâmica.",
    specs: { Tipo: "Liso Contínuo", Cor: "Verde", Origem: "Importado" },
    image: IMG("img-322.jpg"),
  },
];

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔍 Buscando categorias...");
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id, slug");
  if (catErr) {
    console.error("❌ Erro ao buscar categorias:", catErr.message);
    process.exit(1);
  }

  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  console.log("✅ Categorias encontradas:", Object.keys(catMap).join(", "));

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const p of PRODUCTS) {
    const categoryId = catMap[p.categorySlug];
    if (!categoryId) {
      console.warn(`⚠️  Categoria não encontrada: ${p.categorySlug} (produto: ${p.slug})`);
      skipped++;
      continue;
    }

    // Verifica se produto já existe
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", p.slug)
      .single();

    if (existing) {
      console.log(`  ↩  Já existe: ${p.slug}`);
      skipped++;
      continue;
    }

    // Insere produto
    const { data: prod, error: prodErr } = await supabase
      .from("products")
      .insert({
        slug: p.slug,
        name: p.name,
        category_id: categoryId,
        short_description: p.shortDesc,
        specs: p.specs || {},
        brand: "Trust Tools",
        active: true,
        featured: p.featured || false,
        display_order: inserted + 1,
        tags: [],
        applications: [],
      })
      .select("id")
      .single();

    if (prodErr) {
      console.error(`❌  Erro ao inserir ${p.slug}:`, prodErr.message);
      errors++;
      continue;
    }

    // Insere imagem
    const { error: imgErr } = await supabase.from("product_images").insert({
      product_id: prod.id,
      url: p.image,
      alt: p.name,
      is_primary: true,
      display_order: 1,
    });

    if (imgErr) {
      console.warn(`⚠️  Imagem falhou para ${p.slug}:`, imgErr.message);
    }

    console.log(`  ✅  ${p.name}`);
    inserted++;
  }

  console.log(`
╔══════════════════════════════╗
║  SEED CONCLUÍDO              ║
╠══════════════════════════════╣
║  Inseridos : ${String(inserted).padEnd(16)}║
║  Já existiam: ${String(skipped).padEnd(15)}║
║  Erros     : ${String(errors).padEnd(16)}║
╚══════════════════════════════╝
`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
