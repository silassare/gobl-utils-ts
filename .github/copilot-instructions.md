# gobl-utils-ts — Agent Instructions

> `CLAUDE.md` and `AGENTS.md` are symlinks to this file. The cross-repository rules, decisions and plan
> are in `oliup-suite` (`CLAUDE.md`, `DECISIONS.md`, `OWEB_PLAN.md`): read them first.

The TypeScript runtime of the entities Gobl generates (`gobl/src/ORM/Generators/CSGeneratorTS.php`,
templates in `gobl/assets/ts/`): the generated classes extend `GoblEntity` and register themselves with
`register()`. **Gobl's templates and this package are one contract**: a change on one side is checked on
the other, and released together.

---

## IMPORTANT

- **No hallucination or invention.** Read the actual code, here and in Gobl's templates, before writing.
- **When a bug or issue is found, do not fix it directly**: report it and ask for approval first.
- **No feature change without explicit approval.** Commits, pushes and tags are the owner's.
- **Keep this file current, and small**: rules and what the code does not say.
- No Unicode shortcut characters in comments (`->` not an arrow). Tabs.
- See `README.md` for the naming rule that keeps entity members apart from generated column accessors.

---

## Tests

Everything runs through `make`, in Docker (`##` comments in the `Makefile`); the host needs Docker, `make`,
and the first-party siblings cloned next to this repository (oliup-suite's `make clone`).

- **Unit** (`make test`, `tests/unit/`): entities written the way the generator writes them.
- **Integration** (`make test-integration`, `tests/integration/`): `make generate` runs Gobl's real
  generator (PHP container, `tests/integration/generator/generate.php`, a sample schema on in-memory
  SQLite) into `tests/integration/generated/` (git-ignored), then the suite and `make type-check` use
  those files. `OZ_DEPS=local` (default) takes Gobl from the sibling checkout, working tree included;
  `remote` from GitHub / Packagist. The Gobl database is locked before generating, as OZone does.
- `make type-check` uses `tsconfig.test.json` (sources, tests and generated entities); `tsconfig.json`
  and `tsconfig.cjs.json` build `dist/` and `types/`, which are versioned for consumers of a tag.
