# D6 verification — spot-check digest claims (fresh-context verifier, normal level)

Verifier: independent fresh-context check, 2026-10-04. Budget ≤ 8 tool calls: used 8 (2 digest reads, 5 source fetches, 1 write). No findings rewritten; outcomes only.

## Claim 1 — Backstage PostgreSQL search engine

**Claim (from d6-r2-1):** Backstage PostgreSQL search engine is a first-party default: `@backstage/plugin-search-backend-module-pg`, requires PG ≥ 12, documented as "performs well with ten thousands of indexed documents", ts_headline highlighting with perf toggle.

**Check performed:** Re-fetched the package README directly from the backstage/backstage monorepo (first-party location under `plugins/`): https://raw.githubusercontent.com/backstage/backstage/master/plugins/search-backend-module-pg/README.md — live, not 404.

**Outcome:** verified

**Evidence (one line):** README states verbatim "performs well with ten thousands of indexed documents", "The search plugin requires at least Postgres 12!", and that the highlight feature "uses `ts_headline` which has been known to potentially impact performance" with a minimal `useHighlight: false` toggle.

**Notes:** First-party confirmed by package living in the official monorepo; README links to backstage.io docs for setup ("default"-ness per the engine docs page was already evidenced in r2 and is consistent with a first-party engine module; residual overview-table wording "community-maintained" noted in r2 remains a docs-page inconsistency, not a dispute of the claim).

## Claim 2 — PostgreSQL FTS functions & documented pattern

**Claim (from d6-r1-1/r2/r3):** `jsonb_to_tsvector(config, document, filter)` documented with filter keywords (string/numeric/boolean/key/all) + stored generated tsvector column + GIN as the documented pattern; `websearch_to_tsquery` for raw user input.

**Check performed:** Fetched PostgreSQL 18 current docs: https://www.postgresql.org/docs/current/functions-textsearch.html (both functions) and https://www.postgresql.org/docs/current/textsearch-tables.html (generated column + GIN pattern). Note: the task's suggested page functions-json.html does not carry these functions; §9.13 functions-textsearch.html does — checked the authoritative page instead.

**Outcome:** verified

**Evidence (one line):** Table 9.43 documents `jsonb_to_tsvector ( [ config regconfig, ] document jsonb, filter jsonb )` with "zero or more of these keywords: `"string"` … `"numeric"` … `"boolean"` … `"key"` … or `"all"`" and `websearch_to_tsquery` ("approximates the behavior of some common web search tools"; or/`-`/quotes handled, other punctuation ignored); §12.2.2 documents the stored generated column `ADD COLUMN … tsvector GENERATED ALWAYS AS (to_tsvector('english', …)) STORED` plus `CREATE INDEX … USING GIN (…)` as the documented pattern.

## Claim 3 — Ardoq Data Inventory vs semantic search

**Claim (from d6-r3-1):** Ardoq Data Inventory has NO text-search box — multi-column removable filter chips + sort only; Ardoq semantic search is GA (July 2026) across exactly six indexed types (Component, Dashboard, Report, Survey, Presentation, Broadcast), permission-aware.

**Check performed:** Re-fetched both articles via the live Intercom help-center JSON endpoint (same artifacts as the /en/articles/<id> pages): https://help.ardoq.com/api/v2/help_center/en-gb/articles/299104.json ("Ardoq Data Inventory - Unlock Easier Data Management", Jonas Laberg, updated this week) and https://help.ardoq.com/api/v2/help_center/en-gb/articles/682139.json ("Semantic quick search", Mathias Pedersen, July 8, 2026).

**Outcome:** verified

**Evidence (one line):** Data Inventory article documents only column config, sort-by-any-column (default: name) and multi-column property filters rendered as "removable chips above the table" — no free-text search box appears anywhere, and its "Upcoming" list confirms substring/range filtering is not yet shipped; the semantic-search article (2026-07-08) states "Semantic Search is in General Availability" (gradual rollout via CSM), "Results from all six types" with exactly Component, Dashboard, Report, Survey, Presentation, Broadcast indexed ("Workspaces, viewpoints, references, and individual fields aren't indexed yet"), and "Results are permission-aware."

**Caveats (do not change outcome):** "GA" carries the article's own qualifier — in GA but rolling out gradually per organization via CSM. "No text-search box" is an absence claim verified against this one article (no search box documented); a UI change after the article's last update could not be excluded from a doc check alone.
