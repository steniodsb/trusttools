"""Parse Brazilian product pricing XLSX into structured JSON for Supabase import."""
import json
import re
import unicodedata
from pathlib import Path
import pandas as pd
import math

XLSX = r"C:\Users\steni\Downloads\TABELA PREÇO - NOV 25 (1).xlsx"
OUT = r"C:\Users\steni\Documents\PROJETOS WEB DESIGN COM VIBE\Trust Tools Site (1)\trust-tools-next\supabase\products-from-xlsx.json"

SHEET_TO_CATEGORY = {
    "Discos": "pedras-marmore",
    "Discos Marm": "pedras-marmore",
    "Discos Gran": "pedras-marmore",
    "Discos Sile": "pedras-marmore",
    "Repast Gran": "recapagem",
    "Prato Lix": "pedras-marmore",
    "Lixas Pol": "pedras-marmore",
    "Suporte": "pedras-marmore",
    "Brocas Granitos": "pedras-marmore",
    "Brocas Madeira": "ferramentaria-geral",
    "Brocas  Ferrro-aço": "ferramentaria-geral",
    "Brocas Ferrro-aço": "ferramentaria-geral",
    "Discos Construção": "construcao-civil",
    "Repatilhamento  Constr": "recapagem",
    "Repatilhamento Constr": "recapagem",
    "Protendido": "lajes-alveolares-protendidas",
    "Segmentos": "segmentos-diamantados",
    "Calices Interiço": "segmentos-diamantados",
    "Coroas Alec": "segmentos-diamantados",
    "Calices  Alec": "segmentos-diamantados",
    "Calices Alec": "segmentos-diamantados",
    "Repast Calice": "recapagem",
    "Brocas  Eletrica": "ferramentaria-geral",
    "Brocas Eletrica": "ferramentaria-geral",
    "Ferramentas geral": "ferramentaria-geral",
}

ORIGIN_MAP = {
    "I": "Importado",
    "P": "Produzido no Brasil",
    "N": "Nacional",
    "I/P": "Importado/Nacional",
    "P/I": "Importado/Nacional",
}


def norm_sheet(name):
    return re.sub(r"\s+", " ", name.strip())


def slugify(text):
    text = unicodedata.normalize("NFKD", str(text))
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


def is_nan(v):
    if v is None:
        return True
    if isinstance(v, float) and math.isnan(v):
        return True
    if isinstance(v, str) and not v.strip():
        return True
    return False


def clean(v):
    if is_nan(v):
        return None
    if isinstance(v, str):
        return re.sub(r"\s+", " ", v.strip())
    return v


def to_float(v):
    if is_nan(v):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    try:
        s = str(v).replace("R$", "").replace(".", "").replace(",", ".").strip()
        return float(s)
    except Exception:
        return None


def detect_product_type(sheet_name, section_title):
    """Derive product-type prefix from section title or sheet name."""
    s = (section_title or "").lower()
    sn = sheet_name.lower()
    if "serra copo" in s or "serras copo" in s:
        return "Serra Copo"
    if "disco" in s or "disco" in sn:
        return "Disco"
    if "broca" in s or "broca" in sn:
        return "Broca"
    if "segmento" in s or "segmento" in sn:
        return "Segmento"
    if "cálice" in s or "calice" in s or "calice" in sn:
        return "Cálice"
    if "coroa" in s or "coroa" in sn:
        return "Coroa"
    if "lixa" in s or "lixa" in sn:
        return "Lixa"
    if "prato" in s or "prato" in sn:
        return "Prato"
    if "suporte" in s or "suporte" in sn:
        return "Suporte"
    if "repast" in s or "repast" in sn or "repatilh" in s or "repatilh" in sn:
        return "Repastilhamento"
    if "ferramenta" in s or "ferramenta" in sn:
        return "Ferramenta"
    return ""


def find_header_row(df):
    for i in range(min(15, len(df))):
        row = df.iloc[i].tolist()
        row_str = [str(c).strip() if not is_nan(c) else "" for c in row]
        row_lc = [r.lower() for r in row_str]
        joined = " | ".join(row_lc)
        has_dia = "ø" in row_lc or "diametro" in row_lc or "diâmetro" in row_lc
        has_id = "código" in row_lc or "codigo" in row_lc or "tipo" in row_lc or "i/p" in row_lc
        if has_dia and has_id:
            return i, row_str
        if "tipo" in row_lc and ("ø" in row_lc):
            return i, row_str
    # fallback: search for any row containing "Tipo"
    for i in range(min(15, len(df))):
        row_str = [str(c).strip() if not is_nan(c) else "" for c in df.iloc[i].tolist()]
        if "Tipo" in row_str or "tipo" in [r.lower() for r in row_str]:
            return i, row_str
    return None, None


