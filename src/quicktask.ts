// https://github.com/staltz/quicktask/blob/master/index.ts
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask#When_queueMicrotask_isnt_available
// https://morioh.com/p/4ca3c63dbc0c
const getGlobal = () => {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    throw new Error('Unable to locate global object');
};

const globalThis: any = getGlobal();

if (typeof globalThis.queueMicrotask !== 'function') {
    globalThis.queueMicrotask = function queueMicrotask(callback: any) {
        if (globalThis.Promise) {
            Promise.resolve()
                .then(callback)
                .catch((e) =>
                    setTimeout(() => {
                        throw e;
                    })
                );
        } else if (typeof process !== 'undefined') {
            return process.nextTick(callback);
        } else {
            return setTimeout(callback);
        }
    };
}

export function quicktask() {
    return (fn: (arg?: any) => void) => globalThis.queueMicrotask(fn);
}
