"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultDuration = exports.setDefaultDuration = exports.defaultDuration = void 0;
exports.defaultDuration = 60 * 1000;
function setDefaultDuration(duration) {
    exports.defaultDuration = duration;
}
exports.setDefaultDuration = setDefaultDuration;
function getDefaultDuration() {
    return exports.defaultDuration;
}
exports.getDefaultDuration = getDefaultDuration;
