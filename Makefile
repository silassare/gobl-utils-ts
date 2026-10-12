# Three tiers of verification, the cadence every repository of the suite follows:
#
#   make check                        every change: lint and types.
#   make test FILE=... FILTER=...     a feature is done: the tests that cover it.
#   make test test-integration        end of a cycle, and before anything is handed over.
#
# What each tier skips, and when skipping is wrong:
#
# - `check` is ESLint, reading its cache under .cache/ (keyed by file content and by its own
#   configuration), and `tsc`, reading the .tsbuildinfo it wrote there, which holds what it already
#   type-checked. It reads the generated entities too, so `make generate` has to have run once.
#   `make check-full` ignores both caches and is the run the cached one is checked against.
# - Both test targets take FILE (a path, or any part of one) and FILTER (a test name pattern). Both
#   suites run in seconds, and the floor under either is the container start, so narrowing buys focus
#   rather than time. `make test-integration GENERATE=no` reuses the entities of the last run instead
#   of regenerating them, which is wrong for a change to Gobl's templates or to the sample schema:
#   those are what generates them, so a change there has to be regenerated to be tested at all.
# - Both suites together are what says a change broke nothing elsewhere.
#
# The tiers are about re-running, never about writing: a feature's test is written with the feature.
# A failure in a narrowed run is repeated with the full target before it is believed or reported.
#
# Every target runs in Docker (docker/compose.yaml): the host only needs Docker and make.
#
# OZ_DEPS=local (default) resolves Gobl, for the integration suite, from the sibling checkouts
# (oliup-suite's `make clone`), working tree included; OZ_DEPS=remote from GitHub / Packagist.

.PHONY: docker-build install shell generate down test test-integration ci check check-full lint type-check build

export OZ_DEPS ?= local

DOCKER_COMPOSE = docker compose -f docker/compose.yaml

# The containers run as the host user, so the files they write stay the user's.
export OZ_UID := $(shell id -u)
export OZ_GID := $(shell id -g)

NODE = $(DOCKER_COMPOSE) run --rm node
PHP  = $(DOCKER_COMPOSE) run --rm php

# What narrows a test target to what a change touched: FILE is a path (or any part of one), FILTER a
# test name pattern (Vitest's -t).
NARROW = $(if $(FILTER),-t '$(FILTER)',) $(FILE)
# `check-full` sets this to `:full`, the script that ignores the ESLint cache.
FULL  ?=

# = Environment

## Build the images
docker-build:
	$(DOCKER_COMPOSE) build node php

## Install the pnpm dependencies, and Gobl for the integration suite
install:
	$(NODE) pnpm install --config.confirm-modules-purge=false
	$(PHP) composer update --no-interaction --no-progress

## Open a shell in the node container
shell:
	$(NODE) bash

## Stop and remove the containers and volumes (pnpm store and Composer cache included)
down:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans

# = Tests

## Run the unit test suite (FILE=tests/unit/entity.test.ts or FILTER='registers' narrows it)
test:
	$(NODE) pnpm test $(NARROW)

## Generate TypeScript entities with Gobl (tests/integration/generator/), then test the library against them
#
# FILE= and FILTER= narrow the run; GENERATE=no reuses the entities of the last run.
test-integration: $(if $(filter no,$(GENERATE)),,generate)
	$(NODE) pnpm test:integration $(NARROW)

## Run Gobl's TypeScript generator on the sample schema, into tests/integration/generated/ (git-ignored)
generate:
	$(PHP) php generate.php ../generated

## What CI runs: dependencies, lint with no cache, every suite, then types (the generated entities included)
ci: FULL := :full
ci: install lint test test-integration type-check

# = Code quality

## Lint and types: the gate for every change
#
# Both in one container, since starting one costs more here than either tool.
check:
	$(NODE) sh -c "pnpm lint$(FULL) && pnpm type-check$(FULL)"

## The same two with every cache ignored: what a handover and CI run
check-full: FULL := :full
check-full: check

## Lint
lint:
	$(NODE) pnpm lint$(FULL)

## Type-check the library and the tests (with the generated entities, after `make generate`)
type-check:
	$(NODE) pnpm type-check$(FULL)

