# hyperfun run

Template agnostic package to create unidirectional user interface architecture.

## Run

Initialize the application.

```run({ view, render, state, plugins })```

### API

- view: DOM/VDom tree to attach to the DOM. It will receive as an argument the new state
- render: Has being designed render your template. It will receive as argument the new view, and after the first render the options defined in the update as a second argument
- state: definition of the initial store
- plugins: list of middlewares that could be used to change the render, state or view definitions
    - subscriptions: will be executed once after the first render of the view
    - willUpdate: will be executed on each update and is invoked immediately before rendering. Can be used to mutate the state

### Example

```
import { run } from '@hyperfun/run';
import { div, h1, patch } from '@hyperfun/dom';
import { localStorage, logs } from './plugins';

/* State */

const state = {};

/* View */

const view = () => div('#app', [h1(['Bye, bey!'])])

/* Render */

const render = (node, options = {}) =>
    patch(document.getElementById('app'), node);

run({
    view,
    render,
    state,
    plugins: [localStorage, logs],
});
```

## Update

Updates the global store.

```
update({
   type: 'TYPE_NAME',
   payload: state => ({ ...state, text: 'Hello world!' }),
   options: {
        element: () => document.querySelector('.js-selector'),
        view: ({ text }) => h1('.js-selector', [text]),
    },
})
```

### API

- type: indicates the type of action being performed (required),
- payload: sends data from the update to the store (required),
- options (none required)
    - element: DOM element where the view is going to be attached
    - view: component/element to be attached to the DOM

### Example

```
import { run, update } from '@hyperfun/run';
import { button, h1, p } from '@hyperfun/dom';

/* State */

const state = {};

/* View */

const helloWorld = () =>
    update({
        type: 'HELLO_WORLD',
        payload: state => ({ hello: 'world' }),
        options: {
             element: () => document.querySelector('.js-helloWorld'),
             view: () => h1('.js-helloWorld', ['Hello world!']),
         },
    });

const view = () => div('#app', [
    h1('.js-helloWorld', ['Bye bey!']),
    p([
        button({ onClick: helloWorld }, ['Add hello world'])
    ])
])

/* Render */

const render = (node: Function, options: RenderOptions = {}) =>
    patch(options.element ? options.element() : document.getElementById('app'), node);

/* Run */

run({
    view,
    render,
    state,
    plugins,
});
```

## Connect

It will inject into the component any new update of the state.

```
connect([mapStateToProps])(component)
```

### API

- mapStateToProps: map new state changes with properties
- component: component to be executed on every state update

### Example 

```
import { connect, run, update } from '@hyperfun/run';
import { button, h1, p } from '@hyperfun/dom';

/* State */

const state = {};

/* View */

const helloWorld = () =>
    update({
        type: 'HELLO_WORLD',
        payload: state => ({ hello: 'world' }),
        options: {
             element: () => document.querySelector('.js-helloWorld'),
             view: () => h1('.js-helloWorld', ['Hello world!']),
         },
    });

const helloWorldView = ({ hello, state }) => div('#app', [
    h1('.js-helloWorld', ['Bye bey!']),
    p([
        button({ onClick: helloWorld }, ['Add hello world'])
    ])
])

const view = (): any =>
    div('#app', [
        connect(state => ({ hello: 'world', state }))(helloWorldView)
    ]);

/* Render */

const render = (node: Function, options: RenderOptions = {}) =>
    patch(options.element ? options.element() : document.getElementById('app'), node);

/* Run */

run({
    view,
    render,
    state,
    plugins,
});
```

## References

- https://github.com/hyperapp/hyperapp
- https://guide.elm-lang.org/architecture/
- https://staltz.com/unidirectional-user-interface-architectures.html#elm

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
-   Clone your fork: `git clone https://github.com/<your-username>/hyperfun`
-   Navigate to the newly cloned directory: `cd hyperfun`
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
