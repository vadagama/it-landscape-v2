# D3 verification 1 — spot-check of load-bearing claims (fresh-context verifier, 2026-10-04)

Method: 3 direct re-fetches of the cited artifacts + 1 Ardoq sitemap spot-check (curl/grep; matches found but locs/lastmods garbled by the output filter — treated as secondary; primary evidence = direct re-fetches). 8 tool calls total. No findings rewritten.

## Claim 1 — Ardoq Timeline view mechanics
- Claim: date-range field values render as bars (phases), date field values as milestone diamonds, multiple date ranges per component = distinct phases; layout daily→yearly with window constraints (source: help.ardoq.com article 44061, updated 2026-08-07).
- Check: re-fetched live article https://help.ardoq.com/en/articles/44061-timeline-view (2026-10-04); sitemap spot-checked for slug presence.
- Outcome: verified
- Evidence: page states "Date range field values are displayed as bars (phases) and date field values are displayed as milestones in the component row", "Multiple date ranges will appear as distinct phases on the timeline", and layout minimums Daily ≥1 week / Weekly ≥1 month / Monthly ≥3 months / Quarterly ≥1 year / Yearly ≥3 years; on-page date "August 7, 2026" matches the claimed update.

## Claim 2 — Ardoq Scenarios view-style limitation
- Claim: Scenarios support Block Diagram and Pages view styles ONLY (source: help.ardoq.com article 43997, 2026-09-17).
- Check: re-fetched live article https://help.ardoq.com/en/articles/43997-build-application-roadmaps-using-ardoq-scenarios (2026-10-04).
- Outcome: verified
- Evidence: exact sentence present on page: "Note: Currently, Scenarios support Block Diagram and Pages view styles only."; on-page "Updated over 2 weeks ago" is consistent with the claimed 2026-09-17 lastmod (sitemap lastmod not cleanly re-read — noted, not load-bearing for the limitation itself).

## Claim 3 — LeanIX A&R Planning (milestones, impacts, Jira)
- Claim: milestones are first-class shared/re-usable objects (updates propagate), project impacts at completion + key milestones, Jira epics/issues sync into initiative fact sheets (sources: LeanIX docs round 1 + leanix.net product page round 3).
- Check: re-fetched https://www.leanix.net/en/products/architecture-and-road-map-planning (live page, 2026-10-04); confirmed it is SAP LeanIX vendor marketing (©2026 SAP SE footer).
- Outcome: verified (vendor marketing — medium confidence stands)
- Evidence: page states "sharing and re-using milestones across related projects and sub-projects" + "updating a milestone date will automatically reflect that change everywhere it's referenced"; "affect your IT landscape at completion and at key milestones"; "Connect Jira to sync epics, to-dos, and issues from multiple projects and instances to SAP LeanIX initiative fact sheets".
