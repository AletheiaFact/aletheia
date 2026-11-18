# Fix open Dependabot alerts (227 alerts, 66 packages)

## Context
`gh api "repos/aletheiafact/aletheia/dependabot/alerts?state=open&per_page=100" --paginate` returns 227 open alerts, all from `yarn.lock` (Yarn 3.6.3). Most are not from our direct pins but from stale duplicate copies in the lockfile, outdated `resolutions` in `package.json`, and old framework majors (NestJS 9, next-i18next 10). Goal: close everything that has a fix, and dismiss the rest with a written reason. Work is split into 5 PRs, cheapest and highest-yield first.

Baseline snapshot (re-run before each PR):
```sh
gh api --paginate "repos/aletheiafact/aletheia/dependabot/alerts?state=open&per_page=100" \
  | jq -s -r 'add | group_by(.security_vulnerability.package.name)[] | "\(length)\t\(.[0].security_vulnerability.package.name)"' | sort -rn
```

## PR 1 - `chore/deps-lockfile-refresh` (lockfile only)
No `package.json` dependency changes, only `yarn.lock`.
- `next` (35 alerts, includes critical RCE): direct pin is `15.5.28` (patched), but `next@npm:>=12.0.10` (peer of `@ory/client` / `@ory/integrations`) resolves to stale `15.5.2`. Run `yarn dedupe next`.
- `axios` (34): direct `1.20.0`, but `@ory/client`, `@novu/*` get `1.11.0` and `wait-on` gets `1.13.4`. Run `yarn up -R axios`.
- `yarn up -R` for in-range transitive fixes: form-data, minimatch, js-yaml, picomatch, postcss, qs, fast-xml-parser, fast-uri, hono, @hono/node-server, langsmith, validator, uuid, yaml, ajv, cookie, diff, tmp, jws, defu, js-cookie, engine.io, file-type, yauzl, prismjs, zod, sharp, @babel/core, @babel/plugin-transform-modules-systemjs, @ai-sdk/provider-utils, min-document, tough-cookie.
- Finish with `yarn dedupe` and diff `yarn.lock` for unexpected major jumps.

## PR 2 - `chore/deps-resolutions-refresh`
Current `resolutions` pin vulnerable versions and block fixes:

| resolution | now | target |
|---|---|---|
| `tar` | 6.2.1 | >= 7.5.21 (major: check `node-gyp`, `cacache`, `giget`) |
| `ws` | 8.17.1 | >= 8.21.0 |
| `follow-redirects` | 1.15.6 | >= 1.16.0 |
| `webpack-dev-middleware` | 6.1.3 | >= 7.4.6 (or drop if parents allow) |
| `ip` | 1.1.9 | no fix: drop pin, check who still needs `ip` |
| `glob` | ^9.0.0 | >= 14.0.2 or drop |

- For each, first try removing the resolution and run `yarn why <pkg>`. Keep a pin only if a parent's range still resolves to a vulnerable version.
- Add new resolutions only where the parent range blocks the fix: `serialize-javascript` (terser-webpack-plugin wants ^6, fix is 7.x), `lodash` / `lodash-es` (4.18.0).
- Remove pins that are no longer needed (`braces`, `ejs`, `es5-ext`, `@grpc/grpc-js`, check each with `yarn why`).

## PR 3 - `chore/deps-tooling-upgrades`
- `@compodoc/compodoc` pinned at `1.1.21` (listed in both deps and devDependencies, `package.json:80,281`): brings `pdfjs-dist@2.12.313` (high, JS execution) and old lodash. Upgrade to latest and keep it only in devDependencies, or remove it with the `compodoc` script if docs are unused.
- `next-i18next` `^10.2.0`: brings `i18next-fs-backend@1.2.0` (critical prototype pollution). Upgrade to a version with `i18next-fs-backend >= 2.6.6`, follow its migration notes (config, `serverSideTranslations` usage), and check pt/en pages.
- `@nestjs/cli` `9.1.5`: brings `webpack@5.74.0` (critical). Can move with PR 5 if the new CLI needs Nest 10+.
- Storybook `^7.4.5`: check whether it brings `esbuild <= 0.24.2` / `ws`, and upgrade if needed.
- `moment` `^2.30.1`: bump to `>= 2.31.0`.

## PR 4 - `refactor/s3-aws-sdk-v3`
- `aws-sdk` v2 is end of life and the alert has no fix. Only user: `server/file-management/file-management.service.ts`.
- Move to `@aws-sdk/client-s3` (+ `@aws-sdk/lib-storage` / `s3-request-presigner` if uploads or presigned URLs are used), then remove `aws-sdk`.
- Keep LocalStack/MinIO support (`forcePathStyle`, custom `endpoint`).

## PR 5 - `chore/nestjs-11-upgrade` (largest, needs its own detailed plan)
- Nest packages are mixed today: `@nestjs/core` / `platform-express` / `platform-ws` / `testing` ^9, `@nestjs/common` 10.4.22, `@nestjs/websockets` ^10.
- `@nestjs/core <= 11.1.17` has its own alert. `platform-express@9` brings `multer@1.4.4-lts.1` (11 alerts), `express@4.18`, `body-parser`, `path-to-regexp@0.1.7/3.2.0`, `send`, `serve-static`.
- Move all `@nestjs/*` to 11 together (`mongoose` 11, `config` 4, `schedule` 5, `throttler` 6, `swagger` 11, `jwt` 11, `cli`/`schematics` 11), plus check `nestjs-unleash` compatibility.
- Express 5 route syntax changes (`*` wildcards, optional params like `:namespace?`) affect every controller with an optional namespace prefix. Audit those first.

## PR 6 - dismiss leftovers
Alerts with no fix, or dev/build-only with no runtime exposure. Dismiss after user confirmation, with a reason:
- `request` (no fix, find the parent with `yarn why request`, replace if runtime)
- `extract-zip`, `elliptic`, `deepmerge`, `ip` (no fix)
- dev-only: `flatted`, `tar-fs`, `@vitest/mocker` (or bump vitest >= 4.1.12)

```sh
gh api -X PATCH repos/aletheiafact/aletheia/dependabot/alerts/<n> \
  -f state=dismissed -f dismissed_reason=no_bandwidth|tolerable_risk|inaccurate|not_used \
  -f dismissed_comment="<reason>"
```

## Process
- One branch and PR per item, from `stage`, Conventional Commits, merge in order 1 -> 6.
- Each PR description lists which alert numbers it should close; after merge, re-run the baseline query and confirm.
- Coordinate with dependabatch (`d7b59a58`) so the batch bot does not open conflicting bumps during PR 1-2.

## Verification (each PR)
- `yarn install --immutable` passes in CI after lockfile change.
- `yarn lint`, type-check, server Vitest suite, `yarn build` (Next + Nest).
- Smoke test in `yarn dev`: login (Ory), claim page, review task editor (collaborative WS), file upload to LocalStack (PR 4), pt/en switch (PR 3).
- PR 5: full Cypress e2e run, plus routes with and without `:namespace` prefix.