def find_section_titles(df, max_row=10):
    """Find section title rows like '9. Serras Copo'."""
    titles = []
    for i in range(min(max_row, len(df))):
        for c in df.iloc[i].tolist():
            if isinstance(c, str) and re.match(r"^\s*\d+\.\s+\S", c):
                titles.append((i, c.strip()))
                break
    return titles


def find_all_section_titles(df):
    titles = []
    for i in range(len(df)):
        for c in df.iloc[i].tolist():
            if isinstance(c, str) and re.match(r"^\s*\d+\.\s+\S", c.strip()):
                titles.append((i, c.strip()))
                break
    return titles


def build_tags(name, aplicacao, sheet):
    tags = set()
    s = f"{name} {aplicacao or ''} {sheet}".lower()
    if "disco" in s: tags.add("disco")
    if "granito" in s: tags.add("granito")
    if "marmore" in s or "mármore" in s: tags.add("marmore")
    if "silestone" in s: tags.add("silestone")
    if "broca" in s: tags.add("broca")
    if "lixa" in s: tags.add("lixa")
    if "segmento" in s: tags.add("segmento")
    if "calice" in s or "cálice" in s: tags.add("calice")
    if "coroa" in s: tags.add("coroa")
    if "polimento" in s or "polir" in s: tags.add("polimento")
    if "corte" in s: tags.add("corte")
    if "diamantad" in s: tags.add("diamantado")
    if "madeira" in s: tags.add("madeira")
    if "ferro" in s or "aço" in s or "aco" in s: tags.add("ferro-aco")
    if "concreto" in s: tags.add("concreto")
    if "protendid" in s: tags.add("protendido")
    if "media dureza" in s or "média dureza" in s: tags.add("media-dureza")
    if "alta dureza" in s: tags.add("alta-dureza")
    if "baixa dureza" in s: tags.add("baixa-dureza")
    return sorted(tags)


