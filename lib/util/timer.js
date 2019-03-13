"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    constructor(time) {
        this.time = time;
    }
    sleep() {
        return new Promise((resolve) => {
            this.timer = setTimeout(resolve, this.time);
        });
    }
    clear() {
        clearTimeout(this.timer);
    }
}
exports.Timer = Timer;
exports.default = Timer;
//# sourceMappingURL=timer.js.map