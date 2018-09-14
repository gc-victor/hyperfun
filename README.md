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

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

- MAJOR version when you make backwards-incompatible updates of any kind
- MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone https://github.com/<your-username>/run`
-   Navigate to the newly cloned directory: `cd run`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/hyperfun/blob/master/LICENSE.md)
