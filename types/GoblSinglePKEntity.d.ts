import GoblEntity from './GoblEntity';
export default abstract class GoblSinglePKEntity extends GoblEntity {
    abstract singlePKValue(): string;
}
