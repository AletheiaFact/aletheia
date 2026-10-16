# Caching

This document describes how Aletheia caches pages and assets. Cloudflare is in
front of the NestJS server in production. Read this document before you change a
`Cache-Control` header or a Cloudflare rule.

## How the edge behaves

Cloudflare caches a response by file extension by default. Files such as `.js`,
`.css`, `.ico`, and `.woff2` follow the `Cache-Control` header from the origin.
HTML has no extension, so Cloudflare marks it `DYNAMIC` and does not cache it.
A `Cache-Control` header on a page controller reaches browsers only. To cache
HTML at the edge, you must add a Cache Rule in the Cloudflare dashboard.

## Static assets under `/_next/static`

`ViewController.staticAssets` serves these files with
`public, max-age=31536000, immutable`.

A long lifetime is safe here. Every URL under `/_next/static` contains a content
hash or the build ID. Two examples from production:

- `/_next/static/chunks/framework-c17f08e07d1abc.js` — content hash
- `/_next/static/tqciPJRFLbeIk7IdD7S/_buildManifest.js` — build ID

A new build writes new file names. The old URL never points to new bytes.
A cached copy of an old URL therefore stays correct. Next.js sets the same
header for these files by default.

Do not apply this header to `/_next/image` or `/_next/data`. Those paths return
content that changes between builds under the same URL. `ViewController.assets`
keeps them at 60 seconds.

## The deploy risk to watch

The risk is stale **HTML**, not stale assets.

An HTML page names the chunk URLs for that build. A browser that holds old HTML
after a deploy requests old chunk URLs. The new pod does not contain those
files, so the request returns 404 and the page fails to load.

Two facts control the size of this risk:

1. The browser TTL of the HTML. A page cached for 5 minutes creates a 5 minute
   window. A page cached for a day creates a one day window.
2. The Kubernetes rollout. `deployment/app.yml` runs 1 replica and the
   HorizontalPodAutoscaler allows 3. During a rollout, an old pod and a new pod
   both serve traffic. Only the old pod holds the old chunks.

Do not raise the HTML TTL without a cache purge in the deploy pipeline. See
"Purge the cache on deploy" below.

## Public and private responses

Cloudflare does not store a response that carries `Cache-Control: private`.
Every endpoint behind a guard sends `private`. Every endpoint marked `@Public()`
does not. This split is what makes a broad Cache Rule safe: a rule that matches
too much still cannot store a guarded response.

Keep this rule when you add an endpoint:

- `@Public()` endpoint — use `max-age=...` without `private`.
- Guarded endpoint — start the header with `private,`.

## Cloudflare Cache Rules

Add these rules in the Cloudflare dashboard, under Rules > Caching > Cache Rules.
Order matters. Cloudflare applies the first rule that matches.

### Rule 1 — bypass the API

Expression:

```
starts_with(http.request.uri.path, "/api/")
```

Setting: Bypass cache.

### Rule 2 — cache public pages

Expression:

```
http.request.uri.path in {"/" "/about" "/privacy-policy" "/code-of-conduct" "/supportive-materials" "/signup-invite" "/404"}
or starts_with(http.request.uri.path, "/personality/")
or starts_with(http.request.uri.path, "/claim/")
or starts_with(http.request.uri.path, "/source/")
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: Override origin, 300 seconds
- Browser TTL: Respect origin
- Cache key: add the cookie `default_language`

The cookie in the cache key is required. `GetLanguageMiddleware` reads
`default_language` and the server renders a different page for `pt` and for `en`.
A cache key without this cookie serves the wrong language.

You do not need to exclude logged-in readers. `_app.tsx` calls `GetUserRole()`
in the browser, so the HTML is the same for a reader who signed in and a reader
who did not.

### Rule 3 — respect the origin for static assets

Expression:

```
starts_with(http.request.uri.path, "/_next/static/")
```

Settings: Eligible for cache, Edge TTL "Use cache-control header if present".

This rule is optional. Cloudflare already caches these files by extension. The
rule makes the behaviour explicit and protects it from a later change.

## Purge the cache on deploy

Run this command after each production deploy. It removes the HTML that names
the old chunk URLs.

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"hosts":["aletheiafact.org","www.aletheiafact.org"]}'
```

The purge also drops the cached static assets. This cost is small, because the
new build uses new file names and the old files are no longer requested.

## How to check the result

Use `curl` and read `cf-cache-status`:

```bash
curl -sS -o /dev/null -D - https://aletheiafact.org/ | grep -Ei "cache-control|cf-cache-status"
```

The values mean:

- `HIT` — Cloudflare served the response from cache. This is the target.
- `MISS` — Cloudflare stored the response for the next request.
- `REVALIDATED` — the TTL was too short and Cloudflare asked the origin again.
- `EXPIRED` — the same, after the copy went stale.
- `DYNAMIC` — Cloudflare did not cache the response. HTML shows this until you
  add Rule 2.
