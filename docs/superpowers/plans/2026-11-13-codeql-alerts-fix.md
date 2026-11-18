# Fix open CodeQL alerts on `stage` (23 alerts)

## Context
`gh api .../code-scanning/alerts?state=open&ref=refs/heads/stage` returns 23 open CodeQL alerts in 5 rules, but only 12 distinct code sites. Several alerts share a line (xss + url-redirect on the same `href`/`src`). Goal: fix the real issues, harden the rest, and close or dismiss every alert with a reason. Work was planned as 4 small PRs by root cause, ordered by real risk.

**Status:** all 4 items are delivered in one PR, #2698 (draft from dependabatch), instead of 4 separate PRs. It adds `encodeURIComponent` on API path segments, https-only checks on rendered hrefs and image sources, `$eq` filters, and on top of that the sitemap `baseUrl` change and the Zod field whitelist for comment updates described below. CodeQL does not recognize the inline regex checks on the 5 URL sinks as sanitizers, so those 10 alerts (309-318) are dismissed as false positives after review, with a comment pointing at the check.

| Rule | Count | Real risk |
|---|---|---|
| js/xss + js/client-side-unvalidated-url-redirection | 5 + 5 (same 5 sites) | Real: user-supplied source/wikipedia/image URLs rendered raw (`javascript:` URLs) |
| js/xss-through-exception (sitemap) | 1 | Real-ish: Host header trusted, dead Google ping endpoint |
| js/sql-injection (NoSQL) | 2 | comment update: real-ish; ai-task: false positive |
| js/request-forgery (client axios) | 10 | Low: same-origin relative paths, path traversal only |

## PR 1 - `fix/client-unsafe-url-sinks` (alerts 309-318, 10 alerts)
Reuse existing `sanitizeUrl` in `src/utils/ValidateUrl.ts:32` (allows only http/https/blob, already used by `ImageUpload.tsx`, `LogoThumb.tsx`).
- `src/components/ImageClaim.tsx:28` - `src={sanitizeUrl(src)}`
- `src/components/Personality/PersonalityInfo.tsx:95` - `href={sanitizeUrl(personality.wikipedia)}`, skip the link when empty
- `src/components/Source/ClaimSourceListItem.tsx:15,23` - sanitize both `href` and the legacy string `source` branch
- `src/components/VerificationRequest/SourceListVerificationRequest.tsx:31` - sanitize `source.href` for `Link`
- When sanitized value is empty, render plain text (no `href`) instead of a dead link.
- Tests: unit tests for `sanitizeUrl` (`javascript:`, `data:`, relative, valid https) if not present; component test for one site.

## PR 2 - `fix/sitemap-host-header` (alert 175)
`server/sitemap/sitemap.controller.ts` builds the origin from `req.protocol + req.get("host")` (Host header injection; public `sitemap.xml` cached 24h), and `submit-sitemap` returns `err.message` from a Google ping endpoint that Google retired in 2023.
- Remove `submitSitemap` endpoint and `SitemapService.submitSitemap` (no callers found in `src/` or `server/`).
- Build the sitemap origin from config (existing base URL setting if one exists, check `config.yaml` / `localConfig`), fall back to `req` only in dev.

## PR 3 - `fix/nosql-query-injection` (alerts 293, 388)
- `server/ai-task/ai-task.service.ts:35` - value is already enum-checked; switch to `find({ state: { $eq: state } })` so CodeQL sees the sanitizer.
- `server/review-task/comment/comment.service.ts:71` - `{ $set: { ...otherFields } }` from request body. Add a Zod schema (per `server/CLAUDE.md` Validation) that whitelists updatable comment fields with primitive types, parse in the controller/service before `findByIdAndUpdate`. Check every caller of `update` / `updateManyComments` first.
- Tests: Vitest e2e/unit asserting operator payloads (`{ "$gt": "" }`, `{ "$where": ... }`) are rejected.

## PR 4 - `fix/client-api-path-encoding` (alerts 322-329, 351, 369, 370)
Axios instances use relative `baseURL` from `src/api/apiFactory.ts`; ids/hashes go into paths unescaped, so a crafted id like `../users/x` can retarget same-origin requests with cookies.
- Add a tiny helper (e.g. `pathParam(v) => encodeURIComponent(String(v))`) in `src/api/apiFactory.ts` and apply it in: `claimApi.ts:75`, `personality.ts:71`, `reviewTaskApi.ts:52,86,140,154`, `sentenceApi.ts:7`, `verificationRequestApi.ts:133,171,224`.
- Grep the rest of `src/api/` for the same `` `/${x}` `` pattern and apply it there too, so new alerts don't appear later.
- If CodeQL still flags after encoding (it may not model the axios `baseURL`), dismiss remaining alerts as "false positive" with the reason "same-origin relative path, segment URI-encoded".

## Process
- Each PR from `stage`, Conventional Commits, one PR per item above, merge in order 1 -> 4.
- After each merge, re-run the alert query and confirm the listed alert numbers moved to `fixed`:
  `gh api "repos/aletheiafact/aletheia/code-scanning/alerts?state=open&ref=refs/heads/stage&per_page=100" --jq '.[].number'`
- Dismiss leftovers only with a written reason (`gh api -X PATCH .../alerts/<n> -f state=dismissed -f dismissed_reason="false positive" -f dismissed_comment=...`), after user confirmation.

## Verification
- `yarn lint`, type-check, and server Vitest suite per PR.
- PR 1: manual check in `yarn dev` that a source with `javascript:alert(1)` renders as text, valid sources still link.
- PR 2: `curl -H "Host: evil.test" localhost:3000/sitemap.xml` returns configured origin; `/submit-sitemap` is 404.
- PR 3: e2e test with operator payload returns 400, normal comment edit still works.
- PR 4: review task, claim, personality and verification request pages still load and save.
- CodeQL workflow (`.github/workflows/codeql-analysis.yml`) runs on each PR; check its result shows the alerts fixed.
