# `aletheia` CLI

From the repository root, install the command and check it:

```sh
./aletheia
aletheia
```

The first run links the [script](../aletheia) in `~/.local/bin` (or `~/bin`) and prints its path and version. Later runs print only the version. If that directory is missing from `PATH`, the first run warns you.

Requires Bash, Docker Compose, `curl`, `jq`, `lsof`, and Yarn. Configure `.env`, `config.yaml`, `config.seed.yaml`, and `migrate-mongo-config.ts` for your environment. `--install` creates `.env` and `config/localConfig.ts` from their examples if missing.

## Commands and flags

| Command | Aliases | Action |
| --- | --- | --- |
| No arguments | | Print the version. |
| `--version` | `-v`, `version` | Print the version and exit. |
| `--install` | `-i`, `install` | Start and wait for services; run `yarn install`, `yarn migrate`, and `yarn seed`. Seed failure is nonfatal. Does not start the app. |
| `--run` | `-r`, `-s`, `--start`, `run`, `start` | Start services, then run `yarn dev` in the foreground. Does not wait for readiness. |
| `--up` | `-u`, `up` | Start services and wait for MongoDB, Kratos, Hydra, and LocalStack. Does not start the app. |
| `--seed` | `seed` | Start and wait for services, then run `yarn seed`. |
| `--down` | `-d`, `--stop`, `down`, `stop` | Stop dev watchers, free ports 3000/6006, and stop Compose. Keep images and data. |
| `--force` | `-f`, `force`, `--fresh`, `fresh` | Reset local data before `install` or `seed` only. See [Reset](#reset). |
| `--quiet` | `-q`, `quiet`, `--silent`, `silent` | Hide successful Docker/Yarn output; show the last 40 lines on failure. With `run`, start `yarn dev` in the background. |
| `--help` | `-h` | Print help and exit. |

## Combined examples

```sh
aletheia -i -f -r       # Reset, install, then run in foreground
aletheia -i -r -q       # Install, then run in background
aletheia --seed -f -q   # Reset, migrate, and seed quietly
aletheia -u -q          # Start services and wait quietly
aletheia -d -q          # Stop quietly
```

`install` can combine with `run` and `force`; `seed` can combine with `force`. `quiet` works with any command. `up`, `down`, and `seed` cannot combine with other commands. `force` without `install` or `seed` is rejected. Flags can appear in any order, except `--help` and `--version` exit immediately.

Background run logs to `${XDG_STATE_HOME:-$HOME/.local/state}/aletheia/dev.log`; stop it with `aletheia down`.

## Reset

Both `--install --force` and `--seed --force` clear local MongoDB, Postgres/DocumentDB, and LocalStack data, remove Compose volumes, then migrate and seed. Force install also removes `dist`, `.next`, and Compose images before reinstalling packages. Force seed stops dev watchers and does not reinstall packages or start the app. Check `DATA_PATH` and `DATA_DIR` (environment or `.env`) before resetting; local configuration files remain.
