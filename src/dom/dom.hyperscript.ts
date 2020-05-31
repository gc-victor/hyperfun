import {
    attrIDom,
    elementCloseIDom,
    elementOpenEndIDom,
    elementOpenStartIDom,
    skipIDom,
    textIDom,
} from './dom.incremental-dom';
import { HTMLElements, HTMLElementsAttributes, HyperScriptNode } from './dom.types';

const handlersCache = new WeakMap();
const eventTypes = new Map();

export function h<T extends HTMLElements>(
    tagName: T,
    attributes: HTMLElementsAttributes[T],
    children: any[]
) {
    const outerArgs = arguments;
    const names = Object.keys(attributes);
    const length = names.length;

    function render(
        options: {
            skip: boolean;
            key?: string;
            elementAttached?: Function;
            elementDetached?: Function;
        } = { skip: false }
    ) {
        let element;

        const elementAttached = attributes.elementAttached || options.elementAttached;
        const elementDetached = attributes.elementDetached || options.elementDetached;
        const key = attributes.key || options.key || null;
        const skip = attributes.skip || options.skip || null;

        elementOpenStartIDom(tagName, key);
        setAttributes({ attributes, names, length });
        elementOpenEndIDom();

        if (skip) {
            skipIDom();

            element = elementCloseIDom(tagName);
        } else {
            if (Array.isArray(children)) {
                children.forEach(renderChildren);
            } else {
                forEachChildInArgs(outerArgs, renderChildren);
            }

            element = elementCloseIDom(tagName) || {};

            element._elementAttached = elementAttached;
            element._elementDetached = elementDetached;

            if (typeof window !== 'undefined') {
                setEvents({ attributes, names, length, element });
            }

            if (typeof attributes.ref === 'function') {
                attributes.ref(element);
            }
        }

        return element;
    }

    return render;
}

function isEvent(name: string): boolean {
    return /^on/.test(name);
}

function isSkip(name: string): boolean {
    return /^skip$/.test(name);
}

function isRef(name: string): boolean {
    return /^ref$/.test(name);
}

function setAttributes({
    attributes,
    names,
    length,
}: {
    attributes: any;
    names: Array<string>;
    length: number;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && !isEvent(name) && !isSkip(name) && !isRef(name)) {
            const classProp = name === 'className' ? 'class' : '';
            const forProp = name === 'htmlFor' ? 'for' : '';
            // @see: https://github.com/shahata/dasherize/blob/master/index.js#L26
            const hyphenated = name.replace(
                /[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g,
                function (s: string, j: number) {
                    return (j > 0 ? '-' : '') + s.toLowerCase();
                }
            );

            attrIDom(forProp || classProp || hyphenated, attributes[name]);
        }
    }
}

function setEvents({
    attributes,
    names,
    length,
    element,
}: {
    attributes: any;
    names: Array<string>;
    length: number;
    element: HyperScriptNode;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && isEvent(name)) {
            const eventName = name.toLowerCase().substring(2);
            const handlers = handlersCache.get(element) || {};

            if (!eventTypes.has(eventName)) {
                document.body.addEventListener(eventName, eventProxy, false);
            }

            eventTypes.set(eventName, 1);
            handlersCache.set(element, { ...handlers, [eventName]: attributes[name] });
        }
    }
}

function eventProxy(event: Event) {
    const element = event.target as any;
    const handlers = handlersCache.get(element) || {};
    const type = event.type;

    if (handlers[type]) {
        return handlers[type](event);
    }
}

function forEachChildInArgs(args: IArguments, iteratee: Function) {
    if (args.length > 2) {
        for (let i = 2; i < args.length; i++) {
            iteratee(args[i]);
        }
    }
}

function renderChildren(children: Function | string | void) {
    const str = typeof children === 'string' ? textIDom(children) : '';

    return typeof children === 'function' ? children() : str;
}
