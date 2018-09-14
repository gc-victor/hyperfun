# hyperfun

Tiny JavaScript packages to build Front End applications.

## Packages

| Package | Version | Dependencies | DevDependencies |
|--------|-------|------------|----------|
| run | [![npm](https://img.shields.io/npm/v/@hyperfun/run.svg)](http://npm.im/@hyperfun/run)  | [![dependencies Status](https://david-dm.org/gc-victor/hyperfun/status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom) | [![devDependencies Status](https://david-dm.org/gc-victor/hyperfun/dev-status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom&type=dev) |
| router | [![npm](https://img.shields.io/npm/v/@hyperfun/router.svg)](http://npm.im/@hyperfun/router) | [![dependencies Status](https://david-dm.org/gc-victor/hyperfun/status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom) | [![devDependencies Status](https://david-dm.org/gc-victor/hyperfun/dev-status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom&type=dev) |
| dom | [![npm](https://img.shields.io/npm/v/@hyperfun/dom.svg)](http://npm.im/@hyperfun/dom) | [![dependencies Status](https://david-dm.org/gc-victor/hyperfun/status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom) | [![devDependencies Status](https://david-dm.org/gc-victor/hyperfun/dev-status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom&type=dev) |
| component | [![npm](https://img.shields.io/npm/v/@hyperfun/component.svg)](http://npm.im/@hyperfun/component) | [![dependencies Status](https://david-dm.org/gc-victor/hyperfun/status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom) | [![devDependencies Status](https://david-dm.org/gc-victor/hyperfun/dev-status.svg?path=dom)](https://david-dm.org/gc-victor/hyperfun?path=dom&type=dev) |

- **run**: template agnostic package to create an unidirectional user interface architecture
- **router**: hyperfun plugin to integrate a router in your hyperfun applications
- **dom**: Hyper Script Helpers and Incremental DOM/String mixed to create a template engine that can be rendered on the server and the client
- **component**: designed to be used in those cases when is needed to re-render a part of the app or when an action has to be executed in the life cycle. It uses Incremental DOM as a dependency to render and update the DOM tree

## Example:

```
import { run, update } from '@hyperfun/run';
import { h1, li, p, patch, ul } from '@hyperfun/dom';

/* Types */

interface CounterState {
    counter: number;
}

/* State */

const state: CounterState = {
    counter: 0
};

/* Update */

const increment = () =>
    update({
        type: 'INCREMENT_COUNTER',
        payload: (state: State) => ({ counter: state.counter + 1 }),
    });
const decrement = () =>
    update({
        type: 'DECREMENT_COUNTER',
        payload: (state: State) => ({ counter: state.counter - 1 }),
    });
const reset = () =>
    update({
        type: 'RESET_COUNTER',
        payload: () => ({ counter: 0 }),
    });

/* View */

const counter = (state: CounterState) => p([state.counter]);

const view: View = (state: CounterState) =>
    section([
        counter(state),
        ul([
            li([button({ onClick: increment }, 'Increase')]),
            li([button({ onClick: decrement }, 'Decrement')]),
            li([button({ onClick: reset }, 'Reset')]),
        ])
    ]);

/* Render */

const render = (element, options) =>
    patch(options.element ? options.element() : document.getElementById('app'), element);

/* Run */

run({
    view,
    render,
    state
});
```

You can find more examples in the examples folder.

## References

- [hyperapp](https://github.com/hyperapp/hyperapp)
- [cycle.js](https://github.com/cyclejs/cyclejs)
- [Unidirectional user interface architectures](https://staltz.com/unidirectional-user-interface-architectures.html)
