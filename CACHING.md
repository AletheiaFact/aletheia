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
2. The Kubernetes rollout. During a rollout, an old pod and a new pod both
   serve traffic. Only the old pod holds the old chunks. More replicas make
   this window longer. The production replica count is
   `DeploymentOptions.replicas` in `deployment/k8s/production.pkl`. CI
   generates `deployment/app.yml` from that file, so the committed
   `deployment/app.yml` is out of date. `hpa.yml` is not applied: it is
   outside `deployment/`, so the deploy step does not read it.

Do not raise the HTML TTL without a cache purge in the deploy pipeline. See
"Purge the cache after a deploy" below.

## Public and private responses

Cloudflare does not store a response that carries `Cache-Control: private`.
Every endpoint behind a guard sends `private`. Every endpoint marked `@Public()`
does not. Because of this split, a rule that matches too much still cannot
store a guarded response.

Keep this rule when you add an endpoint:

- `@Public()` endpoint — use `max-age=...` without `private`.
- Guarded endpoint — start the header with `private,`.

A `@Public()` response can still change for a signed-in user.
`getParamsBasedOnUserRole` shows hidden claims and personalities to admins,
both in the API and in the server-rendered page. For this reason every Cache
Rule below skips the cache when the request carries an Ory session.

## Cloudflare Cache Rules

The zone `aletheiafact.org` (ID `d18ad38c1d402090a9d26eb19cd09d4a`) is on the
**Business** plan. The rules are in the zone ruleset
`3cc722a11a1244b9af8af198dbcbafcc` (phase `http_request_cache_settings`). In
the dashboard, they are under Caching > Cache Rules. Smart Tiered Cache is on.

### How the rules combine

Cache Rules stack. They are not first-match. Cloudflare applies every rule
that matches a request. If two matching rules set the same setting, the
**last** matching rule wins. The three rules below do not overlap, so their
order has no effect. Keep them disjoint when you add a rule.

### The Business plan cannot key on a cookie

On Free, Pro and Business, a Cache Rule cannot add a cookie, a header or the
user to the cache key. Those custom cache keys need Enterprise. The server
renders a different page for `pt` and `en` (`GetLanguageMiddleware` reads the
`default_language` cookie, and the default is `pt`). We therefore cannot store
both languages under one URL.

The rules store only the `pt` page. A request without the cookie, or with
`default_language=pt`, gets the cached `pt` page. A request with
`default_language=en` skips the cache and goes to the origin. If a third
language is added, update the cookie conditions below.

### Conditions that every rule uses

- `not http.cookie contains "ory_session_"` — skip the cache for a signed-in
  browser. Ory Cloud names the session cookie `ory_session_<project>`.
- `not any(lower(http.request.headers.names[*])[*] eq "x-session-token")` —
  skip the cache for the native app, which sends an Ory session token in
  the `X-Session-Token` header. Do not write this as
  `len(http.request.headers["x-session-token"]) eq 0`. A missing header gives
  no value, and the rule can then fail to match a normal browser.

### Rule 1 — debate page HTML

Expression:

```
(http.host in {"aletheiafact.org" "www.aletheiafact.org"}
 and http.request.method eq "GET"
 and http.request.uri.path contains "/claim/"
 and ends_with(http.request.uri.path, "/debate")
 and not http.cookie contains "ory_session_"
 and not http.cookie contains "default_language=en")
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: ignore the origin header, 60 seconds
- Browser TTL: respect the origin (the page sends `max-age=60`)
- Serve stale content while revalidating: on

The page keeps polling for new speeches after it loads, so a page up to 60
seconds old affects only the first paint. The short TTL also limits the deploy
risk above.

### Rule 2 — anonymous `whoami`

Every page load calls `/api/.ory/sessions/whoami`. The origin forwards the
call to Ory Cloud. A visitor without a session gets the same answer every
time (today a 500), so this rule stores that answer. Without the rule, a
traffic peak of anonymous readers also reaches Ory Cloud and its rate limits.

Expression:

```
(http.request.uri.path eq "/api/.ory/sessions/whoami"
 and http.request.method eq "GET"
 and not http.cookie contains "ory_session_"
 and not any(lower(http.request.headers.names[*])[*] eq "x-session-token"))
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: ignore the origin header, 60 seconds. Status code TTL: `500` for
  60 seconds and `401` for 60 seconds. Cloudflare does not store these status
  codes without an explicit TTL.
- Browser TTL: respect the origin (the origin sends no header, so browsers do
  not store the answer)

### Rule 3 — anonymous reads polled by the debate page

Expression:

```
(http.request.method eq "GET"
 and (starts_with(http.request.uri.path, "/api/claim/")
      or starts_with(http.request.uri.path, "/api/personality/"))
 and not http.cookie contains "ory_session_"
 and not any(lower(http.request.headers.names[*])[*] eq "x-session-token"))
```

Settings:

