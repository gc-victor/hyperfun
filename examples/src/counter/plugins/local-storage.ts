export function localStorage(options) {
    const store = window.localStorage;
    const key = 'hyperfun-counter';

    Object.assign(options.state, JSON.parse(store.getItem(key) as string));

    return {
        willUpdate: [
            ({ newState }) => store.setItem(key, JSON.stringify(newState)),
        ],
    };
}
