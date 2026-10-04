# D5 verification — d5-verify-1 (fresh-context verifier, 2026-10-04)

Method: independent re-fetch of the cited artifacts (curl): GitHub commits API, workspace + plugin READMEs, package.json files, git refs API, docs.arc42.org (/home/, /section-3/), arc42.org, c4model.com (/ and /diagrams). All checks run 2026-10-04. Digests read: d5-r1-1.md, d5-r2-1.md, d5-r3-1.md.

## Claim 1 — Backstage ADR plugin: maintenance, releases, NFS alpha, MADR parser

- Claim: "actively maintained: last commit to workspaces/adr 2026-09-24, releases up to v1.55.1, ships NFS alpha extensions (entity-content:adr/entity), default parser covers MADR 2.x/3.x only"
- Check performed (artifacts, URLs):
  - Commits API: https://api.github.com/repos/backstage/community-plugins/commits?path=workspaces/adr&per_page=3
  - Prescribed README: https://raw.githubusercontent.com/backstage/community-plugins/main/workspaces/adr/README.md (lists adr-backend, adr-common, search-backend-module-adr)
  - Plugin README: https://raw.githubusercontent.com/backstage/community-plugins/main/workspaces/adr/plugins/adr/README.md
  - Version check: package.json of all 4 workspace packages on main; git refs https://api.github.com/repos/backstage/community-plugins/git/matching-refs/tags/adr
- Outcome: **disputed** (3 of 4 sub-claims verified; the version sub-claim is contradicted — both sides reported)
  - Recency VERIFIED: top commits touching workspaces/adr are 2026-09-24T14:20:56Z "Version Packages (#11347)" and 2026-09-24T13:39:00Z "adr migration from MUI to BUI (#10891)" — exactly matching digest r2 (actively maintained ✓).
  - NFS alpha VERIFIED: plugin README shows alpha import `@backstage-community/plugin-adr/alpha` (L122) and extension `entity-content:adr/entity` (L136).
  - MADR VERIFIED: plugin README L222 — default parsing per MADR v2.x (2.1.2) or MADR 3.x (3.0.0) template, front matter only in 3.x; no MADR 4.x mention — "2.x/3.x only" ✓.
  - "releases up to v1.55.1" NOT CONFIRMED / CONTRADICTED: current versions on main are plugin-adr 0.31.0, adr-backend 0.26.1, adr-common 0.25.0, search-backend-module-adr 0.23.1, workspace root @internal/adr 1.0.0; the tags API returns no refs with prefix "adr". No 1.55.x version observable anywhere in the workspace; the digest's cadence (v1.51.0→v1.55.1, said to come from the atom feed) could not be reproduced from any repo artifact.
- One-line evidence: commits API confirms last workspaces/adr commit 2026-09-24T14:20:56Z; plugin README confirms `entity-content:adr/entity` alpha extension and MADR 2.x(2.1.2)/3.x(3.0.0)-only default parser; but main-branch package versions are 0.31.0/0.26.1/0.25.0/0.23.1 with no adr-prefixed tags — v1.55.1 not found.

## Claim 2 — arc42: 12-section template, CC BY-SA 4.0, Section 03 context/scope

- Claim: "arc42 defines a 12-section document template, licensed CC BY-SA 4.0; Section 03 'Context and Scope' ties the document to one system with neighboring systems/interfaces"
- Check performed (artifacts, URLs): https://docs.arc42.org/home/ (section-link + license extraction); https://docs.arc42.org/section-3/; https://arc42.org/ (license footer)
- Outcome: **verified**
- One-line evidence: docs.arc42.org/home links section-1 through section-12 (all 12 present) with footer "CC BY-SA 4.0" (by-sa/4.0 link; same license on arc42.org); the section-3 page contains "Context and Scope" (×3), "System scope", "neighboring systems" (×2), "external interfaces" (×4) — system scoping with neighbors/interfaces confirmed.

## Claim 3 — C4 model: "system context and container diagrams are sufficient for most software development teams"

- Claim: "'the system context and container diagrams are sufficient for most software development teams' — component/code level = lower-level design" (source: c4model.com)
- Check performed (artifacts, URLs): https://c4model.com/ (full-phrase count → 0); https://c4model.com/diagrams (fragment extraction, page sanity via `<title>Diagrams | C4 model`)
- Outcome: **verified** (quote confirmed on https://c4model.com/diagrams — not on the home page; digest r3 cites /diagrams, which is correct)
- One-line evidence: c4model.com/diagrams contains "all 4 levels of diagram" and "sufficient for most software development teams." (the middle words are inline links, so the exact contiguous string is not greppable in raw HTML); home page has zero occurrences of the phrase.
