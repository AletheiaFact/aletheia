Type-check and lint the project. Fix only when asked.

Argument: $ARGUMENTS (`fix` to auto-fix, otherwise check only).

Steps:
1. Run `yarn build-ts` (type check, same as `yarn lint` first half). Report errors with file:line.
2. Run `yarn lint:check` (ESLint). With `fix` in the argument, run `yarn lint:fix` instead.
3. If errors remain after fix, list them with file:line. Do not suppress rules with disable comments.
4. Report the exit status of each step.
