import GoblSinglePKEntity from './GoblSinglePKEntity.js';
import GoblEntity from './GoblEntity.js';
import { toInstance } from './gobl.js';
export * from './gobl.js';
export * from './GoblSinglePKEntity.js';
export * from './GoblEntity.js';
const realJSONParse = JSON.parse, goblJSONParse = function (text, reviver) {
    return realJSONParse(text, function (key, value) {
        if (typeof reviver === 'function') {
            value = reviver(key, value);
        }
        const i = toInstance(value, true);
        if (i) {
            return i;
        }
        return value;
    });
};
JSON.parse = goblJSONParse;
export { GoblEntity, GoblSinglePKEntity };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxrQkFBa0IsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLFVBQVUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3ZDLGNBQWMsV0FBVyxDQUFDO0FBQzFCLGNBQWMseUJBQXlCLENBQUM7QUFDeEMsY0FBYyxpQkFBaUIsQ0FBQztBQUVoQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUMvQixhQUFhLEdBQUcsVUFDZixJQUFTLEVBQ1QsT0FBdUM7SUFFdkMsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFLEtBQUs7UUFDOUMsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUNuQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQ1AsT0FBTyxDQUFDLENBQUM7UUFDVixDQUFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0FBRTNCLE9BQU8sRUFBRSxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHb2JsU2luZ2xlUEtFbnRpdHkgZnJvbSAnLi9Hb2JsU2luZ2xlUEtFbnRpdHkuanMnO1xuaW1wb3J0IEdvYmxFbnRpdHkgZnJvbSAnLi9Hb2JsRW50aXR5LmpzJztcbmltcG9ydCB7IHRvSW5zdGFuY2UgfSBmcm9tICcuL2dvYmwuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nb2JsLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vR29ibFNpbmdsZVBLRW50aXR5LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vR29ibEVudGl0eS5qcyc7XG5cbmNvbnN0IHJlYWxKU09OUGFyc2UgPSBKU09OLnBhcnNlLFxuXHRnb2JsSlNPTlBhcnNlID0gZnVuY3Rpb24gKFxuXHRcdHRleHQ6IGFueSxcblx0XHRyZXZpdmVyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiBhbnlcblx0KSB7XG5cdFx0cmV0dXJuIHJlYWxKU09OUGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdGlmICh0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR2YWx1ZSA9IHJldml2ZXIoa2V5LCB2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGkgPSB0b0luc3RhbmNlKHZhbHVlLCB0cnVlKTtcblx0XHRcdGlmIChpKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH07XG5cbkpTT04ucGFyc2UgPSBnb2JsSlNPTlBhcnNlO1xuXG5leHBvcnQgeyBHb2JsRW50aXR5LCBHb2JsU2luZ2xlUEtFbnRpdHkgfTtcbiJdfQ==