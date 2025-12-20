"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDuration = void 0;
exports.setDefaultDuration = setDefaultDuration;
exports.getDefaultDuration = getDefaultDuration;
exports.defaultDuration = 60 * 1000;
function setDefaultDuration(duration) {
    exports.defaultDuration = duration;
}
function getDefaultDuration() {
    return exports.defaultDuration;
}
