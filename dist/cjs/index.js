"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoblSinglePKEntity = exports.GoblEntity = void 0;
const GoblSinglePKEntity_js_1 = __importDefault(require("./GoblSinglePKEntity.js"));
exports.GoblSinglePKEntity = GoblSinglePKEntity_js_1.default;
const GoblEntity_js_1 = __importDefault(require("./GoblEntity.js"));
exports.GoblEntity = GoblEntity_js_1.default;
const gobl_js_1 = require("./gobl.js");
__exportStar(require("./gobl.js"), exports);
__exportStar(require("./GoblSinglePKEntity.js"), exports);
__exportStar(require("./GoblEntity.js"), exports);
const realJSONParse = JSON.parse, goblJSONParse = function (text, reviver) {
    return realJSONParse(text, function (key, value) {
        if (typeof reviver === 'function') {
            value = reviver(key, value);
        }
        const i = (0, gobl_js_1.toInstance)(value, true);
        if (i) {
            return i;
        }
        return value;
    });
};
JSON.parse = goblJSONParse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvRkFBeUQ7QUE0QnBDLDZCQTVCZCwrQkFBa0IsQ0E0QmM7QUEzQnZDLG9FQUF5QztBQTJCaEMscUJBM0JGLHVCQUFVLENBMkJFO0FBMUJuQix1Q0FBdUM7QUFDdkMsNENBQTBCO0FBQzFCLDBEQUF3QztBQUN4QyxrREFBZ0M7QUFFaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDL0IsYUFBYSxHQUFHLFVBQ2YsSUFBUyxFQUNULE9BQXVDO0lBRXZDLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUcsRUFBRSxLQUFLO1FBQzlDLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFLENBQUM7WUFDbkMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0IsQ0FBQztRQUVELE1BQU0sQ0FBQyxHQUFHLElBQUEsb0JBQVUsRUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUNQLE9BQU8sQ0FBQyxDQUFDO1FBQ1YsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHb2JsU2luZ2xlUEtFbnRpdHkgZnJvbSAnLi9Hb2JsU2luZ2xlUEtFbnRpdHkuanMnO1xuaW1wb3J0IEdvYmxFbnRpdHkgZnJvbSAnLi9Hb2JsRW50aXR5LmpzJztcbmltcG9ydCB7IHRvSW5zdGFuY2UgfSBmcm9tICcuL2dvYmwuanMnO1xuZXhwb3J0ICogZnJvbSAnLi9nb2JsLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vR29ibFNpbmdsZVBLRW50aXR5LmpzJztcbmV4cG9ydCAqIGZyb20gJy4vR29ibEVudGl0eS5qcyc7XG5cbmNvbnN0IHJlYWxKU09OUGFyc2UgPSBKU09OLnBhcnNlLFxuXHRnb2JsSlNPTlBhcnNlID0gZnVuY3Rpb24gKFxuXHRcdHRleHQ6IGFueSxcblx0XHRyZXZpdmVyPzogKGtleTogYW55LCB2YWx1ZTogYW55KSA9PiBhbnlcblx0KSB7XG5cdFx0cmV0dXJuIHJlYWxKU09OUGFyc2UodGV4dCwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcblx0XHRcdGlmICh0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR2YWx1ZSA9IHJldml2ZXIoa2V5LCB2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnN0IGkgPSB0b0luc3RhbmNlKHZhbHVlLCB0cnVlKTtcblx0XHRcdGlmIChpKSB7XG5cdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdmFsdWU7XG5cdFx0fSk7XG5cdH07XG5cbkpTT04ucGFyc2UgPSBnb2JsSlNPTlBhcnNlO1xuXG5leHBvcnQgeyBHb2JsRW50aXR5LCBHb2JsU2luZ2xlUEtFbnRpdHkgfTtcbiJdfQ==