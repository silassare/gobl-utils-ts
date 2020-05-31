const win = window;
export const gobl = (win.gobl = win.gobl || {}), goblMarker = '__gobl__', goblCache = (gobl.goblCache = gobl.goblCache || {}), goblClassMagicMap = (gobl.goblClassMagicMap = gobl.goblClassMagicMap || {}), 
/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param cache
 */
toInstance = function (data, cache = false) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        let entityName = data[goblMarker], entity, magic, old, e, cacheKey;
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
            // tslint:disable-next-line: no-conditional-assignment
            if (true === cache && (cacheKey = e.cacheKey())) {
                old = goblCache[entityName][cacheKey];
                if (old) {
                    e = old.doHydrate(data);
                }
                goblCache[entityName][cacheKey] = e;
            }
            return e;
        }
    }
    return undefined;
};
export const register = function (name, entity) {
    gobl[name] = entity;
    goblCache[name] = {};
    goblClassMagicMap[entity.COLUMNS.sort().join('')] = name;
};
export const getEntityCache = (entityName) => goblCache[entityName];
export const _bool = (v) => {
    // @ts-ignore
    return v === null || v === undefined ? v : Boolean(v === '0' ? 0 : v);
};
export const _int = (v) => {
    // @ts-ignore
    return v === null || v === undefined ? v : parseInt(v);
};
export const _string = (v) => {
    // @ts-ignore
    return v === null || v === undefined ? '' : String(v);
};
//# sourceMappingURL=gobl.js.map