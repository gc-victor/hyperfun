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
