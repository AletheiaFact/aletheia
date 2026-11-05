Review the current changes for correctness, security, and project convention violations.

Scope: $ARGUMENTS (if empty, review `git diff` plus staged changes against `stage`).

Steps:
1. Run `git status` and `git diff stage...HEAD` (and `git diff` for unstaged work).
2. For every changed file, read it in full before judging it. For every changed function signature, grep its callers.
3. Check against CLAUDE.md:
   - Zod 4 validation on new `@Body`/`@Query`/`@Param` (no unvalidated input reaching Mongo filters).
   - `@Auth()`-family decorators on new routes; `@SkipThrottle()` only on public polled reads.
   - No secrets in code, logs, or client state.
   - Files stay under 1000 lines.
   - No em dashes in new code, comments, or docs.
4. Report findings as `path:line: severity: problem. fix.` ordered by severity. No praise, no summary of what is fine.
5. Do not edit files. Ask before applying fixes.
