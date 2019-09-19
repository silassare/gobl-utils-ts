export declare type tGoblEntityData = {
    [key: string]: any;
};
export declare type tGoblCache<T> = {
    [key: string]: T;
};
/**
 * GoblEntity class.
 */
export declare abstract class GoblEntity {
    private readonly _name;
    private readonly _prefix;
    private readonly _columns;
    protected readonly _data: any;
    protected _cache: any;
    protected _action: number;
    protected constructor(_initial_data: tGoblEntityData | undefined, _name: string, _prefix: string, _columns: string[]);
    /**
     * Magic setter.
     *
     * @param column
     * @param value
     */
    protected _set(column: string, value: any): this;
    /**
     * Checks is the entity is clean.
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
    doHydrate(data: tGoblEntityData, save?: boolean): this;
    /**
     * Returns current data in a clean new object
     *
     * if `diff` is true, returns modified columns only
     */
    toObject(diff?: boolean): tGoblEntityData;
    /**
     * Returns some column values
     */
    toObjectSome(columns: string[]): tGoblEntityData;
    /**
     * JSON helper
     */
    toJSON(): any;
    /**
     * Try to identify and instantiate the entity class that best matches the given data.
     *
     * @param data
     * @param cache
     */
    static toInstance(data: tGoblEntityData, cache?: boolean): GoblEntity | undefined;
    /**
     * Returns a given entity cache.
     *
     * @param entity
     */
    static subCache(entity: string): tGoblCache<GoblEntity> | undefined;
    /**
     * Returns the entity cache key.
     *
     * `null` is returned when we can't have a valid cache key.
     */
    cacheKey(): string | null;
    /**
     * Returns the primary keys of the entity.
     */
    abstract identifierColumns(): string[];
}
export declare abstract class GoblSinglePKEntity extends GoblEntity {
    abstract singlePKValue(): string;
}
export declare const register: (name: string, entity: typeof GoblEntity) => void;
export declare const getEntityCache: (entity_name: string) => tGoblCache<GoblEntity>;
export declare const c_bool: (v: any) => boolean;
export declare const c_int: (v: any) => number;
export declare const c_string: (v: any) => string;
