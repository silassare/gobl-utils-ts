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
			// important: we remove the marker to keep only the columns as properties
			delete data[GOBL_ENTITY_MARKER];

			magicKey = makeEntityClassMagicKey(Object.keys(data));
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

const makeEntityClassMagicKey = (columns: string[]): string => {
	return columns.sort().join('|');
};

export function register(name: string, entity: typeof GoblEntity) {
	const columnsAsKey = makeEntityClassMagicKey((entity as any).COLUMNS);

	gobl[name] = entity;
	goblCache.set(name, new Map());
	goblClassMagicMap.set(columnsAsKey, name);
}

export function getEntityCache<T extends GoblEntity = GoblEntity>(
	entityName: string
) {
	return goblCache.get(entityName) as Map<string, T>;
}

export function _bool(v: any): boolean {
	return v === null || v === undefined ? v : Boolean(v === '0' ? 0 : v);
}

export function _int(v: any): number {
	return v === null || v === undefined ? v : parseInt(v);
}

export function _string(v: any): string {
	return v === null || v === undefined ? '' : String(v);
}
