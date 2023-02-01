"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._string = exports._int = exports._bool = exports.getEntityCache = exports.register = exports.toInstance = exports.goblClassMagicMap = exports.goblCache = exports.goblMarker = exports.gobl = void 0;
const win = window;
const 
/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param cache
 */
toInstance = function (data, cache = false) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        let entityName = data[exports.goblMarker], entity, magic, old, e, cacheKey;
        if (entityName) {
            entity = exports.gobl[entityName];
            // maybe the entity name change
            // this is to have a clean object
            delete data[exports.goblMarker];
        }
        if (!entity) {
            magic = Object.keys(data).sort().join('');
            entityName = exports.goblClassMagicMap[magic];
            if (entityName) {
                entity = exports.gobl[entityName];
            }
        }
        if (entity) {
            e = new entity(data);
            if (cache && (cacheKey = e.cacheKey())) {
                old = exports.goblCache[entityName][cacheKey];
                if (old) {
                    e = old.doHydrate(data);
                }
                exports.goblCache[entityName][cacheKey] = e;
            }
            return e;
        }
    }
    return undefined;
};
exports.gobl = (win.gobl = win.gobl || {}), exports.goblMarker = '__gobl__', exports.goblCache = (exports.gobl.goblCache = exports.gobl.goblCache || {}), exports.goblClassMagicMap = (exports.gobl.goblClassMagicMap = exports.gobl.goblClassMagicMap || {}), 
/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param cache
 */
