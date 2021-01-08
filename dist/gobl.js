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
            if (cache && (cacheKey = e.cacheKey())) {
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
    return v === null || v === undefined ? v : Boolean(v === '0' ? 0 : v);
};
export const _int = (v) => {
    return v === null || v === undefined ? v : parseInt(v);
};
export const _string = (v) => {
    return v === null || v === undefined ? '' : String(v);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29ibC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9nb2JsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQztBQUN4QixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQ25ELFVBQVUsR0FBRyxVQUFVLEVBQ3ZCLFNBQVMsR0FFTCxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsRUFDM0MsaUJBQWlCLEdBRWIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsQ0FBQztBQUMzRDs7Ozs7R0FLRztBQUNILFVBQVUsR0FBRyxVQUNaLElBQW9CLEVBQ3BCLEtBQUssR0FBRyxLQUFLO0lBRWIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssaUJBQWlCLEVBQUU7UUFDL0QsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUNoQyxNQUFNLEVBQ04sS0FBSyxFQUNMLEdBQWUsRUFDZixDQUFhLEVBQ2IsUUFBUSxDQUFDO1FBRVYsSUFBSSxVQUFVLEVBQUU7WUFDZixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFCLCtCQUErQjtZQUMvQixpQ0FBaUM7WUFDakMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1osS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzFDLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUV0QyxJQUFJLFVBQVUsRUFBRTtnQkFDZixNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzFCO1NBQ0Q7UUFFRCxJQUFJLE1BQU0sRUFBRTtZQUNYLENBQUMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQixJQUFJLEtBQUssSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRTtnQkFDdkMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxHQUFHLEVBQUU7b0JBQ1IsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3hCO2dCQUVELFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7WUFFRCxPQUFPLENBQUMsQ0FBQztTQUNUO0tBQ0Q7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNsQixDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsVUFBVSxJQUFZLEVBQUUsTUFBeUI7SUFDeEUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztJQUNwQixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLGlCQUFpQixDQUFFLE1BQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ25FLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLFVBQWtCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU1RSxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFNLEVBQVcsRUFBRTtJQUN4QyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFNLEVBQVUsRUFBRTtJQUN0QyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBTSxFQUFVLEVBQUU7SUFDekMsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHb2JsRW50aXR5LCB7IEdvYmxFbnRpdHlEYXRhIH0gZnJvbSAnLi9Hb2JsRW50aXR5JztcblxuY29uc3Qgd2luOiBhbnkgPSB3aW5kb3c7XG5leHBvcnQgY29uc3QgZ29ibDogYW55ID0gKHdpbi5nb2JsID0gd2luLmdvYmwgfHwge30pLFxuXHRnb2JsTWFya2VyID0gJ19fZ29ibF9fJyxcblx0Z29ibENhY2hlOiB7XG5cdFx0W2VudGl0eTogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBHb2JsRW50aXR5IH07XG5cdH0gPSAoZ29ibC5nb2JsQ2FjaGUgPSBnb2JsLmdvYmxDYWNoZSB8fCB7fSksXG5cdGdvYmxDbGFzc01hZ2ljTWFwOiB7XG5cdFx0W2tleTogc3RyaW5nXTogc3RyaW5nO1xuXHR9ID0gKGdvYmwuZ29ibENsYXNzTWFnaWNNYXAgPSBnb2JsLmdvYmxDbGFzc01hZ2ljTWFwIHx8IHt9KSxcblx0LyoqXG5cdCAqIFRyeSB0byBpZGVudGlmeSBhbmQgaW5zdGFudGlhdGUgdGhlIGVudGl0eSBjbGFzcyB0aGF0IGJlc3QgbWF0Y2hlcyB0aGUgZ2l2ZW4gZGF0YS5cblx0ICpcblx0ICogQHBhcmFtIGRhdGFcblx0ICogQHBhcmFtIGNhY2hlXG5cdCAqL1xuXHR0b0luc3RhbmNlID0gZnVuY3Rpb24gKFxuXHRcdGRhdGE6IEdvYmxFbnRpdHlEYXRhLFxuXHRcdGNhY2hlID0gZmFsc2UsXG5cdCk6IEdvYmxFbnRpdHkgfCB1bmRlZmluZWQge1xuXHRcdGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZGF0YSkgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG5cdFx0XHRsZXQgZW50aXR5TmFtZSA9IGRhdGFbZ29ibE1hcmtlcl0sXG5cdFx0XHRcdGVudGl0eSxcblx0XHRcdFx0bWFnaWMsXG5cdFx0XHRcdG9sZDogR29ibEVudGl0eSxcblx0XHRcdFx0ZTogR29ibEVudGl0eSxcblx0XHRcdFx0Y2FjaGVLZXk7XG5cblx0XHRcdGlmIChlbnRpdHlOYW1lKSB7XG5cdFx0XHRcdGVudGl0eSA9IGdvYmxbZW50aXR5TmFtZV07XG5cdFx0XHRcdC8vIG1heWJlIHRoZSBlbnRpdHkgbmFtZSBjaGFuZ2Vcblx0XHRcdFx0Ly8gdGhpcyBpcyB0byBoYXZlIGEgY2xlYW4gb2JqZWN0XG5cdFx0XHRcdGRlbGV0ZSBkYXRhW2dvYmxNYXJrZXJdO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWVudGl0eSkge1xuXHRcdFx0XHRtYWdpYyA9IE9iamVjdC5rZXlzKGRhdGEpLnNvcnQoKS5qb2luKCcnKTtcblx0XHRcdFx0ZW50aXR5TmFtZSA9IGdvYmxDbGFzc01hZ2ljTWFwW21hZ2ljXTtcblxuXHRcdFx0XHRpZiAoZW50aXR5TmFtZSkge1xuXHRcdFx0XHRcdGVudGl0eSA9IGdvYmxbZW50aXR5TmFtZV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKGVudGl0eSkge1xuXHRcdFx0XHRlID0gbmV3IGVudGl0eShkYXRhKTtcblx0XHRcdFx0aWYgKGNhY2hlICYmIChjYWNoZUtleSA9IGUuY2FjaGVLZXkoKSkpIHtcblx0XHRcdFx0XHRvbGQgPSBnb2JsQ2FjaGVbZW50aXR5TmFtZV1bY2FjaGVLZXldO1xuXHRcdFx0XHRcdGlmIChvbGQpIHtcblx0XHRcdFx0XHRcdGUgPSBvbGQuZG9IeWRyYXRlKGRhdGEpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGdvYmxDYWNoZVtlbnRpdHlOYW1lXVtjYWNoZUtleV0gPSBlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0fTtcblxuZXhwb3J0IGNvbnN0IHJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWU6IHN0cmluZywgZW50aXR5OiB0eXBlb2YgR29ibEVudGl0eSkge1xuXHRnb2JsW25hbWVdID0gZW50aXR5O1xuXHRnb2JsQ2FjaGVbbmFtZV0gPSB7fTtcblx0Z29ibENsYXNzTWFnaWNNYXBbKGVudGl0eSBhcyBhbnkpLkNPTFVNTlMuc29ydCgpLmpvaW4oJycpXSA9IG5hbWU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0RW50aXR5Q2FjaGUgPSAoZW50aXR5TmFtZTogc3RyaW5nKSA9PiBnb2JsQ2FjaGVbZW50aXR5TmFtZV07XG5cbmV4cG9ydCBjb25zdCBfYm9vbCA9ICh2OiBhbnkpOiBib29sZWFuID0+IHtcblx0cmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkID8gdiA6IEJvb2xlYW4odiA9PT0gJzAnID8gMCA6IHYpO1xufTtcblxuZXhwb3J0IGNvbnN0IF9pbnQgPSAodjogYW55KTogbnVtYmVyID0+IHtcblx0cmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkID8gdiA6IHBhcnNlSW50KHYpO1xufTtcblxuZXhwb3J0IGNvbnN0IF9zdHJpbmcgPSAodjogYW55KTogc3RyaW5nID0+IHtcblx0cmV0dXJuIHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcodik7XG59O1xuIl19