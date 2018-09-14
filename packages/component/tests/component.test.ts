#!/usr/bin/env ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { Component, element, container } from '../src/component';
import { NextProps, Props } from '../types';
import {shallowEqual} from '../src/shallow-equal';

test('should set the state', (t: any) => {
    let newState;

    const testComponent = element((nextProps: NextProps) => {
        newState = nextProps;

        return () => 'Element';
    });
    const setState = { test: 'first render' };

    testComponent({ ...setState });

    t.deepEqual(newState, setState);
    t.end();
});

test('should return the render value', (t: any) => {
    const testComponent = element(() => () => 'Element');
    const render = testComponent();

    t.equal(render(), 'Element');
    t.end();
});

test('should render if is the first render', (t: any) => {
    let renderOptions = { skip: '', firstUpdate: '' };

    const testComponent = element(() => (options: any) => (renderOptions = options));

    testComponent()();

    t.equal(
        JSON.stringify({ skip: renderOptions.skip, firstUpdate: renderOptions.firstUpdate }),
        '{"skip":false,"firstUpdate":true}'
    );
    t.end();
});

test('should re-render if the second render updates the state', (t: any) => {
    let renderOptions = { skip: '', firstUpdate: '' };

    const testComponent = element(() => (options: any) => (renderOptions = options));
    const setState = { test: 'first render' };
    const render = (nextProps: NextProps) => testComponent({ nextProps })();

    render(setState); // first render
    render({ test: 'second' });

    t.equal(
        JSON.stringify({ skip: renderOptions.skip, firstUpdate: renderOptions.firstUpdate }),
        '{"skip":false,"firstUpdate":false}'
    );
    t.end();
});

test('should not skip the re-render if the state does not change and is not the first render', (
    t: any
) => {
    let renderOptions = { skip: '', firstUpdate: '' };

    const componentOptions = {
        state: { test: 'initial state' },
    };
    const testComponent = element(() => (options: any) => (renderOptions = options));
    const render = (nextProps: NextProps) => testComponent({ nextProps })();

    render(componentOptions.state);
    render(componentOptions.state);

    t.equal(
        JSON.stringify({ skip: renderOptions.skip, firstUpdate: renderOptions.firstUpdate }),
        '{"skip":true,"firstUpdate":false}'
    );
    t.end();
});

test('should force update even if is used the same props in the second render', (t: any) => {
    let renderOptions = { skip: '', firstUpdate: '' };

    const testComponent = element(() => (options: any) => (renderOptions = options));
    const firstProps = { test: 'first render' };
    const render = (nextProps: NextProps) => testComponent({ nextProps }, { forceUpdate: true })();

    render(firstProps);
    render(firstProps);

    t.equal(
        JSON.stringify({ skip: renderOptions.skip, firstUpdate: renderOptions.firstUpdate }),
        '{"skip":false,"firstUpdate":false}'
    );
    t.end();
});

test('should has attached an element as an argument', (t: any) => {
    let reference: any;

    const elementValue = 'Element';
    const testComponent = element(() => (options: any) => {
        // Note: elementAttached has to be executed once the render returns its value
        setTimeout(() => options.elementAttached());

        return elementValue;
    }, {
        attached(ref: any) {
            reference = ref;
        },
    });
    const setState = { test: 'first render' };
    const render = (nextProps: NextProps) => testComponent({ nextProps })();

    render(setState); // first render

    setTimeout(() => {
        t.equal(reference, elementValue);
        t.end();
    });
});

test('should have life cycle', (t: any) => {
    const lifeCycle: any[] = [];

    const testComponent = element(() => (options: any) => {
        options.elementAttached();
        options.elementUpdated();
        lifeCycle.length === 2 && options.elementDetached();
    }, {
        attached() {
            lifeCycle.push('attached');
        },
        updated() {
            lifeCycle.push('updated');
        },
        detached() {
            lifeCycle.push('detached');
        },
    });
    const setState = { test: 'first render' };
    const render = (nextProps: NextProps) => testComponent({ nextProps })();

    render(setState); // first render
    render({ test: 'second' });

    t.deepEqual(lifeCycle, ['attached', 'updated', 'detached']);
    t.end();
});

