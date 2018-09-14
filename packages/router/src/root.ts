// @see: https://github.com/purposeindustries/window-or-global/
export const root: any =
    (typeof self === 'object' && self.self === self && self) ||
    (typeof global === 'object' && global.global === global && global) ||
    window;
