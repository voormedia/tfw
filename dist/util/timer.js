export class Timer {
    time;
    timer;
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
//# sourceMappingURL=timer.js.map