def parse_sheet(xlsx_path, sheet_name):
    df = pd.read_excel(xlsx_path, sheet_name=sheet_name, header=None, dtype=object)
    products = []
    if df.empty:
        return products

    header_idx, header_row = find_header_row(df)
    if header_idx is None:
        # No header detected: assume layout [Ø, I/P, Código, Tipo, Aplicação, R$, (blank), R$]
        # Find first data row: first row after section title with a value in col 0 that looks like a size
        # or a value in col 3 (Tipo)
        first_data = None
        for i in range(len(df)):
            row = df.iloc[i].tolist()
            if len(row) < 4:
                continue
            c0 = clean(row[0]) if len(row) > 0 else None
            c3 = clean(row[3]) if len(row) > 3 else None
            if c0 and re.search(r"\d", str(c0)) and "mm" in str(c0).lower():
                first_data = i
                break
            if c3 and isinstance(c3, str) and len(c3) > 1 and not c3.lower().startswith("tabela") and "preço" not in c3.lower() and "pag" not in c3.lower():
                # also require column 2 looks like "TRUST"
                c2 = clean(row[2]) if len(row) > 2 else None
                if c2 and "trust" in str(c2).lower():
                    first_data = i
                    break
        if first_data is None:
            return products
        header_idx = first_data - 1
        header_row = ["Ø", "I/P", "Código", "Tipo", "Aplicação", "R$", "", "R$"]

    # Find column indices
    col_map = {}
    for j, h in enumerate(header_row):
        hl = str(h).strip().lower()
        if hl in ("ø", "diametro", "diâmetro"):
            col_map.setdefault("dia", j)
        elif hl == "i/p":
            col_map.setdefault("ip", j)
        elif hl in ("código", "codigo"):
            col_map.setdefault("codigo", j)
        elif hl == "tipo":
            col_map.setdefault("tipo", j)
        elif hl in ("aplicação", "aplicacao"):
            col_map.setdefault("aplicacao", j)
        elif hl.startswith("r$") or hl.startswith("rs") or "preço" in hl or "preco" in hl:
            if "preco1" not in col_map:
                col_map["preco1"] = j
            elif "preco2" not in col_map:
                col_map["preco2"] = j

    if "tipo" not in col_map and "dia" not in col_map:
        return products

    # all section titles in sheet
    sections = find_all_section_titles(df)
    # initial section title (top of sheet)
    top_titles = [t for t in sections if t[0] < header_idx]
    current_section_title = top_titles[-1][1] if top_titles else sheet_name

    cat_default = SHEET_TO_CATEGORY.get(norm_sheet(sheet_name), None)
    if cat_default is None:
        # try various keys
        for k, v in SHEET_TO_CATEGORY.items():
            if norm_sheet(sheet_name).lower().startswith(k.lower()) or k.lower().startswith(norm_sheet(sheet_name).lower()):
                cat_default = v
                break

    last_dia = None
    display_order = 0
    current_category = cat_default
    subsection = None

    for i in range(header_idx + 1, len(df)):
        row = df.iloc[i].tolist()
        # check for section title
        title_in_row = None
        for c in row:
            if isinstance(c, str) and re.match(r"^\s*\d+\.\s+\S", c.strip()):
                title_in_row = c.strip()
                break
        if title_in_row:
            current_section_title = title_in_row
            tl = title_in_row.lower()
            if "repast" in tl or "repatilh" in tl:
                current_category = "recapagem"
                subsection = title_in_row
            else:
                current_category = cat_default
                subsection = title_in_row
            continue

        dia = clean(row[col_map["dia"]]) if "dia" in col_map and col_map["dia"] < len(row) else None
        ip = clean(row[col_map["ip"]]) if "ip" in col_map and col_map["ip"] < len(row) else None
        codigo = clean(row[col_map["codigo"]]) if "codigo" in col_map and col_map["codigo"] < len(row) else None
        tipo = clean(row[col_map["tipo"]]) if "tipo" in col_map and col_map["tipo"] < len(row) else None
        aplicacao = clean(row[col_map["aplicacao"]]) if "aplicacao" in col_map and col_map["aplicacao"] < len(row) else None
        preco1 = to_float(row[col_map["preco1"]]) if "preco1" in col_map and col_map["preco1"] < len(row) else None
        preco2 = to_float(row[col_map["preco2"]]) if "preco2" in col_map and col_map["preco2"] < len(row) else None

        # Forward-fill diameter
        if dia is None:
            dia = last_dia
        else:
            last_dia = dia

        # Skip blank rows (no tipo and no aplicacao and no price)
        if is_nan(tipo) and is_nan(aplicacao) and preco1 is None and preco2 is None:
            continue
        # Skip rows that look like header repeats
        if tipo and tipo.lower() in ("tipo", "código", "codigo"):
            continue

        # Build name
        product_type = detect_product_type(sheet_name, current_section_title)
        name_parts = []
        if product_type:
            name_parts.append(product_type)
        if tipo:
            name_parts.append(str(tipo))
        if dia:
            name_parts.append(str(dia))
        if not name_parts:
            continue
        name = " ".join(name_parts).strip()
        # clean double spaces
        name = re.sub(r"\s+", " ", name)

        specs = {"Marca": "TRUST"}
        if dia:
            specs["Diâmetro"] = str(dia)
        if tipo:
            specs["Código fabricante"] = str(tipo)
        if ip and ip in ORIGIN_MAP:
            specs["Origem"] = ORIGIN_MAP[ip]
        elif ip:
            specs["Origem"] = str(ip)

        short_desc = aplicacao or ""

        tags = build_tags(name, aplicacao, sheet_name)

        slug_base = slugify(name)
        sheet_suffix = slugify(sheet_name)[:8]

        product = {
            "category_slug": current_category,
            "name": name,
            "slug": slug_base,
            "_slug_suffix": sheet_suffix,
            "short_description": short_desc,
            "specs": specs,
            "tags": tags,
            "applications": [aplicacao] if aplicacao else [],
            "brand": "Trust",
            "active": True,
            "display_order": display_order,
            "_source_sheet": sheet_name,
            "_source_row": i,
            "_section_title": current_section_title,
            "_subsection": subsection,
            "_price_brl_current": preco1,
            "_price_brl_prev": preco2,
        }
        products.append(product)
        display_order += 1

    return products


def main():
    xl = pd.ExcelFile(XLSX)
    all_products = []
    failed = []
    per_sheet = {}

    for sheet in xl.sheet_names:
        try:
            prods = parse_sheet(XLSX, sheet)
            per_sheet[sheet] = len(prods)
            if not prods:
                failed.append(sheet)
            all_products.extend(prods)
        except Exception as e:
            failed.append(f"{sheet}: {e}")
            per_sheet[sheet] = 0

    # Ensure unique slugs
    seen = {}
    for p in all_products:
        base = p["slug"]
        if base in seen:
            # add sheet suffix
            new_slug = f"{base}-{p['_slug_suffix']}"
            n = 2
            while new_slug in seen:
                new_slug = f"{base}-{p['_slug_suffix']}-{n}"
                n += 1
            p["slug"] = new_slug
        seen[p["slug"]] = True
        del p["_slug_suffix"]

    # Category breakdown
    by_cat = {}
    for p in all_products:
        c = p["category_slug"] or "UNKNOWN"
        by_cat.setdefault(c, []).append(p["name"])

    out = {"products": all_products}
    Path(OUT).parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"TOTAL: {len(all_products)} products")
    print(f"\nPer sheet:")
    for s, n in per_sheet.items():
        print(f"  {s}: {n}")
    print(f"\nFailed/empty sheets: {failed}")
    print(f"\nBy category:")
    for c, names in by_cat.items():
        print(f"  {c}: {len(names)}")
        for n in names[:5]:
            print(f"    - {n}")
    print(f"\nWritten to: {OUT}")


if __name__ == "__main__":
    main()
