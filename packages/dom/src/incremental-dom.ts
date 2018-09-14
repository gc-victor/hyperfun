import {
    attr,
    attributes,
    elementClose,
    elementOpenEnd,
    elementOpenStart,
    notifications,
    patchOuter,
    skip,
    text,
} from 'incremental-dom';
import * as incrementalDomString from 'incremental-dom-string';
import { HyperScriptNode } from '../types';

const NODE_ENV = process.env.NODE_ENV;
const SSR = process.env.SSR === 'true';

export const useIncrementalDomString = NODE_ENV === 'test' || SSR;

export const attrIDom = useIncrementalDomString ? incrementalDomString.attr : attr;
export const elementCloseIDom = useIncrementalDomString
    ? incrementalDomString.elementClose
    : elementClose;
export const elementOpenEndIDom = useIncrementalDomString
    ? incrementalDomString.elementOpenEnd
    : elementOpenEnd;
export const elementOpenStartIDom = useIncrementalDomString
    ? incrementalDomString.elementOpenStart
    : elementOpenStart;
export const textIDom = useIncrementalDomString ? incrementalDomString.text : text;
export const patchIDom = useIncrementalDomString ? incrementalDomString.renderToString : patchOuter;
export const skipIDom = skip;

// @see https://github.com/davidjamesstone/superviews.js/issues/32#issuecomment-274372713
export const attributesIDom = attributes;

attributes.value = (el: HTMLFormElement, name: string, value: any) =>
    (el.value = value === null || typeof value === 'undefined' ? '' : value);

attributes.checked = (el: HTMLFormElement, name: string, value: any) => (el.checked = !!value);

export const notificationsIDom = notifications;

notifications.nodesDeleted = (nodes: Array<HyperScriptNode>) =>
    nodes.forEach(node => node && node._elementDetached && setTimeout(node._elementDetached));

notifications.nodesCreated = (nodes: Array<HyperScriptNode>) =>
    nodes.forEach(node => node && node._elementAttached && setTimeout(node._elementAttached));
