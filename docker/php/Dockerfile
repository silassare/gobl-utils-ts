# PHP for gobl-utils-ts's integration suite: runs Gobl's TypeScript generator (CSGeneratorTS) on a sample
# schema, so the tests use what Gobl really generates. SQLite only (built into the image): no server.
#
# Built by docker/compose.yaml; use it through the Makefile (`make test-integration`).

ARG PHP_VERSION=8.4

FROM php:${PHP_VERSION}-cli

RUN apt-get update \
	&& apt-get install -y --no-install-recommends git unzip \
	&& docker-php-ext-install -j"$(nproc)" bcmath \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN git config --system --add safe.directory '*' \
	&& mkdir -p /tmp/composer-cache /tmp/composer-home \
	&& chmod 1777 /tmp/composer-cache /tmp/composer-home

ENV HOME=/tmp \
	COMPOSER_CACHE_DIR=/tmp/composer-cache

WORKDIR /repos/gobl-utils-ts/tests/integration/generator
