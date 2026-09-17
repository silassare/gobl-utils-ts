import GoblEntity from './GoblEntity.js';

export const GOBL_ENTITY_MARKER = '__gobl__';

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

				cache.set(cacheKey, e);
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
export function goblJSONReviver(_key: string, value: any): any {
	return toInstance(value, true) ?? value;
}

/**
 * `JSON.parse` that revives entities ({@link goblJSONReviver}), after the given reviver if any.
 */
export function parseGoblJSON(text: string, reviver?: (key: string, value: any) => any): any {
	return JSON.parse(text, function (key, value) {
		return goblJSONReviver(key, reviver ? reviver.call(this, key, value) : value);
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
