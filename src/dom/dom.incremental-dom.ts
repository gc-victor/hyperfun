import { HyperScriptNode } from './dom.types';
import { quicktask } from '../quicktask';

const schedule = quicktask();
const noop = (_?: unknown) => {};
const {
    attr,
    attributes = {},
    elementClose,
    elementOpenEnd,
    elementOpenStart,
    notifications = {
        nodesCreated: noop,
        nodesDeleted: noop,
    },
    patchOuter,
    renderToString = noop,
    skip = noop,
    skipNode = noop,
    text,
    // @ts-ignore
} = IncrementalDOM;

// @see https://github.com/davidjamesstone/superviews.js/issues/32#issuecomment-274372713
export const attributesIDom = attributes || {};
export const attrIDom = attr;
export const elementCloseIDom = elementClose;
export const elementOpenEndIDom = elementOpenEnd;
export const elementOpenStartIDom = elementOpenStart;
export const notificationsIDom = notifications;
export const renderToStringIDom = renderToString;
export const textIDom = text;
export const skipIDom = skip;
export const skipNodeIDom = skipNode;
export const patch = (node: Element, fn: (data: unknown) => void) => {
    return schedule(() => {
        return patchOuter(node, fn);
    });
};

attributesIDom.value = (el: HTMLFormElement, _name: string, value: any) => {
    return (el.value = value === null || typeof value === 'undefined' ? '' : value);
};

attributesIDom.checked = (el: HTMLFormElement, _name: string, value: any) => {
    return (el.checked = !!value);
};

notificationsIDom.nodesDeleted = (nodes: HyperScriptNode[]) =>
    nodes.forEach(
        (node) => node && node._elementDetached && schedule(node._elementDetached as () => void)
    );

notificationsIDom.nodesCreated = (nodes: HyperScriptNode[]) =>
    nodes.forEach(
        (node) => node && node._elementAttached && schedule(node._elementAttached as () => void)
    );
