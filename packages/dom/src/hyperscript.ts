import {
    attrIDom,
    elementCloseIDom,
    elementOpenEndIDom,
    elementOpenStartIDom,
    textIDom,
    skipIDom,
} from './incremental-dom';
import { HyperScriptChildren, HyperScriptFn, Props } from '../types';
import { HyperScriptNode } from '../types';

const SSR = process.env.SSR === 'true';

export const hyperScript: HyperScriptFn = function h(
    tagName: string,
    firstParam: any,
    secondParam: any
): Function {
    const outerArgs = arguments;
    const childrenOrText: HyperScriptChildren = secondParam;

    let props: Props = {};
    let children: any;

    if (childrenOrText || typeof childrenOrText === 'boolean') {
        props = firstParam;

        if (Array.isArray(childrenOrText)) {
            children = childrenOrText;
        } else if (isPrimitive(childrenOrText)) {
            children = String(childrenOrText);
        } else {
            throw new Error('Second parameter has to be an array, string or number');
        }
    } else if (firstParam) {
        const childrenOrTextOrProps = firstParam;

        if (Array.isArray(childrenOrTextOrProps)) {
            children = childrenOrTextOrProps;
        } else if (isPrimitive(childrenOrTextOrProps)) {
            children = String(childrenOrTextOrProps);
        } else {
            props = childrenOrTextOrProps;
        }
    }

    const names = Object.keys(props);
    const length = names.length;

    function render(
        options: {
            skip: boolean;
            firstUpdate: boolean;
            elementAttached?: Function;
            elementDetached?: Function;
            elementUpdated?: Function;
        } = { skip: false, firstUpdate: false }
    ) {
        let element;

        const elementAttached = props.elementAttached || options.elementAttached;
        const elementDetached = props.elementDetached || options.elementDetached;
        const elementUpdated = props.elementUpdated || options.elementUpdated;
        const firstUpdate = props.firstUpdate || options.firstUpdate;
        const skip = props.skip || options.skip;

        elementOpenStartIDom(tagName, props['key']);
        setAttributes({ props, names, length });
        elementOpenEndIDom();

        if (skip) {
            skipIDom();

            element = elementCloseIDom(tagName);
        } else {
            if (isPrimitive(children)) {
                renderChild(children);
            } else if (Array.isArray(children)) {
                children.forEach(renderChild);
            } else {
                forEachChildInArgs(outerArgs, renderChild);
            }

            element = elementCloseIDom(tagName) || {};
            element._elementAttached = elementAttached;
            element._elementDetached = elementDetached;

            if (elementUpdated && !firstUpdate) {
                elementUpdated();
            }

            if (!SSR) {
                setEvents({ props, names, length, element });
            }
        }

        return element;
    }

    return render;
};

function isEvent(name: string): boolean {
    return /^on/.test(name);
}

function isSkip(name: string): boolean {
    return /^skip$/.test(name);
}

function setAttributes({
    props,
    names,
    length,
}: {
    props: Props;
    names: Array<string>;
    length: number;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && !isEvent(name) && !isSkip(name)) {
            const classProp = name === 'className' ? 'class' : '';
            const forProp = name === 'htmlFor' ? 'for' : '';

            attrIDom(forProp || classProp || name, props[name]);
        }
    }
}

function setEvents({
    props,
    names,
    length,
    element,
}: {
    props: Props;
    names: Array<string>;
    length: number;
    element: HyperScriptNode;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && isEvent(name)) {
            const eventName = name.toLowerCase().substring(2);

            element._listeners = element._listeners || {};

            if (element._listeners[eventName]) {
                element.removeEventListener(eventName, eventProxy, false);
            }

            element.addEventListener(eventName, eventProxy, false);
            element._listeners[eventName] = props[name];
        }
    }
}

function eventProxy(event: Event) {
    const target = event.currentTarget as HyperScriptNode;

    return target._listeners[event.type](event);
}

function isPrimitive(x: any): boolean {
    return typeof x === 'string' || typeof x === 'number';
}

function forEachChildInArgs(args: IArguments, iteratee: Function) {
    if (args.length > 2) {
        for (let i = 2; i < args.length; i++) {
            iteratee(args[i]);
        }
    }
}

function renderChild(child: Function | string | void) {
    const str = typeof child === 'string' ? textIDom(child) : '';

    return typeof child === 'function' ? child() : str;
}
