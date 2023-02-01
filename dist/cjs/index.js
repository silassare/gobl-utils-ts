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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoblSinglePKEntity = exports.GoblEntity = void 0;
const GoblSinglePKEntity_js_1 = require("./GoblSinglePKEntity.js");
exports.GoblSinglePKEntity = GoblSinglePKEntity_js_1.default;
const GoblEntity_js_1 = require("./GoblEntity.js");
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
        if (Object.prototype.toString.call(value) === '[object Object]') {
            const i = (0, gobl_js_1.toInstance)(value, true);
            if (i) {
                return i;
            }
        }
        return value;
    });
};
JSON.parse = goblJSONParse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtRUFBeUQ7QUE4QnBDLDZCQTlCZCwrQkFBa0IsQ0E4QmM7QUE3QnZDLG1EQUF5QztBQTZCaEMscUJBN0JGLHVCQUFVLENBNkJFO0FBNUJuQix1Q0FBdUM7QUFDdkMsNENBQTBCO0FBQzFCLDBEQUF3QztBQUN4QyxrREFBZ0M7QUFFaEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFDL0IsYUFBYSxHQUFHLFVBQ2YsSUFBUyxFQUNULE9BQXVDO0lBRXZDLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUcsRUFBRSxLQUFLO1FBQzlDLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQ2xDLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVCO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssaUJBQWlCLEVBQUU7WUFDaEUsTUFBTSxDQUFDLEdBQUcsSUFBQSxvQkFBVSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsRUFBRTtnQkFDTixPQUFPLENBQUMsQ0FBQzthQUNUO1NBQ0Q7UUFFRCxPQUFPLEtBQUssQ0FBQztJQUNkLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR29ibFNpbmdsZVBLRW50aXR5IGZyb20gJy4vR29ibFNpbmdsZVBLRW50aXR5LmpzJztcbmltcG9ydCBHb2JsRW50aXR5IGZyb20gJy4vR29ibEVudGl0eS5qcyc7XG5pbXBvcnQgeyB0b0luc3RhbmNlIH0gZnJvbSAnLi9nb2JsLmpzJztcbmV4cG9ydCAqIGZyb20gJy4vZ29ibC5qcyc7XG5leHBvcnQgKiBmcm9tICcuL0dvYmxTaW5nbGVQS0VudGl0eS5qcyc7XG5leHBvcnQgKiBmcm9tICcuL0dvYmxFbnRpdHkuanMnO1xuXG5jb25zdCByZWFsSlNPTlBhcnNlID0gSlNPTi5wYXJzZSxcblx0Z29ibEpTT05QYXJzZSA9IGZ1bmN0aW9uIChcblx0XHR0ZXh0OiBhbnksXG5cdFx0cmV2aXZlcj86IChrZXk6IGFueSwgdmFsdWU6IGFueSkgPT4gYW55XG5cdCkge1xuXHRcdHJldHVybiByZWFsSlNPTlBhcnNlKHRleHQsIGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dmFsdWUgPSByZXZpdmVyKGtleSwgdmFsdWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcblx0XHRcdFx0Y29uc3QgaSA9IHRvSW5zdGFuY2UodmFsdWUsIHRydWUpO1xuXHRcdFx0XHRpZiAoaSkge1xuXHRcdFx0XHRcdHJldHVybiBpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWx1ZTtcblx0XHR9KTtcblx0fTtcblxuSlNPTi5wYXJzZSA9IGdvYmxKU09OUGFyc2U7XG5cbmV4cG9ydCB7IEdvYmxFbnRpdHksIEdvYmxTaW5nbGVQS0VudGl0eSB9O1xuIl19