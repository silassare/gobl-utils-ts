import GoblSinglePKEntity from './GoblSinglePKEntity.js';
import GoblEntity from './GoblEntity.js';
import { toInstance } from './gobl';
export * from './gobl.js';
export * from './GoblSinglePKEntity.js';
export * from './GoblEntity.js';

const realJSONParse = JSON.parse,
	goblJSONParse = function (
		text: any,
		reviver?: (key: any, value: any) => any
	) {
		return realJSONParse(text, function (key, value) {
			if (typeof reviver === 'function') {
				value = reviver(key, value);
			}

			if (Object.prototype.toString.call(value) === '[object Object]') {
				const i = toInstance(value, true);
				if (i) {
					return i;
				}
			}

			return value;
		});
	};

JSON.parse = goblJSONParse;

export { GoblEntity, GoblSinglePKEntity };
