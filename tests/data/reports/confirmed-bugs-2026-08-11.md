# Confirmed Bugs — Live-Verified 2026-08-11

Findings from live AEM dev investigation while fixing test failures. For each row, "Evidence" is what was directly observed against `https://author-p101514-e1845752.adobeaemcloud.com` (env=dev). Not committed as test assertions unless noted.

| # | Ticket | Component | Test ID | Summary | Evidence | Confidence |
|---|--------|-----------|---------|---------|----------|------------|
| 1 | GAAM-1358 (see GAAM-397 AC) | Site Header / Main Nav | NVGT-066 | Once a role is selected (e.g. Financial Professional), the site header does not stick to the top of the viewport on scroll — it stays `position: static` and scrolls off-screen. | On `/content/global-atlantic/financial-professionals/main/en.html`, dismissed the first-visit consent modal, scrolled 900px: header `position` stayed `static`, `getBoundingClientRect().top` went to `-75` (scrolled fully off top). Now encoded as a real (currently failing) assertion in `navigation.author.spec.ts` — will auto-pass once fixed. | High — directly reproduced, matches ticket's reported symptom exactly. |
| 2 | GAAM-675 (Sprint 13 Padding) | Text | GAAM-675-003, GAAM-675-011 | Text component (`.cmp-text`) padding is `0px 20px` on desktop but drops to `0px` (all sides) on mobile (375px) — no horizontal padding at all on small viewports. | Confirmed on the deployed text fixture page: desktop `padding: 0px 20px`, same element at 375px width `padding: 0px`. Parent `.aem-GridColumn` also has `0px` padding at both widths, so nothing upstream compensates. | Medium — real, reproducible CSS behavior, but unconfirmed whether zero mobile padding is an intentional design choice (page-level gutter elsewhere) or a regression. Needs design/PM confirmation, not just a selector check. |
| 3 | (no ticket — found incidentally) | Site Header | SH-054 | At tablet width (1024px), `.cmp-site-header`'s internal `scrollWidth` (949px) exceeds its `clientWidth` (874px) by ~75px. | Measured directly; however no descendant element's bounding box actually exceeds the visible viewport (`offenders: []`) — no real horizontal scrollbar appears. The adjacent GAAM-397 AC text explicitly scopes Site Header to "desktop breakpoints only," with mobile deferred to GAAM-393 — tablet isn't a committed target. | Low — likely benign internal box-model quirk, not a user-visible bug. Included for completeness. |

## Not real bugs (test-authoring bugs, already fixed — excluded above)

These looked like product bugs at first but were actually broken tests hitting the wrong page/selector — fixed in this session, not appropriate for a bug tracker:
- `navigation.author.spec.ts` NVGT-015 — hit an undeployed fixture path (404) instead of the real style-guide page.
- `role-selector.author.spec.ts` (all tests) — targeted a deprecated standalone `.cmp-role-selector` that no longer exists; functionality moved into the site header (GAAM-1314).
- `site-header.author.spec.ts` SH-049/050/051/052/054/056/057/063/064 — targeted `/content/global-atlantic/en.html`, which still serves the legacy `.cmp-header`, not the new `.cmp-site-header` (GAAM-792 XF).
- `text.sprint13-padding.spec.ts` (17 of 19 tests) — same undeployed-fixture 404 pattern as NVGT-015; were unknowingly asserting against AEM's "Unexpected Error" 404 page.
