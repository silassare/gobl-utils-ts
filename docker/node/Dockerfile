# Node for gobl-utils-ts's tools and test suites, with pnpm at the version package.json pins.
#
# Built by docker/compose.yaml; use it through the Makefile (`make test`, `make lint`, `make shell`).

FROM node:24-bookworm-slim

ARG PNPM_VERSION=10.6.1

RUN npm install -g pnpm@${PNPM_VERSION} \
	&& mkdir -p /tmp/pnpm-store && chmod 1777 /tmp/pnpm-store

ENV HOME=/tmp \
	npm_config_store_dir=/tmp/pnpm-store

WORKDIR /repos/gobl-utils-ts
