# hyperfun component

Has been designed to be used in those cases when is needed to re-render a part of the app or when an action has to be executed in the life cycle. It uses @hyperfun/dom as a dependency to render and update the DOM tree.

## Element

Used to manage an element lifecycle. The update would be only executed from outside with new props. Once the rendered element is removed from the DOM, will be executed detached. 
A basic use case could be to add and remove listeners.

### API

- render: in charge of rendering the element
- attached: executed after the element has been created in the DOM 
- updated: will be executed after the first render and a new prop is added
- detached: executed once the rendered element is removed from the dom
- shouldUpdate: could be used to control the updates. It would rewrite the internal shouldUpdate who does a shallow equal check between old and new props 

### Example

```
import { element } from '@hyperfun/component';
import { p } from '@hyperfun/dom';

const el = element(
    (newProps) => p(['Element']),
    {
        attached: (element: HTMLElement) => console.log('attached', element),
        updated: (nextProps, prevProps) => console.log('updated', nextProps, prevProps),
        detached: (element: HTMLElement) => console.log('attached', element),
        shuldUpdate: shouldUpdate(nextProps, prevProps) => console.log('shuldUpdate'), 
    }
);
```

## Component

Should be instantiated in the container to manage its lifecycle. After be instantiated the update would be from inside the component updating the state and from outside receiving new props.

### API

- render: in charge of rendering the element
- attached: executed after the element has been created in the DOM
- updated: will be executed after the first render and a new prop is added
- detached: executed once the rendered element is removed from the dom
- shouldUpdate: could be used to control the updates. It would rewrite the internal shouldUpdate who does a shallow equal check between old and new props
- state: Used to define the internal state
- setState: Used to update the internal state
 
### Example

```
import { Component, element } from '@hyperfun/component';
import { p } from '@hyperfun/dom';

const el = element(
    (newProps) => p(['Element']),
    {
        attached: (element: HTMLElement) => console.log('attached'),
        updated: (nextProps, prevProps) => console.log('updated'),
        detached: () => console.log('detached'),
        shuldUpdate: shouldUpdate(nextProps, prevProps) => console.log('shuldUpdate'), 
    }
);

class MyComponent extend Component {
    public props: MyComponentProps;
    public state = {
        testState: ''
    };

    public attached() {
        console.log('attached');
        this.setState(() => ({ testState: 'Test' ));
    }

    public updated() {
        console.log('updated');
    }

    public detached() {
        console.log('detached');
    }

    public render() {
        return el();
    }
}
```

## Container

Used to instantiate a component, initialize the component lifecycle and allow add props to the component.

```
import { connect } from '@hyperfun/run';
import { Component, container, element } from '@hyperfun/component';
import { p } from '@hyperfun/dom';

const el = element(
    (newProps) => p(['Element']),
    {
        attached: (element: HTMLElement) => console.log('attached'),
        updated: (nextProps, prevProps) => console.log('updated'),
        detached: () => console.log('detached'),
        shuldUpdate: shouldUpdate(nextProps, prevProps) => console.log('shuldUpdate'), 
    }
);

class MyComponent extend Component {
    public props: MyComponentProps;
    public state = {};

    public attached() {
        console.log('attached');
        this.setState(() => ({ testState: 'Test' ));
    }

    public updated() {
        console.log('updated');
    }

    public detached() {
        console.log('detached');
    }

    public render() {
        return el(this.props.testProp);
    }
}

const myContainer = container(MyComponent);
const myComponent = () => connect((props: MyComponentProps) => ({ testProp: 'test' }))(myContainer);
```

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