- Cache eligibility: Eligible for cache
- Edge TTL: ignore the origin header, 10 seconds
- Browser TTL: respect the origin (these endpoints send `max-age=60`)
- Serve stale content while revalidating: on
- Cache key: default. The query string stays in the key, so `nameSpace` and
  `language` give separate entries.

With Tiered Cache, the origin gets about one request per URL every 10 seconds,
however many people watch. Error answers on these paths (for example a 400)
are also stored for 10 seconds.

### Pages without a rule

No other HTML page has a rule. Those pages show `DYNAMIC`. To cache more
pages, add their paths to a rule with the same conditions as Rule 1. Keep the
TTL short until the deploy pipeline purges the cache.

### Change or inspect the rules from the command line

The `cf` CLI can read and change the rules. With nodenv, it is installed in
Node 22.14.0, so prefix each command with `NODENV_VERSION=22.14.0`:

```bash
cf rulesets account-rulesets get 3cc722a11a1244b9af8af198dbcbafcc -z d18ad38c1d402090a9d26eb19cd09d4a
```

Validate a change before you save it. `--validate-only` checks the
expressions and saves nothing:

```bash
cf rulesets account-rulesets update 3cc722a11a1244b9af8af198dbcbafcc -z d18ad38c1d402090a9d26eb19cd09d4a --rules @rules.json --validate-only
```

## Rate limiting at the edge

The zone rate-limit rule `App rate limiting` (rule
`bda09dcef8a2416f86fd45ad362b163e` in ruleset
`1023c168a2884dcb840e83793e0266eb`) blocks an IP for 60 seconds after 1500
requests in 60 seconds. It counts each IP separately in each Cloudflare data
center.

Expression:

```
(starts_with(http.host, "aletheiafact.org")
 and not starts_with(http.request.uri.path, "/_next/static/"))
```

The rule counts every request that matches, including requests served from
the cache. Many mobile users in Brazil share one public IP through their
carrier. One page load can request about 60 JavaScript chunks. For these
reasons the static chunks are not counted, and the limit is 1500. Before this
change, the limit was 400 and the expression was
`(starts_with(http.host, "aletheiafact.org"))`.

The origin has its own limiter (`ClientIpThrottlerGuard`, see CLAUDE.md).

## Purge the cache after a deploy

The deploy pipeline does not purge the cache. Purge it by hand after each
production deploy. This removes cached HTML that names the old chunk URLs:

```bash
NODENV_VERSION=22.14.0 cf cache purge -z d18ad38c1d402090a9d26eb19cd09d4a --body '{"hosts":["aletheiafact.org","www.aletheiafact.org"]}' --force
```

Use the zone ID, not the domain name, with `-z`. The CLI puts the value
directly into the API path.

The same purge through the API:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"hosts":["aletheiafact.org","www.aletheiafact.org"]}'
```

The purge also removes the cached static assets. This costs little, because
the new build uses new file names.

## Roll back

To remove all three Cache Rules, delete the ruleset. The site then works as
before, without edge caching for HTML or the API:

```bash
NODENV_VERSION=22.14.0 cf rulesets account-rulesets delete 3cc722a11a1244b9af8af198dbcbafcc -z d18ad38c1d402090a9d26eb19cd09d4a
```

To restore the earlier rate limit (400 requests, every path):

```bash
NODENV_VERSION=22.14.0 cf rulesets account-rulesets rules update bda09dcef8a2416f86fd45ad362b163e \
  --ruleset-id 1023c168a2884dcb840e83793e0266eb -z d18ad38c1d402090a9d26eb19cd09d4a \
  --body '{"action":"block","description":"App rate limiting","enabled":true,"expression":"(starts_with(http.host, \"aletheiafact.org\"))","ratelimit":{"characteristics":["ip.src","cf.colo.id"],"mitigation_timeout":60,"period":60,"requests_per_period":400}}'
```

## How to check the result

Use `curl` and read `cf-cache-status`. Send each request two times. The second
answer must be a `HIT`:

```bash
curl -sS -o /dev/null -D - "https://aletheiafact.org/claim/<CLAIM_ID>/debate" | grep -Ei "cache-control|cf-cache-status|age"
```

A request that must skip the cache must never show `HIT`:

```bash
curl -sS -o /dev/null -D - -H "Cookie: default_language=en" "https://aletheiafact.org/claim/<CLAIM_ID>/debate" | grep -Ei "cf-cache-status"
```

```bash
curl -sS -o /dev/null -D - -H "Cookie: ory_session_test=1" "https://aletheiafact.org/api/claim/<CLAIM_ID>?nameSpace=main" | grep -Ei "cf-cache-status"
```

The values mean:

- `HIT` — Cloudflare served the response from cache. This is the target.
- `MISS` — Cloudflare stored the response for the next request.
- `REVALIDATED` — the edge TTL ended, and Cloudflare checked the copy with the
  origin.
- `EXPIRED` — the copy was too old, and Cloudflare fetched a new one.
- `DYNAMIC` — no rule made the request eligible for cache. A request that
  skips a rule (an `en` cookie or an Ory session) shows this.