test('should render if is the first render', (t: any) => {
    let firstUpdate;

    class Test extends Component {
        public state = { test: 'first render' };
        public attached() {}
        public updated() {}
        public detached() {}
        public shouldUpdate() {
            return true;
        }
        public render() {
            return (options: any = {}) => {
                firstUpdate = options.firstUpdate;
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();
    const firstProps = { test: 'first render' };

    render(firstProps);

    t.equal(true, firstUpdate);
    t.end();
});

test('should not re-render if should update returns false', (t: any) => {
    let props;

    class Test extends Component {
        public state = { test: 'first render' };
        public shouldUpdate() {
            return false;
        }
        public render(nextProps: NextProps) {
            props = nextProps;

            return () => {};
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();
    const firstProps = { test: 'first render' };

    render(firstProps);
    render({ test: 'second render' });

    t.equal(props, firstProps);
    t.end();
});

test('should re-render if should update returns true', (t: any) => {
    let skip;

    class Test extends Component {
        public state = { test: 'first render' };
        public shouldUpdate() {
            return true;
        }
        public render() {
            return (options: any = {}) => {
                skip = options.skip;
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();
    const firstProps = { test: 'first render' };

    render(firstProps);
    render(firstProps);

    t.equal(skip, false);
    t.end();
});

test('should executed only the first render attached', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public state = { test: 'initial render' };
        public attached() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.elementAttached();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({ test: 'first render' });
    render({ test: 'second render' });
    render({ test: 'third render' });

    t.equal(counter, 1);
    t.end();
});

test('should execute updated after the second render', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public state = { test: 'initial render' };
        public attached() {}
        public updated() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.elementUpdated();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({ test: 'first render' });
    render({ test: 'second render' });
    render({ test: 'third render' });

    t.equal(counter, 2);
    t.end();
});

test('should not execute updated as skip is true', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public state = { test: 'initial render' };
        public updated() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.skip === false && options.elementUpdated();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({ test: 'first render' });
    render({ test: 'first render' });
    render({ test: 'first render' });

    t.equal(counter, 0);
    t.end();
});

test('should updated have access to the state and props', (t: any) => {
    let stateAndProps;

    const firstState = { test: 'first render' };
    const secondProps = { test: 'second render' };
    const thirdProps = { test: 'third render' };

    class Test extends Component {
        public state = firstState;
        public updated() {
            stateAndProps = { state: this.state, props: this.props };
        }
        public render() {
            return (options: any = {}) => {
                options.elementUpdated();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render(secondProps);
    render(thirdProps);

    t.deepEqual(stateAndProps, { state: firstState, props: thirdProps });
    t.end();
});

test('should execute detached when is executed elementDetached', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public detached() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.elementDetached();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({});

    t.equal(counter, 1);
    t.end();
});

test('should set the state', (t: any) => {
    let state;
    const setState = { test: 'set state' };

    class Test extends Component {
        public attached() {
            this.setState(() => setState);
        }

        public render() {
            return (options: any = {}) => {
                options.elementAttached();

                state = this.state;
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({});

    t.deepEqual(state, setState);
    t.end();
});

test('should execute custom function', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public attached() {
            this.custom();
        }

        public custom() {
            counter = counter + 1;
        }

        public render() {
            return (options: any = {}) => {
                options.elementAttached();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps)();

    render({});

    t.equal(counter, 1);
    t.end();
});

test('should create an instance of the component', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public attached() {
            this.custom();
        }
        public custom() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.elementAttached();
            };
        }
    }

    const testContainer = container(Test);
    const render = (nextProps: NextProps) => testContainer(nextProps);

    render({})();
    render({})();

    t.equal(counter, 1);
    t.end();
});

test('should create multiple instances of the component', (t: any) => {
    let counter = 0;

    class Test extends Component {
        public attached() {
            counter = counter + 1;
        }
        public render() {
            return (options: any = {}) => {
                options.elementAttached();
            };
        }
    }

    const testContainerFirst = container(Test);
    const testContainerSecond = container(Test);

    testContainerFirst({ test1: true })();
    testContainerSecond({ test2: true })();

    t.equal(counter, 2);
    t.end();
});
