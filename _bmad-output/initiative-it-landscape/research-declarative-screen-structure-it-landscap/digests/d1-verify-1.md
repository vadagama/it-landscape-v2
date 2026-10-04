# D1 verification pass 1 (fresh-context verifier, 2026-10-04)

Scope: 3 load-bearing claims from D1 r1–r3. One independent check per claim, ≤8 tool calls. No findings rewritten.

## Claim 1 — LeanIX fact sheet detail = Header / Body / Sidebar, body sectioned per type template
- Claim: "LeanIX fact sheet detail page = Header / Body / Sidebar anatomy, body structured in sections from type-specific templates" (digest r3, source: archived docs.leanix.net/docs/what-is-a-factsheet @20210613085421 via Wayback).
- Check performed: Wayback CDX listing (url=docs.leanix.net/docs/*, filter=original:.*factsheet.*) → fetched a DIFFERENT archived page of the same docs: https://web.archive.org/web/20210613083222/https://docs.leanix.net/docs/working-with-factsheets (capture 2021-06-13, distinct page/digest from the cited artifact).
- Outcome: verified (with limitation: same publisher, different archived docs page — no third-party source fetched within budget; acceptable per product-UI rule).
- Evidence: the working-with-factsheets page independently corroborates the substance — Fact Sheet as "one-pager" whose content is edited per-section with "Save & Next" moving between named sections ("Lifecycle" etc.), and header-hosted collaboration modules (Subscriptions, Comments, Documents, Metrics, Surveys, full Change History with Event/Path/Old-New/User-Time); type-specific structure echoed in per-type naming rules for 10+ Fact Sheet types. The literal "Header/Body/Sidebar" three-part wording itself appears only on the cited page.

## Claim 2 — Ardoq Component Overview = 5-tab profile page, references grouped by typed triple
- Claim: "Ardoq Component Overview = tabbed single-entity profile page (Overview/Fields/References/Viewpoints/Styles), references grouped by typed triple Source→Type→Target" (digest r2, source: help.ardoq.com article 523928, updated ~2026-09).
- Check performed: (a) re-fetch of https://help.ardoq.com/en/articles/523928-new-ardoq-experience-get-started-with-the-new-component-overview-page (exists, "Updated this week" ≈ access date 2026-10-04); (b) different artifact: https://help.ardoq.com/en/articles/146066-legacy-experience-component-overview-page-in-ardoq-and-ardoq-discover (related article on the same screen).
- Outcome: verified.
- Evidence: re-fetched article states the page has exactly five tabs (Overview: read-only summary; Fields; References; Viewpoints; Styles) and that "The References tab shows a structured view of all references grouped by triple (Source → Reference Type → Target)", e.g. "Application → Integrates With → Application", with each triple element clickable; the second artifact corroborates the single-entity "Component Overview Page" concept with Component Details / References / Fields / Viewpoints / Surveys blocks, and is explicitly marked Legacy Experience (different product generation, not a contradiction of the new-experience claim; both artifacts same publisher = Ardoq help center).

## Claim 3 — Backstage catalog index: config-only defaults, code for new filters/columns
- Claim: "pagination/export/filter defaults configurable via app-config only; new filter types/custom columns require code" (digest r1, source: backstage.io/docs/features/software-catalog/catalog-customization).
- Check performed: re-fetch of https://backstage.io/docs/features/software-catalog/catalog-customization (200, current docs; no 404 this round).
- Outcome: verified.
- Evidence: page confirms pagination (incl. offset mode/limit) and export (CSV/JSON + column-selection dialog) enabled purely via `app-config.yaml`; default filters (kind, type, owner, lifecycle, tag, namespace, processing status) get `initialFilter` and can be disabled via config (`catalog-filter:catalog/lifecycle: false`); new filter types require a `CatalogFilterBlueprint` frontend module, custom columns/actions/table options require overriding the `page:catalog` extension with a custom page component (code), and the context menu requires `EntityContextMenuItemBlueprint` (code) — matching the claim's config-vs-code split.
