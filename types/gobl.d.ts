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
export declare function getEntityCache<T extends GoblEntity = GoblEntity>(entityName: string): Map<string, T> | undefined;
export declare function _bool(v: any): boolean;
export declare function _int(v: any): number;
export declare function _string(v: any): string;
//# sourceMappingURL=gobl.d.ts.map