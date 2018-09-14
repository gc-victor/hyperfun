export function logs() {
    return {
        willUpdate: [
            ({ type, newState, options, mutation }) => {
                const now = () => new Date().toLocaleTimeString();

                console.groupCollapsed(`%c update ${type} - ${now()}`, `color: #999`);
                console.log(`%c type`, `color: #9E9E9E`, type);
                console.log(`%c mutation`, `color: #4CAF50`, mutation);
                console.log(`%c newState`, `color: #03A9F4`, newState);
                console.log(`%c options`, `color: #9E9E9E`, options);
                console.groupEnd();
            },
        ],
    };
}
