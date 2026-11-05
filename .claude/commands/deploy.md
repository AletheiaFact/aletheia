Prepare and ship a deploy through the CI pipeline. Production deploys are outward-facing: confirm before any push.

Target: $ARGUMENTS (default branch `stage`; `master` is production).

Pipeline facts (from `.github/workflows/aws.yml`):
- Push to `master`, `stage`, or `ufpb-labcheck` triggers build, ECR publish, then `kubectl apply -f ./deployment/` on EKS cluster `production`.
- Rollout is checked with `kubectl rollout status`; failure triggers `kubectl rollout undo`.
- Do not run `kubectl apply` locally unless the user asks.

Steps:
1. Run `/lint` checks: `yarn build-ts` and `yarn lint:check`. Stop on failure.
2. Run `yarn test:unit`. Stop on failure.
3. Run `git status` and `git log <target>..HEAD --oneline`. Show the user the commits that will ship.
4. Check whether `migrations/` or `migrations-postgres/` have new files. If so, state that migrations run on deploy and ask for confirmation.
5. Ask the user to confirm the target branch and the commit list. Do not push without a yes.
6. On confirmation: `git push origin <branch>` and report the GitHub Actions run URL via `gh run list --branch <branch> --limit 1`.
7. Report the final status. If the rollout fails, say so and show the rollback that CI ran.
