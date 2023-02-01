import GoblEntity, { GoblEntityData } from './GoblEntity.js';
export declare const gobl: any, goblMarker = "__gobl__", goblCache: {
    [entity: string]: {
        [key: string]: GoblEntity;
    };
}, goblClassMagicMap: {
    [key: string]: string;
}, 
/**
 * Try to identify and instantiate the entity class that best matches the given data.
 *
 * @param data
 * @param cache
 */
toInstance: (data: GoblEntityData, cache?: boolean) => GoblEntity | undefined;
export declare const register: (name: string, entity: typeof GoblEntity) => void;
export declare const getEntityCache: (entityName: string) => {
    [key: string]: GoblEntity;
};
export declare const _bool: (v: any) => boolean;
export declare const _int: (v: any) => number;
export declare const _string: (v: any) => string;
