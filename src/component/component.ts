import { componentFactory } from './component.factory';
import { Props, Render } from './component.types';

let keyCounter = 1;

const keyGenerator = () => {
    return `__${keyCounter++}__`;
};

const contains = new Map();
const deleted = new Map();
const elements = new Map();
const hooks = new Map();

const removeChildren = (key: string) => {
    (contains.get(key) || []).forEach((k: string) => {
        const containedElement = elements.get(k);

        if (containedElement) {
            containedElement.__deleted(containedElement);
            containedElement.__hooks.forEach((h: string) => hooks.delete(h));
        }

        contains.delete(k);
        deleted.delete(k);
        elements.delete(k);
    });
};

const onDelete = (key: string) => {
    const isView = elements.get(key).dataset.view === 'true';
    // Remove children and itself
    removeChildren(key);
    // Set delete to true to don't print it after removes itself
    !isView && deleted.set(key, 1);
};

const setChildren = (element: Element, key: string) => {
    // Set children and itself
    elements.forEach((_, k) => {
        const domElement = elements.get(k);

        if (domElement && domElement.contains(element)) {
            contains.set(k, [...(contains.get(k) || []), key]);
        }
    });
};

const onCreate = (key: string, element: Element) => {
    elements.set(key, element);
    setChildren(element, key);
};

export function component(render: Render) {
    function reRender(key: string, newProps?: Props) {
        newProps?.wake && deleted.delete(key);

        if (deleted.has(key)) return null;

        return deleted.has(key) ? null : factory(key, newProps);
    }

    function factory(key: string, newProps: Props | undefined) {
        return componentFactory({
            hooks,
            key,
            newProps: newProps || {},
            onCreate,
            onDelete,
            render,
        });
    }

    function init() {
        const key = keyGenerator();

        return reRender.bind(null, key);
    }

    return init;
}
