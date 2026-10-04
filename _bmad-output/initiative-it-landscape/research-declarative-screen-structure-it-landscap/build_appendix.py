import re, sys, io

scratch = "/Users/olegkrasnov/Documents/GitHub/it-landscape-v2/_bmad-output/initiative-it-landscape/research-declarative-screen-structure-it-landscap/sources-scratch.md"
main = "/Users/olegkrasnov/Documents/GitHub/it-landscape-v2/_bmad-output/initiative-it-landscape/research-declarative-screen-structure-it-landscap/research-declarative-screen-structure-it-landscap.md"

rows = []
with io.open(scratch, encoding="utf-8") as f:
    for line in f:
        line = line.rstrip("\n")
        m = re.match(r'^\[(\d+)\]\s*(.*)$', line)
        if not m:
            continue
        n = m.group(1)
        rest = m.group(2)
        parts = [p.strip() for p in rest.split(" | ")]
        if len(parts) < 5:
            print(f"WARN row [{n}]: {len(parts)} parts", file=sys.stderr)
            continue
        if len(parts) > 5:
            parts = [" | ".join(parts[: len(parts) - 4])] + parts[-4:]
            print(f"WARN row [{n}]: rejoined claim pipes", file=sys.stderr)
        claim, publisher, url, accessed, confidence = parts
        # pub date: shortest parenthetical in publisher containing a 4-digit year
        pub = "n.d."
        parens = re.findall(r'\(([^)]*)\)', publisher)
        candidates = [p for p in parens if re.search(r'\d{4}', p)]
        if candidates:
            chosen = min(candidates, key=len)
            pub = chosen.strip()
            publisher_clean = publisher.replace("(" + chosen + ")", "").strip(" ,")
        else:
            publisher_clean = publisher
        # fix swapped columns: a year-range in accessed is a pub range
        if re.match(r'^\d{4}[–-]\d{4}$', accessed):
            pub = pub if pub != "n.d." else accessed
            accessed = "2026-10-04"
        if url.startswith("http"):
            pcell = f"[{publisher_clean}]({url})"
        else:
            pcell = publisher_clean
        rows.append((int(n), claim.replace("|", "\\|"), pcell, pub, accessed, confidence))

rows.sort()
lines = [
    "## Источники",
    "",
    "| # | Что подтверждает | Источник | Публ. | Accessed | Confidence |",
    "|---|---|---|---|---|---|",
]
for n, claim, pcell, pub, accessed, confidence in rows:
    lines.append(f"| [{n}] | {claim} | {pcell} | {pub} | {accessed} | {confidence} |")

with io.open(main, encoding="utf-8") as f:
    content = f.read()
appendix = "\n".join(lines) + "\n"
with io.open(main, "w", encoding="utf-8") as f:
    f.write(content.rstrip() + "\n\n" + appendix)
print(f"appended {len(rows)} source rows")
