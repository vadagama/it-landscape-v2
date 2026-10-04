# D2 verify-1 — fresh-context verifier spot-check (2026-10-04)

Validation level: normal. Scope: 3 load-bearing claims from d2-r1-1 / d2-r2-1 / d2-r3-1, one independent check each. ≤8 tool calls; 8 used (2 wasted on a cd-path error, retried).

## Claim 1 — Backstage CatalogGraphPage controls; DependencyGraph = dagre + d3-zoom, no third-party graph lib

**Claim:** "Backstage CatalogGraphPage user controls: MaxDepth, Direction, Kinds, Relation-types, Unidirectional, MergeRelations + click-to-re-root, shift+click opens entity page; core DependencyGraph uses @dagrejs/dagre + d3-zoom, no third-party graph library, no node-count limit in code" (source: backstage/backstage master).

**Check performed:** Re-fetched, live from master:
- https://raw.githubusercontent.com/backstage/backstage/master/plugins/catalog-graph/README.md
- https://raw.githubusercontent.com/backstage/backstage/master/packages/core-components/package.json

**Outcome:** verified (within the instructed artifact scope).

**Evidence (one line):** `@backstage/core-components` 0.18.15-next.1 deps include `@dagrejs/dagre ^1.1.4` + `d3-zoom ^3.0.0` (and d3-selection/d3-shape) and contain NO graph-visualization library (no cytoscape/sigma/vis-network/react-flow/react-force-graph); README feature list matches (EntityCatalogGraphCard "filtering for specific relations", CatalogGraphPage standalone viewer, EntityRelationsGraph, custom relations via `DefaultCatalogGraphApi` knownRelations/knownRelationPairs/defaultRelationTypes, node click → entity page via `catalogEntity → catalogPlugin.routes.catalogEntity`).

**Caveat (does not change outcome):** the six-control enumeration, click-to-re-root and shift+click are not spelled out in the README itself — those rest on round 2's primary-source read of `plugins/catalog-graph/src/components/CatalogGraphPage/CatalogGraphPage.tsx` (same repo/branch), consistent with the README's filter/navigation description; the "no node-count limit in code" sub-claim likewise rests on r2's read of `DependencyGraphContent.tsx` and was not re-derived here (out of the instructed artifact scope, budget).

## Claim 2 — Graph library vitality numbers

**Claim:** "cytoscape.js ~11.2k stars MIT, sigma.js ~12.2k stars, react-force-graph ~3.3k stars, @xyflow/react ~38.6k stars (xyflow org-use = paid Pro)" (accessed 2026-10-04; r3 derived from repo HTML pages).

**Check performed:** Re-derived via a DIFFERENT artifact — shields.io badge JSON (`img.shields.io/github/stars/<repo>.json`), 2026-10-04, via curl:
- cytoscape/cytoscape.js → `{"label":"stars","message":"11k"}`
- jacomyal/sigma.js → `{"label":"stars","message":"12k"}`
- vasturiano/react-force-graph → `{"label":"stars","message":"3.3k"}`
- xyflow/xyflow → `{"label":"stars","message":"39k"}`

**Outcome:** verified (all four order-of-magnitude match; in fact rounded match).

**Evidence (one line):** shields.io reports 11k / 12k / 3.3k / 39k vs claimed 11.2k / 12.2k / 3.3k / 38.6k — every figure matches at the badge's rounding; the "xyflow org-use = paid Pro" sub-claim was not re-derived (shields.io can't show it) and stays backed by r3's repo-README citation.

## Claim 3 — Ardoq Dependency Map + viewpoints

**Claim:** "strictly directional reference chains, incoming/outgoing degree sliders, collapse-hierarchy slider; a viewpoint = one dataset re-rendered by switching view style (Block diagram/Dependency map/Relationships/Timeline); 'Save as viewpoint' stores full configuration org-wide" (source: help.ardoq.com articles).

**Check performed:** Located `https://help.ardoq.com/en/articles/44007-dependency-map` in https://help.ardoq.com/sitemap.xml, then fetched the article page (curl of SSR HTML) and phrase-scanned it; same for the cited viewpoint-builder article `https://help.ardoq.com/en/articles/214211-legacy-experience-how-to-customize-save-and-share-views-in-the-new-viewpoint-builder`, 2026-10-04.

**Outcome:** verified.

**Evidence (one line):** article 44007 contains verbatim "strictly directional … This means that incoming", "incoming/outgoing degrees of relationship sliders are available", "degrees of relationship which change direction" (the directional limit), and "Collapse Groups / Collapse Component Hierarchy" (×6); article 214211 contains the "View style" section listing Block diagram / Dependency map / Relationships / Timeline and "Save as viewpoint … All applied configurations will be saved, ensuring everyone sees the information exactly as you intend".
