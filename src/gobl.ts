import type { GoblEntity } from './GoblEntity.js';

export const GOBL_ENTITY_MARKER = '__gobl__';

/**
 * How many entities of one class the identity cache keeps, least recently used evicted first.
 *
 * The cache is on `window` and lives as long as the page: without a bound it held every row the
 * application had ever revived, and nothing ever deleted an entry. A bound also keeps a stale read
 * from outliving a long session -- a cached instance is merged with `doHydrate()`, so a column the
 * server stopped sending kept its old value for as long as the entry lived.
 */
export const GOBL_CACHE_MAX_ENTRIES_PER_ENTITY = 500;

export type GoblEntityData = {
	[key in typeof GOBL_ENTITY_MARKER]?: string;
} & {
	[key: string]: any;
};

const win: any = typeof window !== 'undefined' ? window : globalThis;
const gobl: any = (win.gobl = win.gobl || {}),
	goblCache: Map<string, Map<string, GoblEntity>> = (gobl.goblCache =
		gobl.goblCache || new Map()),
	goblClassMagicMap: Map<string, string> = (gobl.goblClassMagicMap =
		gobl.goblClassMagicMap || new Map());

/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param includeCache
 */
export const toInstance = function <T extends GoblEntity = GoblEntity>(
	data: GoblEntityData,
	addToCache = false
): T | undefined {
	if (Object.prototype.toString.call(data) === '[object Object]') {
		let entityName: string | undefined = data[GOBL_ENTITY_MARKER],
			entityCtor,
			magicKey,
			old: T | undefined,
			e: T,
			cacheKey;

		if (entityName) {
			entityCtor = gobl[entityName];
		}

		if (!entityCtor) {
			// the columns only, without the marker: the caller's data is left untouched
			magicKey = makeEntityClassMagicKey(
				Object.keys(data).filter((key) => key !== GOBL_ENTITY_MARKER)
			);
			entityName = goblClassMagicMap.get(magicKey);

			if (entityName) {
				entityCtor = gobl[entityName];
			}
		}

		if (entityCtor) {
			e = new entityCtor(data);
			const cache =
				addToCache && entityName ? getEntityCache<T>(entityName) : null;

			if (cache && (cacheKey = e.cacheKey())) {
				old = cache.get(cacheKey);
				if (old) {
					e = old.doHydrate(data);
				}

				// Re-inserted rather than updated in place: a Map keeps insertion order, so
				// deleting and setting makes this the most recently used and the eviction below
				// takes the oldest. The cache lives on `window`, so without a bound an application
				// paging through a list kept every row it had ever seen -- 50 rows a page, a
				// thousand pages, 50 000 live entities no view references.
				cache.delete(cacheKey);
				cache.set(cacheKey, e);

				while (cache.size > GOBL_CACHE_MAX_ENTRIES_PER_ENTITY) {
					const oldest = cache.keys().next();

					if (oldest.done) {
						break;
					}

					cache.delete(oldest.value);
				}
			}

			return e as T;
		}
	}

	return undefined;
};

const makeEntityClassMagicKey = (columns: readonly string[]): string => {
	// sorts a copy: the columns may be an entity class's own COLUMNS
	return [...columns].sort().join('|');
};

export function register(name: string, entity: typeof GoblEntity) {
	const columnsAsKey = makeEntityClassMagicKey((entity as any).COLUMNS);

	gobl[name] = entity;
	goblCache.set(name, new Map());
	goblClassMagicMap.set(columnsAsKey, name);
}

/**
 * A reviver for `JSON.parse` that turns serialized entities (with the marker, or recognized from their
 * columns) into instances of the registered entity classes, cached.
 */
export function goblJSONReviver(
	_key: string,
	value: any,
	addToCache = true
): any {
	return toInstance(value, addToCache) ?? value;
}

/**
 * `JSON.parse` that revives entities ({@link goblJSONReviver}), after the given reviver if any.
 */
export function parseGoblJSON(
	text: string,
	reviver?: (key: string, value: any) => any,
	addToCache = true
): any {
	return JSON.parse(text, function (key, value) {
		return goblJSONReviver(
			key,
			reviver ? reviver.call(this, key, value) : value,
			addToCache
		);
	});
}

export function getEntityCache<T extends GoblEntity = GoblEntity>(
	entityName: string
) {
	return goblCache.get(entityName) as Map<string, T> | undefined;
}

export function _bool(v: any): boolean | null {
	return v === null || v === undefined ? null : Boolean(v === '0' ? 0 : v);
}

export function _int(v: any): number | null {
	if (v === null || v === undefined) {
		return null;
	}

	const n = parseInt(v, 10);

	return Number.isNaN(n) ? null : n;
}

export function _string(v: any): string {
	return v === null || v === undefined ? '' : String(v);
}
