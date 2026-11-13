Run the test suite for Aletheia and report results.

Target: $ARGUMENTS (if empty, run the unit project).

Choose the command:
- No argument: `yarn test:unit`
- A file path (e.g. `server/claim/claim.service.spec.ts`): `yarn test <path>`
- `e2e`: `yarn test:e2e`
- `pg`: `yarn test:pg` (Postgres backend)
- `all`: `yarn test`
- `coverage`: `yarn test:coverage`

Steps:
1. Ensure `config/localConfig.ts` and `config.yaml` exist. If not, copy from the `.example` files and say so.
2. Run the command. If output is long, capture it and report only failing tests with their assertion messages.
3. If a test fails, read the test and the code under test before proposing a fix. Do not edit tests to make them pass without saying so.
4. Report: pass/fail counts, failing test names with error text quoted exactly, and the command used.
