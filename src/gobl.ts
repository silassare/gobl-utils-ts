import GoblEntity, { type GoblEntityData } from './GoblEntity.js';

const win: any = window;
export const gobl: any = (win.gobl = win.gobl || {}),
	goblMarker = '__gobl__',
	goblCache: {
		[entity: string]: { [key: string]: GoblEntity };
	} = (gobl.goblCache = gobl.goblCache || {}),
	goblClassMagicMap: {
		[key: string]: string;
	} = (gobl.goblClassMagicMap = gobl.goblClassMagicMap || {}),
	/**
	 * Try to identify and instantiate the entity class that best matches the given data.
	 *
	 * @param data
	 * @param cache
	 */
	toInstance = function <T extends GoblEntity = GoblEntity>(
		data: GoblEntityData,
		cache = false
	): T | undefined {
		if (Object.prototype.toString.call(data) === '[object Object]') {
			let entityName = data[goblMarker],
				entity,
				magic,
				old: GoblEntity,
				e: GoblEntity,
				cacheKey;

			if (entityName) {
				entity = gobl[entityName];
				// maybe the entity name change
				// this is to have a clean object
				delete data[goblMarker];
			}

			if (!entity) {
				magic = Object.keys(data).sort().join('');
				entityName = goblClassMagicMap[magic];

				if (entityName) {
					entity = gobl[entityName];
				}
			}

			if (entity) {
				e = new entity(data);
				if (cache && (cacheKey = e.cacheKey())) {
					old = goblCache[entityName][cacheKey];
					if (old) {
						e = old.doHydrate(data);
					}

					goblCache[entityName][cacheKey] = e;
				}

				return e as T;
			}
		}

		return undefined;
	};

export const register = function (name: string, entity: typeof GoblEntity) {
	gobl[name] = entity;
	goblCache[name] = {};
	goblClassMagicMap[(entity as any).COLUMNS.sort().join('')] = name;
};

export const getEntityCache = (entityName: string) => goblCache[entityName];

export const _bool = (v: any): boolean => {
	return v === null || v === undefined ? v : Boolean(v === '0' ? 0 : v);
};

export const _int = (v: any): number => {
	return v === null || v === undefined ? v : parseInt(v);
};

export const _string = (v: any): string => {
	return v === null || v === undefined ? '' : String(v);
};
