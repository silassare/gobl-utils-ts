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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29ibEVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Hb2JsRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQU1oRSxJQUFLLGVBS0o7QUFMRCxXQUFLLGVBQWU7SUFDbkIsMkRBQU8sQ0FBQTtJQUNQLHlEQUFNLENBQUE7SUFDTiw2REFBUSxDQUFBO0lBQ1IsNkRBQVEsQ0FBQTtBQUNULENBQUMsRUFMSSxlQUFlLEtBQWYsZUFBZSxRQUtuQjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE9BQU8sT0FBZ0IsVUFBVTtJQUt2QyxZQUNDLGVBQStCLEVBQUUsRUFDaEIsS0FBYSxFQUNiLE9BQWUsRUFDZixRQUFrQjtRQUZsQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGFBQVEsR0FBUixRQUFRLENBQVU7UUFSakIsVUFBSyxHQUFRLEVBQUUsQ0FBQztRQUN6QixXQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ2pCLFdBQU0sR0FBVyxlQUFlLENBQUMsT0FBTyxDQUFDO1FBUWxELE1BQU0sR0FBRyxHQUFHLElBQUk7UUFDZiw2RkFBNkY7UUFDN0YsSUFBSSxHQUFHLElBQUksQ0FBQztRQUViLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sSUFBSSxDQUFDLE1BQWMsRUFBRSxLQUFVO1FBQ3hDLElBQUks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LGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDO0NBTUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRFbnRpdHlDYWNoZSwgZ29ibE1hcmtlciwgdG9JbnN0YW5jZSB9IGZyb20gJy4vZ29ibCc7XG5cbmV4cG9ydCB0eXBlIEdvYmxFbnRpdHlEYXRhID0ge1xuXHRba2V5OiBzdHJpbmddOiBhbnk7XG59O1xuXG5lbnVtIEdvYmxFbnRpdHlTdGF0ZSB7XG5cdFVOS05PV04sXG5cdFNBVklORyxcblx0REVMRVRJTkcsXG5cdFVQREFUSU5HLFxufVxuXG4vKipcbiAqIEdvYmxFbnRpdHkgY2xhc3MuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEdvYmxFbnRpdHkge1xuXHRwcm90ZWN0ZWQgcmVhZG9ubHkgX2RhdGE6IGFueSA9IHt9O1xuXHRwcm90ZWN0ZWQgX2NhY2hlOiBhbnkgPSB7fTtcblx0cHJvdGVjdGVkIF9zdGF0ZTogbnVtYmVyID0gR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cblx0cHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuXHRcdF9pbml0aWFsRGF0YTogR29ibEVudGl0eURhdGEgPSB7fSxcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9uYW1lOiBzdHJpbmcsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBfcHJlZml4OiBzdHJpbmcsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBfY29sdW1uczogc3RyaW5nW10sXG5cdCkge1xuXHRcdGNvbnN0IGN0eCA9IHRoaXMsXG5cdFx0XHQvLyB3ZSB1c2UgbnVsbCBub3QgdW5kZWZpbmVkIHNpbmNlIEpTT04uc3RyaW5naWZ5IHdpbGwgaWdub3JlIHByb3BlcnRpZXMgd2l0aCB1bmRlZmluZWQgdmFsdWVcblx0XHRcdF9kZWYgPSBudWxsO1xuXG5cdFx0X2NvbHVtbnMuZm9yRWFjaChmdW5jdGlvbiAoY29sKSB7XG5cdFx0XHRjdHguX2RhdGFbY29sXSA9IGN0eC5fY2FjaGVbY29sXSA9XG5cdFx0XHRcdGNvbCBpbiBfaW5pdGlhbERhdGEgPyBfaW5pdGlhbERhdGFbY29sXSA6IF9kZWY7XG5cdFx0fSk7XG5cdH1cblxuXHQvKipcblx0ICogTWFnaWMgc2V0dGVyLlxuXHQgKlxuXHQgKiBAcGFyYW0gY29sdW1uXG5cdCAqIEBwYXJhbSB2YWx1ZVxuXHQgKi9cblx0cHJvdGVjdGVkIF9zZXQoY29sdW1uOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB0aGlzIHtcblx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGNvbHVtbikpIHtcblx0XHRcdHRoaXMuX2RhdGFbY29sdW1uXSA9IHZhbHVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGNsZWFuLlxuXHQgKi9cblx0aXNDbGVhbigpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gT2JqZWN0LmtleXModGhpcy50b09iamVjdCh0cnVlKSkubGVuZ3RoID09PSAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIHNhdmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2V0IFdoZW4gdHJ1ZSB0aGUgZW50aXR5IHdpbGwgYmUgY29uc2lkZXJlZCBhcyBzYXZlZC5cblx0ICovXG5cdGlzU2F2ZWQoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChzZXQpIHtcblx0XHRcdHRoaXMuX2NhY2hlID0gdGhpcy50b09iamVjdCgpO1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuaXNDbGVhbigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIHNhdmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0gc2V0IFdoZW4gdHJ1ZSB0aGUgc3RhdGUgd2lsbCBiZSBzZXQgdG8gc2F2aW5nLlxuXHQgKi9cblx0aXNTYXZpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldFxuXHRcdFx0XHQ/IEdvYmxFbnRpdHlTdGF0ZS5TQVZJTkdcblx0XHRcdFx0OiBHb2JsRW50aXR5U3RhdGUuVU5LTk9XTjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5fc3RhdGUgPT09IEdvYmxFbnRpdHlTdGF0ZS5TQVZJTkc7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBlbnRpdHkgaXMgYmVpbmcgZGVsZXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIGRlbGV0aW5nLlxuXHQgKi9cblx0aXNEZWxldGluZyhzZXQ/OiBib29sZWFuKTogYm9vbGVhbiB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3N0YXRlID0gc2V0XG5cdFx0XHRcdD8gR29ibEVudGl0eVN0YXRlLkRFTEVUSU5HXG5cdFx0XHRcdDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuREVMRVRJTkc7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBlbnRpdHkgaXMgYmVpbmcgdXBkYXRlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIHVwZGF0aW5nLlxuXHQgKi9cblx0aXNVcGRhdGluZyhzZXQ/OiBib29sZWFuKTogYm9vbGVhbiB7XG5cdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuX3N0YXRlID0gc2V0XG5cdFx0XHRcdD8gR29ibEVudGl0eVN0YXRlLlVQREFUSU5HXG5cdFx0XHRcdDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuVVBEQVRJTkc7XG5cdH1cblxuXHQvKipcblx0ICogSHlkcmF0ZSB0aGUgZW50aXR5IGFuZCBzZXQgYXMgc2F2ZWQgd2hlbiBgc2F2ZWAgaXMgdHJ1ZVxuXHQgKi9cblx0ZG9IeWRyYXRlKGRhdGE6IEdvYmxFbnRpdHlEYXRhLCBzYXZlID0gZmFsc2UpOiB0aGlzIHtcblx0XHRjb25zdCBjdHggPSB0aGlzLFxuXHRcdFx0c291cmNlT2ZUcnV0aCA9IHRoaXMuX2RhdGE7XG5cblx0XHRPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZU9mVHJ1dGgsIGspKSB7XG5cdFx0XHRcdChjdHggYXMgYW55KVtrLnNsaWNlKGN0eC5fcHJlZml4Lmxlbmd0aCArIDEpXSA9IGRhdGFba107XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRpZiAoc2F2ZSkge1xuXHRcdFx0dGhpcy5pc1NhdmVkKHRydWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgY3VycmVudCBkYXRhIGluIGEgY2xlYW4gbmV3IG9iamVjdFxuXHQgKlxuXHQgKiBpZiBgZGlmZmAgaXMgdHJ1ZSwgcmV0dXJucyBtb2RpZmllZCBjb2x1bW5zIG9ubHlcblx0ICovXG5cdHRvT2JqZWN0KGRpZmYgPSBmYWxzZSk6IEdvYmxFbnRpdHlEYXRhIHtcblx0XHRjb25zdCBvOiBhbnkgPSB7fTtcblxuXHRcdGlmIChkaWZmKSB7XG5cdFx0XHRmb3IgKGNvbnN0IGsgaW4gdGhpcy5fY2FjaGUpIHtcblx0XHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9jYWNoZSwgaykpIHtcblx0XHRcdFx0XHRpZiAodGhpcy5fY2FjaGVba10gIT09IHRoaXMuX2RhdGFba10pIHtcblx0XHRcdFx0XHRcdG9ba10gPSB0aGlzLl9kYXRhW2tdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG87XG5cdFx0fVxuXG5cdFx0Zm9yIChjb25zdCBrIGluIHRoaXMuX2RhdGEpIHtcblx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fZGF0YSwgaykpIHtcblx0XHRcdFx0b1trXSA9IHRoaXMuX2RhdGFba107XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBzb21lIGNvbHVtbiB2YWx1ZXNcblx0ICovXG5cdHRvT2JqZWN0U29tZShjb2x1bW5zOiBzdHJpbmdbXSk6IEdvYmxFbnRpdHlEYXRhIHtcblx0XHRjb25zdCBvOiBhbnkgPSB7fSxcblx0XHRcdGxlbiA9IGNvbHVtbnMubGVuZ3RoO1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0Y29uc3QgY29sID0gY29sdW1uc1tpXTtcblx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fZGF0YSwgY29sKSkge1xuXHRcdFx0XHRvW2NvbF0gPSB0aGlzLl9kYXRhW2NvbF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdFx0YENvbHVtbiBcIiR7Y29sfVwiIGlzIG5vdCBkZWZpbmVkIGluIFwiJHt0aGlzLl9uYW1lfVwiLmAsXG5cdFx0XHRcdCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHQvKipcblx0ICogSlNPTiBoZWxwZXJcblx0ICovXG5cdHRvSlNPTigpOiBhbnkge1xuXHRcdGNvbnN0IGRhdGEgPSB0aGlzLnRvT2JqZWN0KCk7XG5cdFx0ZGF0YVtnb2JsTWFya2VyXSA9IHRoaXMuX25hbWU7XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBlbnRpdHkgY2FjaGUga2V5LlxuXHQgKlxuXHQgKiBgbnVsbGAgaXMgcmV0dXJuZWQgd2hlbiB3ZSBjYW4ndCBoYXZlIGEgdmFsaWQgY2FjaGUga2V5LlxuXHQgKi9cblx0Y2FjaGVLZXkoKTogc3RyaW5nIHwgbnVsbCB7XG5cdFx0Y29uc3QgY29sdW1ucyA9IHRoaXMuaWRlbnRpZmllckNvbHVtbnMoKS5zb3J0KCksXG5cdFx0XHRsZW4gPSBjb2x1bW5zLmxlbmd0aDtcblx0XHRsZXQgdmFsdWUgPSAnJyxcblx0XHRcdGkgPSAwO1xuXG5cdFx0aWYgKGxlbiA9PT0gMSkge1xuXHRcdFx0dmFsdWUgPSB0aGlzLl9kYXRhW2NvbHVtbnNbMF1dO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRcdGNvbnN0IHYgPSB0aGlzLl9kYXRhW2NvbHVtbnNbaV1dO1xuXHRcdFx0XHRpZiAodiAhPSBudWxsKSB7XG5cdFx0XHRcdFx0dmFsdWUgKz0gJ3wnICsgdjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB2YWx1ZSB8fCBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdCAqL1xuXHR0b0luc3RhbmNlKGRhdGE6IEdvYmxFbnRpdHlEYXRhLCBjYWNoZSA9IGZhbHNlKSB7XG5cdFx0cmV0dXJuIHRvSW5zdGFuY2UoZGF0YSwgY2FjaGUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cdCAqL1xuXHRzdWJDYWNoZShlbnRpdHlOYW1lOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gZ2V0RW50aXR5Q2FjaGUoZW50aXR5TmFtZSk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcHJpbWFyeSBrZXlzIG9mIHRoZSBlbnRpdHkuXG5cdCAqL1xuXHRhYnN0cmFjdCBpZGVudGlmaWVyQ29sdW1ucygpOiBzdHJpbmdbXTtcbn1cbiJdfQ==