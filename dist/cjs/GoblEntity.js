"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gobl_js_1 = require("./gobl.js");
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
class GoblEntity {
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
        data[gobl_js_1.goblMarker] = this._name;
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
        return (0, gobl_js_1.toInstance)(data, cache);
    }
    /**
     * For backward compatibility
     */
    subCache(entityName) {
        return (0, gobl_js_1.getEntityCache)(entityName);
    }
}
exports.default = GoblEntity;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR29ibEVudGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Hb2JsRW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW1FO0FBTW5FLElBQUssZUFLSjtBQUxELFdBQUssZUFBZTtJQUNuQiwyREFBTyxDQUFBO0lBQ1AseURBQU0sQ0FBQTtJQUNOLDZEQUFRLENBQUE7SUFDUiw2REFBUSxDQUFBO0FBQ1QsQ0FBQyxFQUxJLGVBQWUsS0FBZixlQUFlLFFBS25CO0FBRUQ7O0dBRUc7QUFDSCxNQUE4QixVQUFVO0lBT3JCO0lBQ0E7SUFDQTtJQVJDLEtBQUssR0FBUSxFQUFFLENBQUM7SUFDekIsTUFBTSxHQUFRLEVBQUUsQ0FBQztJQUNqQixNQUFNLEdBQW9CLGVBQWUsQ0FBQyxPQUFPLENBQUM7SUFFNUQsWUFDQyxlQUErQixFQUFFLEVBQ2hCLEtBQWEsRUFDYixPQUFlLEVBQ2YsUUFBa0I7UUFGbEIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixhQUFRLEdBQVIsUUFBUSxDQUFVO1FBRW5DLE1BQU0sR0FBRyxHQUFHLElBQUk7UUFDZiw2RkFBNkY7UUFDN0YsSUFBSSxHQUFHLElBQUksQ0FBQztRQUViLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLEdBQUcsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7OztPQUtHO0lBQ08sSUFBSSxDQUFDLE1BQWMsRUFBRSxLQUFVO1FBQ3hDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElB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O0FBdk5ELDZCQXVOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdldEVudGl0eUNhY2hlLCBnb2JsTWFya2VyLCB0b0luc3RhbmNlIH0gZnJvbSAnLi9nb2JsLmpzJztcblxuZXhwb3J0IHR5cGUgR29ibEVudGl0eURhdGEgPSB7XG5cdFtrZXk6IHN0cmluZ106IGFueTtcbn07XG5cbmVudW0gR29ibEVudGl0eVN0YXRlIHtcblx0VU5LTk9XTixcblx0U0FWSU5HLFxuXHRERUxFVElORyxcblx0VVBEQVRJTkcsXG59XG5cbi8qKlxuICogR29ibEVudGl0eSBjbGFzcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgR29ibEVudGl0eSB7XG5cdHByb3RlY3RlZCByZWFkb25seSBfZGF0YTogYW55ID0ge307XG5cdHByb3RlY3RlZCBfY2FjaGU6IGFueSA9IHt9O1xuXHRwcm90ZWN0ZWQgX3N0YXRlOiBHb2JsRW50aXR5U3RhdGUgPSBHb2JsRW50aXR5U3RhdGUuVU5LTk9XTjtcblxuXHRwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG5cdFx0X2luaXRpYWxEYXRhOiBHb2JsRW50aXR5RGF0YSA9IHt9LFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgX25hbWU6IHN0cmluZyxcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9wcmVmaXg6IHN0cmluZyxcblx0XHRwcml2YXRlIHJlYWRvbmx5IF9jb2x1bW5zOiBzdHJpbmdbXVxuXHQpIHtcblx0XHRjb25zdCBjdHggPSB0aGlzLFxuXHRcdFx0Ly8gd2UgdXNlIG51bGwgbm90IHVuZGVmaW5lZCBzaW5jZSBKU09OLnN0cmluZ2lmeSB3aWxsIGlnbm9yZSBwcm9wZXJ0aWVzIHdpdGggdW5kZWZpbmVkIHZhbHVlXG5cdFx0XHRfZGVmID0gbnVsbDtcblxuXHRcdF9jb2x1bW5zLmZvckVhY2goZnVuY3Rpb24gKGNvbCkge1xuXHRcdFx0Y3R4Ll9kYXRhW2NvbF0gPSBjdHguX2NhY2hlW2NvbF0gPVxuXHRcdFx0XHRjb2wgaW4gX2luaXRpYWxEYXRhID8gX2luaXRpYWxEYXRhW2NvbF0gOiBfZGVmO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIE1hZ2ljIHNldHRlci5cblx0ICpcblx0ICogQHBhcmFtIGNvbHVtblxuXHQgKiBAcGFyYW0gdmFsdWVcblx0ICovXG5cdHByb3RlY3RlZCBfc2V0KGNvbHVtbjogc3RyaW5nLCB2YWx1ZTogYW55KTogdGhpcyB7XG5cdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9kYXRhLCBjb2x1bW4pKSB7XG5cdFx0XHR0aGlzLl9kYXRhW2NvbHVtbl0gPSB2YWx1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBjbGVhbi5cblx0ICovXG5cdGlzQ2xlYW4oKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudG9PYmplY3QodHJ1ZSkpLmxlbmd0aCA9PT0gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBzYXZlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIGVudGl0eSB3aWxsIGJlIGNvbnNpZGVyZWQgYXMgc2F2ZWQuXG5cdCAqL1xuXHRpc1NhdmVkKHNldD86IGJvb2xlYW4pOiBib29sZWFuIHtcblx0XHRpZiAoc2V0KSB7XG5cdFx0XHR0aGlzLl9jYWNoZSA9IHRoaXMudG9PYmplY3QoKTtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmlzQ2xlYW4oKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGVudGl0eSBpcyBiZWluZyBzYXZlZC5cblx0ICpcblx0ICogQHBhcmFtIHNldCBXaGVuIHRydWUgdGhlIHN0YXRlIHdpbGwgYmUgc2V0IHRvIHNhdmluZy5cblx0ICovXG5cdGlzU2F2aW5nKHNldD86IGJvb2xlYW4pOiBib29sZWFuIHtcblx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5fc3RhdGUgPSBzZXQgPyBHb2JsRW50aXR5U3RhdGUuU0FWSU5HIDogR29ibEVudGl0eVN0YXRlLlVOS05PV047XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMuX3N0YXRlID09PSBHb2JsRW50aXR5U3RhdGUuU0FWSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIGRlbGV0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBzZXQgV2hlbiB0cnVlIHRoZSBzdGF0ZSB3aWxsIGJlIHNldCB0byBkZWxldGluZy5cblx0ICovXG5cdGlzRGVsZXRpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldCA/IEdvYmxFbnRpdHlTdGF0ZS5ERUxFVElORyA6IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9zdGF0ZSA9PT0gR29ibEVudGl0eVN0YXRlLkRFTEVUSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgZW50aXR5IGlzIGJlaW5nIHVwZGF0ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBzZXQgV2hlbiB0cnVlIHRoZSBzdGF0ZSB3aWxsIGJlIHNldCB0byB1cGRhdGluZy5cblx0ICovXG5cdGlzVXBkYXRpbmcoc2V0PzogYm9vbGVhbik6IGJvb2xlYW4ge1xuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHNldCA/IEdvYmxFbnRpdHlTdGF0ZS5VUERBVElORyA6IEdvYmxFbnRpdHlTdGF0ZS5VTktOT1dOO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLl9zdGF0ZSA9PT0gR29ibEVudGl0eVN0YXRlLlVQREFUSU5HO1xuXHR9XG5cblx0LyoqXG5cdCAqIEh5ZHJhdGUgdGhlIGVudGl0eSBhbmQgc2V0IGFzIHNhdmVkIHdoZW4gYHNhdmVgIGlzIHRydWVcblx0ICovXG5cdGRvSHlkcmF0ZShkYXRhOiBHb2JsRW50aXR5RGF0YSwgc2F2ZSA9IGZhbHNlKTogdGhpcyB7XG5cdFx0Y29uc3QgY3R4ID0gdGhpcyxcblx0XHRcdHNvdXJjZU9mVHJ1dGggPSB0aGlzLl9kYXRhO1xuXG5cdFx0T2JqZWN0LmtleXMoZGF0YSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRcdFx0aWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2VPZlRydXRoLCBrKSkge1xuXHRcdFx0XHQoY3R4IGFzIGFueSlbay5zbGljZShjdHguX3ByZWZpeC5sZW5ndGggKyAxKV0gPSBkYXRhW2tdO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKHNhdmUpIHtcblx0XHRcdHRoaXMuaXNTYXZlZCh0cnVlKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGN1cnJlbnQgZGF0YSBpbiBhIGNsZWFuIG5ldyBvYmplY3Rcblx0ICpcblx0ICogaWYgYGRpZmZgIGlzIHRydWUsIHJldHVybnMgbW9kaWZpZWQgY29sdW1ucyBvbmx5XG5cdCAqL1xuXHR0b09iamVjdChkaWZmID0gZmFsc2UpOiBHb2JsRW50aXR5RGF0YSB7XG5cdFx0Y29uc3QgbzogYW55ID0ge307XG5cblx0XHRpZiAoZGlmZikge1xuXHRcdFx0Zm9yIChjb25zdCBrIGluIHRoaXMuX2NhY2hlKSB7XG5cdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5fY2FjaGUsIGspKSB7XG5cdFx0XHRcdFx0aWYgKHRoaXMuX2NhY2hlW2tdICE9PSB0aGlzLl9kYXRhW2tdKSB7XG5cdFx0XHRcdFx0XHRvW2tdID0gdGhpcy5fZGF0YVtrXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBvO1xuXHRcdH1cblxuXHRcdGZvciAoY29uc3QgayBpbiB0aGlzLl9kYXRhKSB7XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGspKSB7XG5cdFx0XHRcdG9ba10gPSB0aGlzLl9kYXRhW2tdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgc29tZSBjb2x1bW4gdmFsdWVzXG5cdCAqL1xuXHR0b09iamVjdFNvbWUoY29sdW1uczogc3RyaW5nW10pOiBHb2JsRW50aXR5RGF0YSB7XG5cdFx0Y29uc3QgbzogYW55ID0ge30sXG5cdFx0XHRsZW4gPSBjb2x1bW5zLmxlbmd0aDtcblxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGNvbnN0IGNvbCA9IGNvbHVtbnNbaV07XG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMuX2RhdGEsIGNvbCkpIHtcblx0XHRcdFx0b1tjb2xdID0gdGhpcy5fZGF0YVtjb2xdO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBDb2x1bW4gXCIke2NvbH1cIiBpcyBub3QgZGVmaW5lZCBpbiBcIiR7dGhpcy5fbmFtZX1cIi5gKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdC8qKlxuXHQgKiBKU09OIGhlbHBlclxuXHQgKi9cblx0dG9KU09OKCk6IGFueSB7XG5cdFx0Y29uc3QgZGF0YSA9IHRoaXMudG9PYmplY3QoKTtcblx0XHRkYXRhW2dvYmxNYXJrZXJdID0gdGhpcy5fbmFtZTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGVudGl0eSBjYWNoZSBrZXkuXG5cdCAqXG5cdCAqIGBudWxsYCBpcyByZXR1cm5lZCB3aGVuIHdlIGNhbid0IGhhdmUgYSB2YWxpZCBjYWNoZSBrZXkuXG5cdCAqL1xuXHRjYWNoZUtleSgpOiBzdHJpbmcgfCBudWxsIHtcblx0XHRjb25zdCBjb2x1bW5zID0gdGhpcy5pZGVudGlmaWVyQ29sdW1ucygpLnNvcnQoKSxcblx0XHRcdGxlbiA9IGNvbHVtbnMubGVuZ3RoO1xuXHRcdGxldCB2YWx1ZSA9ICcnLFxuXHRcdFx0aSA9IDA7XG5cblx0XHRpZiAobGVuID09PSAxKSB7XG5cdFx0XHR2YWx1ZSA9IHRoaXMuX2RhdGFbY29sdW1uc1swXV07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdFx0Y29uc3QgdiA9IHRoaXMuX2RhdGFbY29sdW1uc1tpXV07XG5cdFx0XHRcdGlmICh2ICE9IG51bGwpIHtcblx0XHRcdFx0XHR2YWx1ZSArPSAnfCcgKyB2O1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHZhbHVlIHx8IG51bGw7XG5cdH1cblxuXHQvKipcblx0ICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0ICovXG5cdHRvSW5zdGFuY2UoZGF0YTogR29ibEVudGl0eURhdGEsIGNhY2hlID0gZmFsc2UpIHtcblx0XHRyZXR1cm4gdG9JbnN0YW5jZShkYXRhLCBjYWNoZSk7XG5cdH1cblxuXHQvKipcblx0ICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcblx0ICovXG5cdHN1YkNhY2hlKGVudGl0eU5hbWU6IHN0cmluZykge1xuXHRcdHJldHVybiBnZXRFbnRpdHlDYWNoZShlbnRpdHlOYW1lKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwcmltYXJ5IGtleXMgb2YgdGhlIGVudGl0eS5cblx0ICovXG5cdGFic3RyYWN0IGlkZW50aWZpZXJDb2x1bW5zKCk6IHN0cmluZ1tdO1xufVxuIl19