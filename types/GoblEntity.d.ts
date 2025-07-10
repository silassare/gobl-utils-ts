import { type GoblEntityData } from './gobl.js';
declare enum GoblEntityState {
    UNKNOWN = 0,
    SAVING = 1,
    DELETING = 2,
    UPDATING = 3
}
/**
 * GoblEntity class.
 */
export default abstract class GoblEntity {
    private readonly _name;
    private readonly _prefix;
    private readonly _columns;
    protected readonly _data: any;
    protected _cache: any;
    protected _state: GoblEntityState;
    protected constructor(_initialData: GoblEntityData | undefined, _name: string, _prefix: string, _columns: string[]);
    /**
     * Magic setter.
     *
     * @param column
     * @param value
     */
    protected _set(column: string, value: any): this;
    /**
     * Checks if the entity is clean.
     */
    isClean(): boolean;
    /**
     * Checks if the entity is saved.
     *
     * @param set When true the entity will be considered as saved.
     */
    isSaved(set?: boolean): boolean;
    /**
     * Checks if the entity is being saved.
     *
     * @param set When true the state will be set to saving.
     */
    isSaving(set?: boolean): boolean;
    /**
     * Checks if the entity is being deleted.
     *
     * @param set When true the state will be set to deleting.
     */
    isDeleting(set?: boolean): boolean;
    /**
     * Checks if the entity is being updated.
     *
     * @param set When true the state will be set to updating.
     */
    isUpdating(set?: boolean): boolean;
    /**
     * Hydrate the entity and set as saved when `save` is true
     */
    doHydrate(data: GoblEntityData, save?: boolean): this;
    /**
     * Returns current data in a clean new object
     *
     * if `diff` is true, returns modified columns only
     */
    toObject(diff?: boolean): GoblEntityData;
    /**
     * Returns some column values
     */
    toObjectSome(columns: string[]): GoblEntityData;
    /**
     * JSON helper
     */
    toJSON(): any;
    /**
     * Returns the entity cache key.
     *
     * `null` is returned when we can't have a valid cache key.
     */
    cacheKey(): string | null;
    /**
     * For backward compatibility
     */
    toInstance(data: GoblEntityData, cache?: boolean): this | undefined;
    /**
     * Returns the primary keys of the entity.
     */
    abstract identifierColumns(): string[];
}
export {};
//# sourceMappingURL=GoblEntity.d.ts.map