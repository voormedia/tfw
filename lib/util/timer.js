"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Timer {
    constructor(time) {
        this.time = time;
    }
    clear() {
        if (this.timer)
            clearTimeout(this.timer);
    }
    async sleep() {
        return new Promise(resolve => {
            this.timer = setTimeout(resolve, this.time);
        });
    }
}
exports.Timer = Timer;
//# sourceMappingURL=timer.js.map