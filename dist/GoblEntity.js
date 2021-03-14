import { getEntityCache, goblMarker, toInstance } from './gobl';
var GoblEntityState;
(function (GoblEntityState) {
    GoblEntityState[GoblEntityState["UNKNOWN"] = 0] = "UNKNOWN";
    GoblEntityState[GoblEntityState["SAVING"] = 1] = "SAVING";
    GoblEntityState[GoblEntityState["DELETING"] = 2] = "DELETING";
    GoblEntityState[GoblEntityState["UPDATING"] = 3] = "UPDATING";
})(GoblEntityState || (GoblEntityState = {}));
/**
 * GoblEntity class.
 */
export default class GoblEntity {
    constructor(_initialData = {}, _name, _prefix, _columns) {
        this._name = _name;
        this._prefix = _prefix;
        this._columns = _columns;
        this._data = {};
        this._cache = {};
        this._state = GoblEntityState.UNKNOWN;
        const ctx = this, 
        // we use null not undefined since JSON.stringify will ignore properties with undefined value
        _def = null;
        _columns.forEach(function (col) {
            ctx._data[col] = ctx._cache[col] =
                col in _initialData ? _initialData[col] : _def;
        });
    }
    /**
     * Magic setter.
     *
     * @param column
     * @param value
     */
    _set(column, value) {
        if (Object.prototype.hasOwnProperty.call(this._data, column)) {
            this._data[column] = value;
        }
        return this;
    }
    /**
     * Checks if the entity is clean.
     */
    isClean() {
        return Object.keys(this.toObject(true)).length === 0;
    }
    /**
     * Checks if the entity is saved.
     *
     * @param set When true the entity will be considered as saved.
     */
    isSaved(set) {
        if (set) {
            this._cache = this.toObject();
            return true;
        }
        return this.isClean();
    }
    /**
     * Checks if the entity is being saved.
     *
     * @param set When true the state will be set to saving.
     */
    isSaving(set) {
        if (arguments.length) {
            this._state = set
                ? GoblEntityState.SAVING
                : GoblEntityState.UNKNOWN;
        }
        return this._state === GoblEntityState.SAVING;
    }
    /**
     * Checks if the entity is being deleted.
     *
     * @param set When true the state will be set to deleting.
     */
    isDeleting(set) {
        if (arguments.length) {
            this._state = set
                ? GoblEntityState.DELETING
                : GoblEntityState.UNKNOWN;
        }
        return this._state === GoblEntityState.DELETING;
    }
    /**
     * Checks if the entity is being updated.
     *
     * @param set When true the state will be set to updating.
     */
    isUpdating(set) {
        if (arguments.length) {
            this._state = set
                ? GoblEntityState.UPDATING
                : GoblEntityState.UNKNOWN;
        }
        return this._state === GoblEntityState.UPDATING;
    }
    /**
     * Hydrate the entity and set as saved when `save` is true
     */
    doHydrate(data, save = false) {
        const ctx = this, sourceOfTruth = this._data;
        Object.keys(data).forEach(function (k) {
            if (Object.prototype.hasOwnProperty.call(sourceOfTruth, k)) {
                ctx[k.slice(ctx._prefix.length + 1)] = data[k];
            }
        });
        if (save) {
            this.isSaved(true);
        }
        return this;
    }
    /**
     * Returns current data in a clean new object
     *
     * if `diff` is true, returns modified columns only
     */
    toObject(diff = false) {
        const o = {};
        if (diff) {
            for (const k in this._cache) {
                if (Object.prototype.hasOwnProperty.call(this._cache, k)) {
                    if (this._cache[k] !== this._data[k]) {
                        o[k] = this._data[k];
                    }
                }
            }
            return o;
        }
        for (const k in this._data) {
            if (Object.prototype.hasOwnProperty.call(this._data, k)) {
                o[k] = this._data[k];
            }
        }
        return o;
    }
    /**
     * Returns some column values
     */
    toObjectSome(columns) {
        const o = {}, len = columns.length;
        for (let i = 0; i < len; i++) {
            const col = columns[i];
            if (Object.prototype.hasOwnProperty.call(this._data, col)) {
                o[col] = this._data[col];
            }
            else {
                throw new Error(`Column "${col}" is not defined in "${this._name}".`);
            }
        }
        return o;
    }
    /**
     * JSON helper
     */
    toJSON() {
        const data = this.toObject();
        data[goblMarker] = this._name;
        return data;
    }
    /**
     * Returns the entity cache key.
     *
     * `null` is returned when we can't have a valid cache key.
     */
    cacheKey() {
        const columns = this.identifierColumns().sort(), len = columns.length;
        let value = '', i = 0;
        if (len === 1) {
            value = this._data[columns[0]];
        }
        else {
            for (; i < len; i++) {
                const v = this._data[columns[i]];
                if (v != null) {
                    value += v;
                }
            }
        }
        return value || null;
    }
    /**
     * For backward compatibility
     */
    toInstance(data, cache = false) {
        return toInstance(data, cache);
    }
    /**
     * For backward compatibility
     */
    subCache(entityName) {
        return getEntityCache(entityName);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29ibEVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Hb2JsRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU1oRSxJQUFLLGVBS0o7QUFMRCxXQUFLLGVBQWU7SUFDbkIsMkRBQU8sQ0FBQTtJQUNQLHlEQUFNLENBQUE7SUFDTiw2REFBUSxDQUFBO0lBQ1IsNkRBQVEsQ0FBQTtBQUNULENBQUMsRUFMSSxlQUFlLEtBQWYsZUFBZSxRQUtuQjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBZ0IsVUFBVTtJQUt2QyxZQUNDLGVBQStCLEVBQUUsRUFDaEIsS0FBYSxFQUNiLE9BQWUsRUFDZixRQUFrQjtRQUZsQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVU7UUFSakIsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQUN6QixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ2pCLFdBQU0sR0FBVyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBUWxELE1BQU0sR0FBRyxHQUFHLElBQUk7UUFDZiw2RkFBNkY7UUFDN0YsSUFBSSxHQUFHLElBQUksQ0FBQztRQUViLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sSUFBSSxDQUFDLE1BQWMsRUFBRSxLQUFVO1FBQ3hDLElBQUks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VUFBVSxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQU1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RW50aXR5Q2FjaGUsIGdvYmxNYXJrZXIsIHRvSW5zdGFuY2UgfSBmcm9tICcuL2dvYmwnO1xuXG5leHBvcnQgdHlwZSBHb2JsRW50aXR5RGF0YSA9IHtcblx0W2tleTogc3RyaW5nXTogYW55O1xufTtcblxuZW51bSBHb2JsRW50aXR5U3RhdGUge1xuXHRVTktOT1dOLFxuXHRTQVZJTkcsXG5cdERFTEVUSU5HLFxuXHRVUERBVElORyxcbn1cblxuLyoqXG4gKiBHb2JsRW50aXR5IGNsYXNzLlxuICovXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBHb2JsRW50aXR5IHtcblx0cHJvdGVjdGVkIHJlYWRvbmx5IF9kYXRhOiBhbnkgPSB7fTtcblx0cHJvdGVjdGVkIF9jYWNoZTogYW55ID0ge307XG5cdHByb3RlY3RlZCBfc3RhdGU6IG51bWJlciA9IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXG5cdHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihcblx0XHRfaW5pdGlhbERhdGE6IEdvYmxFbnRpdHlEYXRhID0ge30sXG5cdFx0cHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgX3ByZWZpeDogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgX2NvbHVtbnM6IHN0cmluZ1tdLFxuXHQpIHtcblx0XHRjb25zdCBjdHggPSB0aGlzLFxuXHRcdFx0Ly8gd2UgdXNlIG51bGwgbm90IHVuZGVmaW5lZCBzaW5jZSBKU09OLnN0cmluZ2lmeSB3aWxsIGlnbm9yZSBwcm9wZXJ0aWVzIHdpdGggdW5kZWZpbmVkIHZhbHVlXG5cdFx0XHRfZGVmID0gbnVsbDtcblxuXHRcdF9jb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbCkge1xuXHRcdFx0Y3R4Ll9kYXRhW2NvbF0gPSBjdHguX2NhY2hlW2NvbF0gPVxuXHRcdFx0XHRjb2wgaW4gX2luaXRpYWxEYXRhID8gX2luaXRpYWxEYXRhW2NvbF0gOiBfZGVmO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hZ2ljIHNldHRlci5cblx0ICpcblx0ICogQHBhcmFtIGNvbHVtblxuXHQgKiBAcGFyYW0gdmFsdWVcblx0ICovXG5cdHByb3RlY3RlZCBfc2V0KGNvbHVtbjogc3RyaW5nLCB2YWx1ZTogYW55KTogdGhpcyB7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9kYXRhLCBjb2x1bW4pKSB7XG5cdFx0XHR0aGlzLl9kYXRhW2NvbHVtbl0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBjbGVhbi5cblx0ICovXG5cdGlzQ2xlYW4oKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudG9PYmplY3QodHJ1ZSkpLmxlbmd0aCA9PT0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBzYXZlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIGVudGl0eSB3aWxsIGJlIGNvbnNpZGVyZWQgYXMgc2F2ZWQuXG5cdCAqL1xuXHRpc1NhdmVkKHNldD86IGJvb2xlYW4pOiBib29sZWFuIHtcblx0XHRpZiAoc2V0KSB7XG5cdFx0XHR0aGlzLl9jYWNoZSA9IHRoaXMudG9PYmplY3QoKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmlzQ2xlYW4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBiZWluZyBzYXZlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIHNhdmluZy5cblx0ICovXG5cdGlzU2F2aW5nKHNldD86IGJvb2xlYW4pOiBib29sZWFuIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fc3RhdGUgPSBzZXRcblx0XHRcdFx0PyBHb2JsRW50aXR5U3RhdGUuU0FWSU5HXG5cdFx0XHRcdDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuU0FWSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIGRlbGV0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBzZXQgV2hlbiB0cnVlIHRoZSBzdGF0ZSB3aWxsIGJlIHNldCB0byBkZWxldGluZy5cblx0ICovXG5cdGlzRGVsZXRpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldFxuXHRcdFx0XHQ/IEdvYmxFbnRpdHlTdGF0ZS5ERUxFVElOR1xuXHRcdFx0XHQ6IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9zdGF0ZSA9PT0gR29ibEVudGl0eVN0YXRlLkRFTEVUSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIHVwZGF0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBzZXQgV2hlbiB0cnVlIHRoZSBzdGF0ZSB3aWxsIGJlIHNldCB0byB1cGRhdGluZy5cblx0ICovXG5cdGlzVXBkYXRpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldFxuXHRcdFx0XHQ/IEdvYmxFbnRpdHlTdGF0ZS5VUERBVElOR1xuXHRcdFx0XHQ6IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9zdGF0ZSA9PT0gR29ibEVudGl0eVN0YXRlLlVQREFUSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIEh5ZHJhdGUgdGhlIGVudGl0eSBhbmQgc2V0IGFzIHNhdmVkIHdoZW4gYHNhdmVgIGlzIHRydWVcblx0ICovXG5cdGRvSHlkcmF0ZShkYXRhOiBHb2JsRW50aXR5RGF0YSwgc2F2ZSA9IGZhbHNlKTogdGhpcyB7XG5cdFx0Y29uc3QgY3R4ID0gdGhpcyxcblx0XHRcdHNvdXJjZU9mVHJ1dGggPSB0aGlzLl9kYXRhO1xuXG5cdFx0T2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2VPZlRydXRoLCBrKSkge1xuXHRcdFx0XHQoY3R4IGFzIGFueSlbay5zbGljZShjdHguX3ByZWZpeC5sZW5ndGggKyAxKV0gPSBkYXRhW2tdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHNhdmUpIHtcblx0XHRcdHRoaXMuaXNTYXZlZCh0cnVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGN1cnJlbnQgZGF0YSBpbiBhIGNsZWFuIG5ldyBvYmplY3Rcblx0ICpcblx0ICogaWYgYGRpZmZgIGlzIHRydWUsIHJldHVybnMgbW9kaWZpZWQgY29sdW1ucyBvbmx5XG5cdCAqL1xuXHR0b09iamVjdChkaWZmID0gZmFsc2UpOiBHb2JsRW50aXR5RGF0YSB7XG5cdFx0Y29uc3QgbzogYW55ID0ge307XG5cblx0XHRpZiAoZGlmZikge1xuXHRcdFx0Zm9yIChjb25zdCBrIGluIHRoaXMuX2NhY2hlKSB7XG5cdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fY2FjaGUsIGspKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2NhY2hlW2tdICE9PSB0aGlzLl9kYXRhW2tdKSB7XG5cdFx0XHRcdFx0XHRvW2tdID0gdGhpcy5fZGF0YVtrXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgayBpbiB0aGlzLl9kYXRhKSB7XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGspKSB7XG5cdFx0XHRcdG9ba10gPSB0aGlzLl9kYXRhW2tdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgc29tZSBjb2x1bW4gdmFsdWVzXG5cdCAqL1xuXHR0b09iamVjdFNvbWUoY29sdW1uczogc3RyaW5nW10pOiBHb2JsRW50aXR5RGF0YSB7XG5cdFx0Y29uc3QgbzogYW55ID0ge30sXG5cdFx0XHRsZW4gPSBjb2x1bW5zLmxlbmd0aDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGNvbnN0IGNvbCA9IGNvbHVtbnNbaV07XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGNvbCkpIHtcblx0XHRcdFx0b1tjb2xdID0gdGhpcy5fZGF0YVtjb2xdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHRcdGBDb2x1bW4gXCIke2NvbH1cIiBpcyBub3QgZGVmaW5lZCBpbiBcIiR7dGhpcy5fbmFtZX1cIi5gLFxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0LyoqXG5cdCAqIEpTT04gaGVscGVyXG5cdCAqL1xuXHR0b0pTT04oKTogYW55IHtcblx0XHRjb25zdCBkYXRhID0gdGhpcy50b09iamVjdCgpO1xuXHRcdGRhdGFbZ29ibE1hcmtlcl0gPSB0aGlzLl9uYW1lO1xuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZW50aXR5IGNhY2hlIGtleS5cblx0ICpcblx0ICogYG51bGxgIGlzIHJldHVybmVkIHdoZW4gd2UgY2FuJ3QgaGF2ZSBhIHZhbGlkIGNhY2hlIGtleS5cblx0ICovXG5cdGNhY2hlS2V5KCk6IHN0cmluZyB8IG51bGwge1xuXHRcdGNvbnN0IGNvbHVtbnMgPSB0aGlzLmlkZW50aWZpZXJDb2x1bW5zKCkuc29ydCgpLFxuXHRcdFx0bGVuID0gY29sdW1ucy5sZW5ndGg7XG5cdFx0bGV0IHZhbHVlID0gJycsXG5cdFx0XHRpID0gMDtcblxuXHRcdGlmIChsZW4gPT09IDEpIHtcblx0XHRcdHZhbHVlID0gdGhpcy5fZGF0YVtjb2x1bW5zWzBdXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRjb25zdCB2ID0gdGhpcy5fZGF0YVtjb2x1bW5zW2ldXTtcblx0XHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHZhbHVlICs9IHY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWUgfHwgbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHQgKi9cblx0dG9JbnN0YW5jZShkYXRhOiBHb2JsRW50aXR5RGF0YSwgY2FjaGUgPSBmYWxzZSkge1xuXHRcdHJldHVybiB0b0luc3RhbmNlKGRhdGEsIGNhY2hlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHQgKi9cblx0c3ViQ2FjaGUoZW50aXR5TmFtZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGdldEVudGl0eUNhY2hlKGVudGl0eU5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXR5LlxuXHQgKi9cblx0YWJzdHJhY3QgaWRlbnRpZmllckNvbHVtbnMoKTogc3RyaW5nW107XG59XG4iXX0=