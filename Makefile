# Every target runs in Docker (docker/compose.yaml): the host only needs Docker and make.
#
# OZ_DEPS=local (default) resolves Gobl, for the integration suite, from the sibling checkouts
# (oliup-suite's `make clone`), working tree included; OZ_DEPS=remote from GitHub / Packagist.

.PHONY: docker-build install shell generate down test test-integration ci lint type-check build

export OZ_DEPS ?= local

DOCKER_COMPOSE = docker compose -f docker/compose.yaml

# The containers run as the host user, so the files they write stay the user's.
export OZ_UID := $(shell id -u)
export OZ_GID := $(shell id -g)

NODE = $(DOCKER_COMPOSE) run --rm node
PHP  = $(DOCKER_COMPOSE) run --rm php

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

## Run the unit test suite
test:
	$(NODE) pnpm test

## Generate TypeScript entities with Gobl (tests/integration/generator/), then test the library against them
test-integration: generate
	$(NODE) pnpm test:integration

## Run Gobl's TypeScript generator on the sample schema, into tests/integration/generated/ (git-ignored)
generate:
	$(PHP) php generate.php ../generated

## What CI runs: dependencies, lint, every suite, then types (the generated entities included)
ci: install lint test test-integration type-check

# = Code quality

## Lint
lint:
	$(NODE) pnpm lint

## Type-check the library and the tests (with the generated entities, after `make generate`)
type-check:
	$(NODE) pnpm type-check

