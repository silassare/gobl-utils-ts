import GoblEntity from './GoblEntity.js';
export declare const GOBL_ENTITY_MARKER = "__gobl__";
export type GoblEntityData = {
    [key in typeof GOBL_ENTITY_MARKER]?: string;
} & {
    [key: string]: any;
};
/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param includeCache
 */
export declare const toInstance: <T extends GoblEntity = GoblEntity>(data: GoblEntityData, addToCache?: boolean) => T | undefined;
export declare function register(name: string, entity: typeof GoblEntity): void;
/**
 * A reviver for `JSON.parse` that turns serialized entities (with the marker, or recognized from their
 * columns) into instances of the registered entity classes, cached.
 */
export declare function goblJSONReviver(_key: string, value: any): any;
/**
 * `JSON.parse` that revives entities ({@link goblJSONReviver}), after the given reviver if any.
 */
export declare function parseGoblJSON(text: string, reviver?: (key: string, value: any) => any): any;
export declare function getEntityCache<T extends GoblEntity = GoblEntity>(entityName: string): Map<string, T> | undefined;
export declare function _bool(v: any): boolean | null;
export declare function _int(v: any): number | null;
export declare function _string(v: any): string;
//# sourceMappingURL=gobl.d.ts.map