import { GoblEntity } from './GoblEntity.js';

export abstract class GoblSinglePKEntity extends GoblEntity {
	abstract singlePKValue(): string;
}
