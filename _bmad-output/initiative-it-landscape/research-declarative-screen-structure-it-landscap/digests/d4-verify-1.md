# D4 verification (fresh-context verifier, level: normal) — 2026-10-04

Scope: 3 load-bearing claims from d4-r1-1 / d4-r2-1 / d4-r3-1; one independent check each.
Budget: 8 tool calls (7 used: 3 digest reads + 4 fetches).

## Claim 1 — AOE Technology Radar

- **Claim:** canonical repo now AOEpeople/techradar (v4.0.0 Next.js rewrite, no D3, Fuse.js search); authoring = Markdown + front-matter (title/ring/quadrant/tags/featured) in YYYY-MM-DD release folders; generator Apache-2.0.
- **Check performed:** fetched https://github.com/AOEpeople/techradar (server-rendered HTML, default branch `main`).
- **Outcome:** verified (partial coverage).
- **Evidence (one line):** Repo exists and is public (68 stars, 47 forks, 615 commits, branch `main`) with `radar/`, `config.json`, `License`, `Readme.md`; its README ("AOE Technology Radar - Content") locates AOE's radar content there (published at https://techradar.aoe.com/) and demonstrates front-matter authoring (`tags: [devops, security]`) — corroborating MD+front-matter authoring; caveat: this README does not itself mention v4.0.0/Next.js/Fuse.js (those trace to the aoe_technology_radar README per digest r3, and it points generator-seekers back to AOEpeople/aoe_technology_radar), and the license type (Apache-2.0) was not visible in the fetched HTML (License file present, type unconfirmed this check).

## Claim 2 — Backstage tech-radar data model

- **Claim:** TechRadarLoaderResponse = {quadrants{id,name}, rings{id,name,color,description?}, entries{key,id,quadrant,title,url?,timeline[{date,ringId,description?,moved?}],description?,links?}} — no sizes/angles in the schema.
- **Check performed:** re-fetched https://raw.githubusercontent.com/backstage/community-plugins/main/workspaces/tech-radar/plugins/tech-radar-common/src/schema.ts (raw, `main`).
- **Outcome:** verified.
- **Evidence (one line):** Zod parsers match field-for-field: RadarQuadrant {id, name}; RadarRing {id, name, color, description?}; RadarEntry {key, id, quadrant, title, url?, timeline: RadarEntrySnapshot[{date (z.coerce.date), ringId, description?, moved? (nativeEnum MovedState)}], description?, links?: [{url, title}]}; TechRadarLoaderResponseParser = {quadrants, rings, entries}; no size/angle/coordinate fields anywhere in the file.

## Claim 3 — ThoughtWorks Hold→Caution rename; stale web copy

- **Claim:** BYOR v1.2.0 release note renames the 4th ring Hold→Caution; TW web copy still says Hold (stale).
- **Check performed:** re-fetched the release-note artifact cited in d4-r2 at tag granularity — https://github.com/thoughtworks/build-your-own-radar/releases/tag/v1.2.0 — and https://www.thoughtworks.com/radar/byor.
- **Outcome:** verified (both halves).
- **Evidence (one line):** v1.2.0 tag page (released 15 Apr by sarnya, commit `d564569`, marked Latest): "Merge PR #412, which involves rename of 'Hold' ring to 'Caution'"; the BYOR page (©2026 Thoughtworks footer) still instructs: "Ring names: Adopt, Trial, Assess, Hold" — web copy lags the release note, as claimed.
