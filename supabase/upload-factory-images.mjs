#!/usr/bin/env node
/**
 * Faz upload de todas as fotos da fábrica pro Supabase Storage
 * em uma pasta `factory/` no bucket `product-images`.
 *
 * Uso: node supabase/upload-factory-images.mjs
 */
import { readFile, readdir } from "node:fs/promises";
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
const IMAGES_DIR = path.resolve(__dirname, "../../Imagens");

const files = (await readdir(IMAGES_DIR)).filter((f) =>
  /\.(jpe?g|png|webp|avif)$/i.test(f),
);

console.log(`📸 Enviando ${files.length} imagens da pasta Imagens/...`);

const urls = [];
let i = 0;
for (const file of files) {
  i++;
  const buffer = await readFile(path.join(IMAGES_DIR, file));
  // Renomear para algo limpo: factory-001.jpg, factory-002.jpg
  const ext = file.split(".").pop().toLowerCase();
  const newName = `factory-${String(i).padStart(3, "0")}.${ext}`;
  const storagePath = `factory/${newName}`;

  const res = await fetch(
    `${SB}/storage/v1/object/product-images/${storagePath}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        apikey: KEY,
        "Content-Type": ext === "png" ? "image/png" : "image/jpeg",
        "x-upsert": "true",
      },
      body: buffer,
    },
  );

  if (res.ok) {
    const url = `${SB}/storage/v1/object/public/product-images/${storagePath}`;
    urls.push({ original: file, storage: storagePath, url });
    process.stdout.write(`\r  ${i}/${files.length} ${newName}     `);
  } else {
    console.error(`\n  ✗ ${file}: ${(await res.text()).slice(0, 100)}`);
  }
}

console.log(`\n\n✓ ${urls.length} imagens enviadas.`);

// Salva mapa pra usar depois
const mapPath = path.join(__dirname, "factory-images.json");
const { writeFile } = await import("node:fs/promises");
await writeFile(mapPath, JSON.stringify(urls, null, 2));
console.log(`Mapa salvo em ${mapPath}`);
