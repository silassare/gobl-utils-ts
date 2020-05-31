import { goblMarker } from './gobl';
const ACTION_UNKNOWN = 0, ACTION_SAVING = 1, ACTION_DELETING = 2, ACTION_UPDATING = 3;
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
        this._action = ACTION_UNKNOWN;
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
     * Checks is the entity is clean.
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
            this._action = set ? ACTION_SAVING : ACTION_UNKNOWN;
        }
        return this._action === ACTION_SAVING;
    }
    /**
     * Checks if the entity is being deleted.
     *
     * @param set When true the state will be set to deleting.
     */
    isDeleting(set) {
        if (arguments.length) {
            this._action = set ? ACTION_DELETING : ACTION_UNKNOWN;
        }
        return this._action === ACTION_DELETING;
    }
    /**
     * Checks if the entity is being updated.
     *
     * @param set When true the state will be set to updating.
     */
    isUpdating(set) {
        if (arguments.length) {
            this._action = set ? ACTION_UPDATING : ACTION_UNKNOWN;
        }
        return this._action === ACTION_UPDATING;
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
}
//# sourceMappingURL=GoblEntity.js.map