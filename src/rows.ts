import type { GoblEntity } from './GoblEntity.js';

/**
 * The row of an entity: what the API sends and reads back, with the table's column prefix.
 *
 * An entity exposes its columns unprefixed (`name`), while a row carries them prefixed
 * (`file_name`), which is what a REST answer and a form submission hold. This derives the one from
 * the other instead of listing the columns a second time, so a column added, removed or retyped in
 * the schema reaches the row on the next generation with nothing to keep in step by hand.
 *
 * What is not a column is left out: the members of `GoblEntity` itself, and the helpers an entity
 * declares (`singlePKValue()`, `identifierColumns()`). Those are methods, and a column never is, so
 * they are excluded by shape rather than by name and a helper added later cannot leak into a row.
 */
export type GoblRowOf<E extends GoblEntity, P extends string> = {
	[K in Exclude<keyof E, keyof GoblEntity> & string as E[K] extends (
		(...args: never[]) => unknown
	) ?
		never
	:	`${P}_${K}`]: E[K];
};
