import GoblEntity from './GoblEntity.js';
export default abstract class GoblSinglePKEntity extends GoblEntity {
    abstract singlePKValue(): string;
}
