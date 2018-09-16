// @see: https://github.com/cyclejs/cyclejs/blob/master/run/src/microtask.ts
export function microtask(): (fn: Function) => void {
    if (typeof MutationObserver !== 'undefined') {
        // tslint:disable-next-line:no-shadowed-variable
        let i = 0;

        const node: any = document.createTextNode('');
        const queue: Array<Function> = [];

        new MutationObserver(function () {
            while (queue.length) {
                (queue.shift() as Function)();
            }
        }).observe(node, { characterData: true });

        return function (fn: Function) {
            queue.push(fn);
            node.data = i = 1 - i;
        };
    } else if (typeof process !== 'undefined') {
        return process.nextTick;
    } else {
        return setTimeout;
    }
}
