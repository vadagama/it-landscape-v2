# D7 verification pass 1 (fresh-context verifier, 2026-10-04)

Scope: spot-check of 3 load-bearing claims from r1/r2 digests, dimension D7 (Declarative & modular UI configuration), validation level normal. One independent check per claim; no findings rewritten.

## Claim 1 — Ardoq Component Overview page is metamodel-driven down to layout

Claim: field order from workspace manager; admin-set Priority Fields per type; References tab auto-populated from permitted metamodel triples (including zero-instance); Field Groups beta (2026-08-25) adds admin-defined field sections. (Source digest: d7-r2-1.md, Ardoq articles 523928 and 757885.)

Check performed:
- Re-fetched https://help.ardoq.com/sitemap.xml — confirmed live slugs: `/en/articles/523928-new-ardoq-experience-get-started-with-the-new-component-overview-page` (lastmod 2026-09-30) and `/en/articles/757885-beta-field-groups` (lastmod 2026-08-25).
- Re-fetched both article pages in full (help.ardoq.com, accessed 2026-10-04).

Outcome: **verified**

Evidence (one line): Article 523928 states verbatim "Field order on the Component Overview Page follows the order set in the workspace manager", "Priority Fields are configured per component type by an Ardoq admin" (via Organization Settings → Priority settings), and — for metamodel constraints — "all permitted triples appear in the list — including those with zero existing instances. This is by design"; article 757885 "[Beta] Field Groups" (written August 25, 2026) states "Field Groups let an administrator bundle related fields into organized sections" (My Organization > Fields/Metamodel Constraints; opt-in beta enabled by CSM/Support).

Notes: minor slug drift only — digest cited "757885-field-groups-beta", current sitemap slug is "757885-beta-field-groups"; same article ID and date, no impact on outcome.

## Claim 2 — Backstage custom kind cost is frontend-dominated; new type is cheap

Claim: docs say there are "many places where code checks if (kind === ...)" — new kind = schema package + processor code + plugin updates; a new TYPE within a kind is "relatively little effort, little risk". (Source digest: d7-r2-1.md, backstage.io extending-the-model.)

Check performed: Re-fetched https://backstage.io/docs/features/software-catalog/extending-the-model (200, page © 2026 Backstage Project Authors; accessed 2026-10-04).

Outcome: **verified**

Evidence (one line): Page contains verbatim "Adding a kind has a very large impact… There will be many places where code checks `if (kind === 'X')` for some hard coded `X`, and casts it to a concrete type" from `@backstage/catalog-model`, plus the custom-kind recipe (namespaced `apiVersion` e.g. `my-company.net/v1`; isomorphic package with TypeScript type + JSONSchema; custom `CatalogProcessor` registered via a catalog backend module; "make plugins be able to understand the new kind"), and verbatim "Adding a new type takes relatively little effort and carries little risk. Any type value is accepted by the catalog backend, but plugins may have to be updated".

## Claim 3 — RJSF: forms auto-generate from JSON Schema; presentation requires separate uiSchema layer

Claim: forms auto-generate from JSON Schema, presentation requires separate uiSchema layer. (Source digest: d7-r1-1.md and d7-r2-1.md, rjsf-team.github.io.)

Check performed: Re-fetched https://rjsf-team.github.io/react-jsonschema-form/docs/ (200; version banner "Current (v6.11.0)"; accessed 2026-10-04).

Outcome: **verified**

Evidence (one line): Docs state "A simple React component capable of building HTML forms out of a JSON schema" and "react-jsonschema-form is meant to automatically generate a React form based on a JSON Schema", while look-and-feel customization is a distinct mechanism: "react-jsonschema-form also comes with tools such as `uiSchema` and other form props to customize the look and feel of the form beyond the default themes" — schema drives form generation; uiSchema is the separate presentation layer.

Notes: the word "requires" in the claim is slightly stronger than the docs' phrasing ("comes with tools such as uiSchema… to customize"), but the two-layer separation (schema = structure/generation, uiSchema = presentation) is exactly as documented; no dispute.
