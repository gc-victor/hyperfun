import * as IncrementalDOM from 'incremental-dom';
import * as IncrementalDOMString from 'incremental-dom-string';

const scope = typeof exports !== 'undefined' && typeof global !== 'undefined' ? global : window;
// @ts-ignore
if (!scope.IncrementalDOM) {
    // @ts-ignore
    scope.IncrementalDOM = IncrementalDOM;
}

// @ts-ignore
global.IncrementalDOM = IncrementalDOMString;
