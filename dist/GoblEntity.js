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
    _name;
    _prefix;
    _columns;
    _data = {};
    _cache = {};
    _state = GoblEntityState.UNKNOWN;
    constructor(_initialData = {}, _name, _prefix, _columns) {
        this._name = _name;
        this._prefix = _prefix;
        this._columns = _columns;
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
            this._state = set ? GoblEntityState.SAVING : GoblEntityState.UNKNOWN;
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
            this._state = set ? GoblEntityState.DELETING : GoblEntityState.UNKNOWN;
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
            this._state = set ? GoblEntityState.UPDATING : GoblEntityState.UNKNOWN;
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
                    value += '|' + v;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29ibEVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Hb2JsRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU1oRSxJQUFLLGVBS0o7QUFMRCxXQUFLLGVBQWU7SUFDbkIsMkRBQU8sQ0FBQTtJQUNQLHlEQUFNLENBQUE7SUFDTiw2REFBUSxDQUFBO0lBQ1IsNkRBQVEsQ0FBQTtBQUNULENBQUMsRUFMSSxlQUFlLEtBQWYsZUFBZSxRQUtuQjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBZ0IsVUFBVTtJQU9yQjtJQUNBO0lBQ0E7SUFSQyxLQUFLLEdBQVEsRUFBRSxDQUFDO0lBQ3pCLE1BQU0sR0FBUSxFQUFFLENBQUM7SUFDakIsTUFBTSxHQUFvQixlQUFlLENBQUMsT0FBTyxDQUFDO0lBRTVELFlBQ0MsZUFBK0IsRUFBRSxFQUNoQixLQUFhLEVBQ2IsT0FBZSxFQUNmLFFBQWtCO1FBRmxCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUVuQyxNQUFNLEdBQUcsR0FBRyxJQUFJO1FBQ2YsNkZBQTZGO1FBQzdGLElBQUksR0FBRyxJQUFJLENBQUM7UUFFYixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztZQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUMvQixHQUFHLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNPLElBQUksQ0FBQyxNQUFjLEVBQUUs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T0FBTyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQU1EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0RW50aXR5Q2FjaGUsIGdvYmxNYXJrZXIsIHRvSW5zdGFuY2UgfSBmcm9tICcuL2dvYmwnO1xuXG5leHBvcnQgdHlwZSBHb2JsRW50aXR5RGF0YSA9IHtcblx0W2tleTogc3RyaW5nXTogYW55O1xufTtcblxuZW51bSBHb2JsRW50aXR5U3RhdGUge1xuXHRVTktOT1dOLFxuXHRTQVZJTkcsXG5cdERFTEVUSU5HLFxuXHRVUERBVElORyxcbn1cblxuLyoqXG4gKiBHb2JsRW50aXR5IGNsYXNzLlxuICovXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBHb2JsRW50aXR5IHtcblx0cHJvdGVjdGVkIHJlYWRvbmx5IF9kYXRhOiBhbnkgPSB7fTtcblx0cHJvdGVjdGVkIF9jYWNoZTogYW55ID0ge307XG5cdHByb3RlY3RlZCBfc3RhdGU6IEdvYmxFbnRpdHlTdGF0ZSA9IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXG5cdHByb3RlY3RlZCBjb25zdHJ1Y3Rvcihcblx0XHRfaW5pdGlhbERhdGE6IEdvYmxFbnRpdHlEYXRhID0ge30sXG5cdFx0cHJpdmF0ZSByZWFkb25seSBfbmFtZTogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgX3ByZWZpeDogc3RyaW5nLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgX2NvbHVtbnM6IHN0cmluZ1tdXG5cdCkge1xuXHRcdGNvbnN0IGN0eCA9IHRoaXMsXG5cdFx0XHQvLyB3ZSB1c2UgbnVsbCBub3QgdW5kZWZpbmVkIHNpbmNlIEpTT04uc3RyaW5naWZ5IHdpbGwgaWdub3JlIHByb3BlcnRpZXMgd2l0aCB1bmRlZmluZWQgdmFsdWVcblx0XHRcdF9kZWYgPSBudWxsO1xuXG5cdFx0X2NvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sKSB7XG5cdFx0XHRjdHguX2RhdGFbY29sXSA9IGN0eC5fY2FjaGVbY29sXSA9XG5cdFx0XHRcdGNvbCBpbiBfaW5pdGlhbERhdGEgPyBfaW5pdGlhbERhdGFbY29sXSA6IF9kZWY7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogTWFnaWMgc2V0dGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gY29sdW1uXG5cdCAqIEBwYXJhbSB2YWx1ZVxuXHQgKi9cblx0cHJvdGVjdGVkIF9zZXQoY29sdW1uOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB0aGlzIHtcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGNvbHVtbikpIHtcblx0XHRcdHRoaXMuX2RhdGFbY29sdW1uXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGNsZWFuLlxuXHQgKi9cblx0aXNDbGVhbigpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy50b09iamVjdCh0cnVlKSkubGVuZ3RoID09PSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIHNhdmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2V0IFdoZW4gdHJ1ZSB0aGUgZW50aXR5IHdpbGwgYmUgY29uc2lkZXJlZCBhcyBzYXZlZC5cblx0ICovXG5cdGlzU2F2ZWQoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChzZXQpIHtcblx0XHRcdHRoaXMuX2NhY2hlID0gdGhpcy50b09iamVjdCgpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuaXNDbGVhbigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIHNhdmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2V0IFdoZW4gdHJ1ZSB0aGUgc3RhdGUgd2lsbCBiZSBzZXQgdG8gc2F2aW5nLlxuXHQgKi9cblx0aXNTYXZpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldCA/IEdvYmxFbnRpdHlTdGF0ZS5TQVZJTkcgOiBHb2JsRW50aXR5U3RhdGUuVU5LTk9XTjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fc3RhdGUgPT09IEdvYmxFbnRpdHlTdGF0ZS5TQVZJTkc7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBlbnRpdHkgaXMgYmVpbmcgZGVsZXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIGRlbGV0aW5nLlxuXHQgKi9cblx0aXNEZWxldGluZyhzZXQ/OiBib29sZWFuKTogYm9vbGVhbiB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3N0YXRlID0gc2V0ID8gR29ibEVudGl0eVN0YXRlLkRFTEVUSU5HIDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuREVMRVRJTkc7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBlbnRpdHkgaXMgYmVpbmcgdXBkYXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIHVwZGF0aW5nLlxuXHQgKi9cblx0aXNVcGRhdGluZyhzZXQ/OiBib29sZWFuKTogYm9vbGVhbiB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3N0YXRlID0gc2V0ID8gR29ibEVudGl0eVN0YXRlLlVQREFUSU5HIDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuVVBEQVRJTkc7XG5cdH1cblxuXHQvKipcblx0ICogSHlkcmF0ZSB0aGUgZW50aXR5IGFuZCBzZXQgYXMgc2F2ZWQgd2hlbiBgc2F2ZWAgaXMgdHJ1ZVxuXHQgKi9cblx0ZG9IeWRyYXRlKGRhdGE6IEdvYmxFbnRpdHlEYXRhLCBzYXZlID0gZmFsc2UpOiB0aGlzIHtcblx0XHRjb25zdCBjdHggPSB0aGlzLFxuXHRcdFx0c291cmNlT2ZUcnV0aCA9IHRoaXMuX2RhdGE7XG5cblx0XHRPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZU9mVHJ1dGgsIGspKSB7XG5cdFx0XHRcdChjdHggYXMgYW55KVtrLnNsaWNlKGN0eC5fcHJlZml4Lmxlbmd0aCArIDEpXSA9IGRhdGFba107XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoc2F2ZSkge1xuXHRcdFx0dGhpcy5pc1NhdmVkKHRydWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgY3VycmVudCBkYXRhIGluIGEgY2xlYW4gbmV3IG9iamVjdFxuXHQgKlxuXHQgKiBpZiBgZGlmZmAgaXMgdHJ1ZSwgcmV0dXJucyBtb2RpZmllZCBjb2x1bW5zIG9ubHlcblx0ICovXG5cdHRvT2JqZWN0KGRpZmYgPSBmYWxzZSk6IEdvYmxFbnRpdHlEYXRhIHtcblx0XHRjb25zdCBvOiBhbnkgPSB7fTtcblxuXHRcdGlmIChkaWZmKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGsgaW4gdGhpcy5fY2FjaGUpIHtcblx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9jYWNoZSwgaykpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fY2FjaGVba10gIT09IHRoaXMuX2RhdGFba10pIHtcblx0XHRcdFx0XHRcdG9ba10gPSB0aGlzLl9kYXRhW2tdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG87XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBrIGluIHRoaXMuX2RhdGEpIHtcblx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fZGF0YSwgaykpIHtcblx0XHRcdFx0b1trXSA9IHRoaXMuX2RhdGFba107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBzb21lIGNvbHVtbiB2YWx1ZXNcblx0ICovXG5cdHRvT2JqZWN0U29tZShjb2x1bW5zOiBzdHJpbmdbXSk6IEdvYmxFbnRpdHlEYXRhIHtcblx0XHRjb25zdCBvOiBhbnkgPSB7fSxcblx0XHRcdGxlbiA9IGNvbHVtbnMubGVuZ3RoO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0Y29uc3QgY29sID0gY29sdW1uc1tpXTtcblx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fZGF0YSwgY29sKSkge1xuXHRcdFx0XHRvW2NvbF0gPSB0aGlzLl9kYXRhW2NvbF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoYENvbHVtbiBcIiR7Y29sfVwiIGlzIG5vdCBkZWZpbmVkIGluIFwiJHt0aGlzLl9uYW1lfVwiLmApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0LyoqXG5cdCAqIEpTT04gaGVscGVyXG5cdCAqL1xuXHR0b0pTT04oKTogYW55IHtcblx0XHRjb25zdCBkYXRhID0gdGhpcy50b09iamVjdCgpO1xuXHRcdGRhdGFbZ29ibE1hcmtlcl0gPSB0aGlzLl9uYW1lO1xuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgZW50aXR5IGNhY2hlIGtleS5cblx0ICpcblx0ICogYG51bGxgIGlzIHJldHVybmVkIHdoZW4gd2UgY2FuJ3QgaGF2ZSBhIHZhbGlkIGNhY2hlIGtleS5cblx0ICovXG5cdGNhY2hlS2V5KCk6IHN0cmluZyB8IG51bGwge1xuXHRcdGNvbnN0IGNvbHVtbnMgPSB0aGlzLmlkZW50aWZpZXJDb2x1bW5zKCkuc29ydCgpLFxuXHRcdFx0bGVuID0gY29sdW1ucy5sZW5ndGg7XG5cdFx0bGV0IHZhbHVlID0gJycsXG5cdFx0XHRpID0gMDtcblxuXHRcdGlmIChsZW4gPT09IDEpIHtcblx0XHRcdHZhbHVlID0gdGhpcy5fZGF0YVtjb2x1bW5zWzBdXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0XHRjb25zdCB2ID0gdGhpcy5fZGF0YVtjb2x1bW5zW2ldXTtcblx0XHRcdFx0aWYgKHYgIT0gbnVsbCkge1xuXHRcdFx0XHRcdHZhbHVlICs9ICd8JyArIHY7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWUgfHwgbnVsbDtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHQgKi9cblx0dG9JbnN0YW5jZShkYXRhOiBHb2JsRW50aXR5RGF0YSwgY2FjaGUgPSBmYWxzZSkge1xuXHRcdHJldHVybiB0b0luc3RhbmNlKGRhdGEsIGNhY2hlKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuXHQgKi9cblx0c3ViQ2FjaGUoZW50aXR5TmFtZTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIGdldEVudGl0eUNhY2hlKGVudGl0eU5hbWUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHByaW1hcnkga2V5cyBvZiB0aGUgZW50aXR5LlxuXHQgKi9cblx0YWJzdHJhY3QgaWRlbnRpZmllckNvbHVtbnMoKTogc3RyaW5nW107XG59XG4iXX0=