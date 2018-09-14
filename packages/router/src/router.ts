// Note: hack to allow use of Map
declare var Map: any;

import { root } from './root';
import { RouterOptions, RunOptionsRouter, State, Update } from '../types';

interface Matcher {
    set: Function;
}

interface SetMatcher {
    params: Object;
    title: Function;
    view: Function;
}

interface ObjectWithIndex extends Object {
    [key: string]: any;
}

let lastView: undefined | Function;
let getRedirect: Function;

const matcher = storeMatcher();
const getParams = ({ params }: SetMatcher): Object => params;
const getTitle = (routes: Object, match: SetMatcher): string => match.title(getParams(match));
const getView = ({ view }: SetMatcher): Function => (lastView = view);

export function router(options: RunOptionsRouter) {
    const optionsRouter = options.router;
    const path = root.location.pathname;
    const match = matcher.set(optionsRouter, path);
    const link = root.document.createElement('a');

    lastView = undefined;

    setTitle({ optionsRouter, match, path, isPopState: false });

    return {
        view: (state: State, update: Update) =>
            (lastView && lastView(state, update)) || getView(match)(state, update),
        state: {
            router: {
                params: getParams(match),
            },
        },
        subscriptions: [
            (state: State, update: Update): Function =>
                (getRedirect = (href: string) => clickLinkToRedirect(link, href, update, options)),
            (state: State, update: Update): Function => popState(options)(state, update),
        ],
    };
}
export const ROUTER_UPDATED = '__ROUTER_UPDATED__';
export let redirect = (href: string) => getRedirect(href);
export let to = (event: Event) => {
    const target = event.target as HTMLAnchorElement;

    event.preventDefault();

    return getRedirect(target.href);
};

function clickLinkToRedirect(
    element: HTMLAnchorElement,
    href: string,
    update: Update,
    options: RunOptionsRouter
) {
    const handler = (event: Event) => {
        element.removeEventListener('click', handler);
        eventHandlerRender(update, options)(event);
    };

    element.href = href;
    element.addEventListener('click', handler);
    element.click();
}

function popState(options: RunOptionsRouter): Function {
    return function popStateAddEventListener(state: State, update: Update): void {
        root.addEventListener('popstate', eventHandlerRender(update, options));
    };
}

function eventHandlerRender(update: Update, options: RunOptionsRouter): Function {
    return (event: Event) => render({ update, options, event });
}

function render({
    update,
    options,
    event,
}: {
    update: Update;
    options: RunOptionsRouter;
    event: Event;
}): void {
    const target = event.currentTarget as HTMLAnchorElement;
    const path = target.pathname || root.location.pathname;
    const optionsRouter = options.router;
    const match = matcher.set(optionsRouter, path);
    const params: Object = getParams(match);

    setTitle({
        optionsRouter,
        match,
        path,
        isPopState: event.type === 'popstate',
    });
    getView(match);
    event.preventDefault();
    update({
        type: ROUTER_UPDATED,
        payload: () => ({ router: { params, path } }),
    });
}

function setTitle({
    optionsRouter,
    match,
    path,
    isPopState,
}: {
    optionsRouter: RouterOptions;
    match: SetMatcher;
    path: string;
    isPopState: boolean;
}): void {
    const title = getTitle(optionsRouter, match) || root.document.title;

    if (!isPopState) {
        root.history.pushState({}, title, path);
    }

    root.document.title = title;
}

// @see https://github.com/jesseditson/fs-router/blob/v0.2.0/index.js#L7
function addMatch(url: string, path: string) {
    let matched;

    const paramPattern = /:([^\/]+)/;
    const paramNames = [] as Array<any>;

    while ((matched = path.match(paramPattern))) {
        path = path.replace(paramPattern, '([^?/]+)');

        paramNames.push(matched[1] as never);
    }

    const pattern = new RegExp(`^${path}(\\?(.*)|$)`, 'i');
    const match = url.match(pattern);

    if (match) {
        return paramNames.reduce((map: ObjectWithIndex, param: string, index: number) => {
            const paramKey = param;

            map[paramKey] = match[index + 1];

            return map;
        }, {});
    }
}

function storeMatcher(): Matcher {
    const storeMatches = new Map();
    const noop = () => {};

    return {
        set(routerOptions: RouterOptions, url: string): SetMatcher {
            if (!storeMatches.has(url)) {
                let rout = '';
                let params;

                const routes = Object.keys(routerOptions);
                const length = routes.length;

                for (let i = 0; i < length; i = i + 1) {
                    rout = routes[i];
                    params = addMatch(url, routes[i]);

                    if (params) {
                        break;
                    }
                }

                const item = routerOptions[rout];
                const title = item.title || noop;
                const view = item.view || noop;

                storeMatches.set(url, {
                    params,
                    title,
                    view,
                });
            }

            return storeMatches.get(url);
        },
    };
}
