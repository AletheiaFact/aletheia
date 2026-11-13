Run or inspect database migrations. Mongo is the default; Postgres is the in-progress backend.

Argument: $ARGUMENTS
- `status` (default): show Mongo migration status.
- `up`: apply pending Mongo migrations.
- `down`: undo the last Mongo migration (destructive; confirm first).
- `create <name>`: create a new Mongo migration.
- `pg`, `pg:status`, `pg:create`: Postgres equivalents (`yarn migrate:pg`, `yarn migrate:pg:status`, `yarn migrate:pg:create`).

Steps:
1. Confirm `config.yaml` and `config/localConfig.ts` exist and MongoDB is reachable (`docker compose ps` if unsure).
2. Run the matching script: `yarn migrate:status`, `yarn migrate`, `yarn migrate:undo-last`, `yarn migrate:create <name>`, or the `pg` variants above.
3. For `up`, `down`, or `pg`, state the target database first and ask for confirmation unless the user already named it.
4. Do not hand-edit generated Postgres migrations or migration snapshots.
5. Before porting a Postgres module, read `docs/postgres-migration-foundation.md`.
6. Report the output and the resulting status.