exports.toInstance = toInstance;
const register = function (name, entity) {
    exports.gobl[name] = entity;
    exports.goblCache[name] = {};
    exports.goblClassMagicMap[entity.COLUMNS.sort().join('')] = name;
};
exports.register = register;
const getEntityCache = (entityName) => exports.goblCache[entityName];
exports.getEntityCache = getEntityCache;
const _bool = (v) => {
    return v === null || v === undefined ? v : Boolean(v === '0' ? 0 : v);
};
exports._bool = _bool;
const _int = (v) => {
    return v === null || v === undefined ? v : parseInt(v);
};
exports._int = _int;
const _string = (v) => {
    return v === null || v === undefined ? '' : String(v);
};
exports._string = _string;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29ibC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9nb2JsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQU0sR0FBRyxHQUFRLE1BQU0sQ0FBQztBQUNqQjtBQVFOOzs7OztHQUtHO0FBQ0gsVUFBVSxHQUFHLFVBQ1osSUFBb0IsRUFDcEIsS0FBSyxHQUFHLEtBQUs7SUFFYixJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxpQkFBaUIsRUFBRTtRQUMvRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxFQUNoQyxNQUFNLEVBQ04sS0FBSyxFQUNMLEdBQWUsRUFDZixDQUFhLEVBQ2IsUUFBUSxDQUFDO1FBRVYsSUFBSSxVQUFVLEVBQUU7WUFDZixNQUFNLEdBQUcsWUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzFCLCtCQUErQjtZQUMvQixpQ0FBaUM7WUFDakMsT0FBTyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNaLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMxQyxVQUFVLEdBQUcseUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFdEMsSUFBSSxVQUFVLEVBQUU7Z0JBQ2YsTUFBTSxHQUFHLFlBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMxQjtTQUNEO1FBRUQsSUFBSSxNQUFNLEVBQUU7WUFDWCxDQUFDLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckIsSUFBSSxLQUFLLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7Z0JBQ3ZDLEdBQUcsR0FBRyxpQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLEdBQUcsRUFBRTtvQkFDUixDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEI7Z0JBRUQsaUJBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7WUFFRCxPQUFPLENBQUMsQ0FBQztTQUNUO0tBQ0Q7SUFFRCxPQUFPLFNBQVMsQ0FBQztBQUNsQixDQUFDLENBQUM7QUExRFUsUUFBQSxJQUFJLEdBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQ25ELFFBQUEsVUFBVSxHQUFHLFVBQVUsRUFDdkIsUUFBQSxTQUFTLEdBRUwsQ0FBQyxZQUFJLENBQUMsU0FBUyxHQUFHLFlBQUksQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLEVBQzNDLFFBQUEsaUJBQWlCLEdBRWIsQ0FBQyxZQUFJLENBQUMsaUJBQWlCLEdBQUcsWUFBSSxDQUFDLGlCQUFpQixJQUFJLEVBQUUsQ0FBQztBQUMzRDs7Ozs7R0FLRztBQUNILFFBQUEsVUFBVSxjQTRDUjtBQUVJLE1BQU0sUUFBUSxHQUFHLFVBQVUsSUFBWSxFQUFFLE1BQXlCO0lBQ3hFLFlBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDcEIsaUJBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDckIseUJBQWlCLENBQUUsTUFBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDbkUsQ0FBQyxDQUFDO0FBSlcsUUFBQSxRQUFRLFlBSW5CO0FBRUssTUFBTSxjQUFjLEdBQUcsQ0FBQyxVQUFrQixFQUFFLEVBQUUsQ0FBQyxpQkFBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQS9ELFFBQUEsY0FBYyxrQkFBaUQ7QUFFckUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFNLEVBQVcsRUFBRTtJQUN4QyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUM7QUFGVyxRQUFBLEtBQUssU0FFaEI7QUFFSyxNQUFNLElBQUksR0FBRyxDQUFDLENBQU0sRUFBVSxFQUFFO0lBQ3RDLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUM7QUFGVyxRQUFBLElBQUksUUFFZjtBQUVLLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBTSxFQUFVLEVBQUU7SUFDekMsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUMsQ0FBQztBQUZXLFFBQUEsT0FBTyxXQUVsQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHb2JsRW50aXR5LCB7IEdvYmxFbnRpdHlEYXRhIH0gZnJvbSAnLi9Hb2JsRW50aXR5LmpzJztcblxuY29uc3Qgd2luOiBhbnkgPSB3aW5kb3c7XG5leHBvcnQgY29uc3QgZ29ibDogYW55ID0gKHdpbi5nb2JsID0gd2luLmdvYmwgfHwge30pLFxuXHRnb2JsTWFya2VyID0gJ19fZ29ibF9fJyxcblx0Z29ibENhY2hlOiB7XG5cdFx0W2VudGl0eTogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBHb2JsRW50aXR5IH07XG5cdH0gPSAoZ29ibC5nb2JsQ2FjaGUgPSBnb2JsLmdvYmxDYWNoZSB8fCB7fSksXG5cdGdvYmxDbGFzc01hZ2ljTWFwOiB7XG5cdFx0W2tleTogc3RyaW5nXTogc3RyaW5nO1xuXHR9ID0gKGdvYmwuZ29ibENsYXNzTWFnaWNNYXAgPSBnb2JsLmdvYmxDbGFzc01hZ2ljTWFwIHx8IHt9KSxcblx0LyoqXG5cdCAqIFRyeSB0byBpZGVudGlmeSBhbmQgaW5zdGFudGlhdGUgdGhlIGVudGl0eSBjbGFzcyB0aGF0IGJlc3QgbWF0Y2hlcyB0aGUgZ2l2ZW4gZGF0YS5cblx0ICpcblx0ICogQHBhcmFtIGRhdGFcblx0ICogQHBhcmFtIGNhY2hlXG5cdCAqL1xuXHR0b0luc3RhbmNlID0gZnVuY3Rpb24gKFxuXHRcdGRhdGE6IEdvYmxFbnRpdHlEYXRhLFxuXHRcdGNhY2hlID0gZmFsc2Vcblx0KTogR29ibEVudGl0eSB8IHVuZGVmaW5lZCB7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChkYXRhKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRcdGxldCBlbnRpdHlOYW1lID0gZGF0YVtnb2JsTWFya2VyXSxcblx0XHRcdFx0ZW50aXR5LFxuXHRcdFx0XHRtYWdpYyxcblx0XHRcdFx0b2xkOiBHb2JsRW50aXR5LFxuXHRcdFx0XHRlOiBHb2JsRW50aXR5LFxuXHRcdFx0XHRjYWNoZUtleTtcblxuXHRcdFx0aWYgKGVudGl0eU5hbWUpIHtcblx0XHRcdFx0ZW50aXR5ID0gZ29ibFtlbnRpdHlOYW1lXTtcblx0XHRcdFx0Ly8gbWF5YmUgdGhlIGVudGl0eSBuYW1lIGNoYW5nZVxuXHRcdFx0XHQvLyB0aGlzIGlzIHRvIGhhdmUgYSBjbGVhbiBvYmplY3Rcblx0XHRcdFx0ZGVsZXRlIGRhdGFbZ29ibE1hcmtlcl07XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZW50aXR5KSB7XG5cdFx0XHRcdG1hZ2ljID0gT2JqZWN0LmtleXMoZGF0YSkuc29ydCgpLmpvaW4oJycpO1xuXHRcdFx0XHRlbnRpdHlOYW1lID0gZ29ibENsYXNzTWFnaWNNYXBbbWFnaWNdO1xuXG5cdFx0XHRcdGlmIChlbnRpdHlOYW1lKSB7XG5cdFx0XHRcdFx0ZW50aXR5ID0gZ29ibFtlbnRpdHlOYW1lXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoZW50aXR5KSB7XG5cdFx0XHRcdGUgPSBuZXcgZW50aXR5KGRhdGEpO1xuXHRcdFx0XHRpZiAoY2FjaGUgJiYgKGNhY2hlS2V5ID0gZS5jYWNoZUtleSgpKSkge1xuXHRcdFx0XHRcdG9sZCA9IGdvYmxDYWNoZVtlbnRpdHlOYW1lXVtjYWNoZUtleV07XG5cdFx0XHRcdFx0aWYgKG9sZCkge1xuXHRcdFx0XHRcdFx0ZSA9IG9sZC5kb0h5ZHJhdGUoZGF0YSk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Z29ibENhY2hlW2VudGl0eU5hbWVdW2NhY2hlS2V5XSA9IGU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9O1xuXG5leHBvcnQgY29uc3QgcmVnaXN0ZXIgPSBmdW5jdGlvbiAobmFtZTogc3RyaW5nLCBlbnRpdHk6IHR5cGVvZiBHb2JsRW50aXR5KSB7XG5cdGdvYmxbbmFtZV0gPSBlbnRpdHk7XG5cdGdvYmxDYWNoZVtuYW1lXSA9IHt9O1xuXHRnb2JsQ2xhc3NNYWdpY01hcFsoZW50aXR5IGFzIGFueSkuQ09MVU1OUy5zb3J0KCkuam9pbignJyldID0gbmFtZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRFbnRpdHlDYWNoZSA9IChlbnRpdHlOYW1lOiBzdHJpbmcpID0+IGdvYmxDYWNoZVtlbnRpdHlOYW1lXTtcblxuZXhwb3J0IGNvbnN0IF9ib29sID0gKHY6IGFueSk6IGJvb2xlYW4gPT4ge1xuXHRyZXR1cm4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgPyB2IDogQm9vbGVhbih2ID09PSAnMCcgPyAwIDogdik7XG59O1xuXG5leHBvcnQgY29uc3QgX2ludCA9ICh2OiBhbnkpOiBudW1iZXIgPT4ge1xuXHRyZXR1cm4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgPyB2IDogcGFyc2VJbnQodik7XG59O1xuXG5leHBvcnQgY29uc3QgX3N0cmluZyA9ICh2OiBhbnkpOiBzdHJpbmcgPT4ge1xuXHRyZXR1cm4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgPyAnJyA6IFN0cmluZyh2KTtcbn07XG4iXX0=