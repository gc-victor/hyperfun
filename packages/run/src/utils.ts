export function clone(state: Object) {
    return JSON.parse(JSON.stringify(state));
}
