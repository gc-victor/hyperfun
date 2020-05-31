import { APP_ID } from '../app/app.constants';
import { View } from '../app/app.types';
import { patch } from '../dom';
import { root } from './router.root';
import { Params, RouterOptions } from './router.types';

interface Model {
    [key: string]: any;
}

interface Match {
    params: Params;
    title: (params: Params) => string;
    view: View;
}

interface SetMatcher {
    set: (options: RouterOptions, path: string) => Match;
}

let setClick: (link: HTMLAnchorElement) => void;

const matcher = storeMatcher();
const getParams = ({ params }: Match) => params;
const getTitle = (match: Match): string => match.title(getParams(match));

export const redirect = (href: string) => {
    const link = root.document.createElement('a');

    link.setAttribute('href', href);
    setClick(link);
};
export const to = (event: Event) => {
    const link = event.target as HTMLAnchorElement;

    event.preventDefault();

    setClick(link);
};

const initClick = (options: RouterOptions) => (link: HTMLAnchorElement) => {
    const handler = (event: Event) => {
        link.removeEventListener('click', handler);
        render({ options, event });
    };

    link.addEventListener('click', handler);
    link.click();
};

export function router(options: RouterOptions) {
    const path = root.location.pathname;
    const match = matcher.set(options, path);

    setClick = initClick(options);

    popState(options);
    setTitle({ match, path, isPopState: false });

    return {
        view: match.view || options.view,
    };
}

function popState(options: RouterOptions) {
    root.addEventListener('popstate', (event: Event) => render({ options, event }));
}

function render({ options, event }: { options: RouterOptions; event: Event }): void {
    const target = event.currentTarget as HTMLAnchorElement;
    const path = target.pathname || root.location.pathname;
    const match = matcher.set(options, path);

    event.preventDefault();

    setTitle({
        match,
        path,
        isPopState: event.type === 'popstate',
    });
    patch(
        document.getElementById(options.routerId || options.id || APP_ID) as Element,
        match.view()
    );
}

function setTitle({
    match,
    path,
    isPopState,
}: {
    match: Match;
    path: string;
    isPopState: boolean;
}): void {
    const title = getTitle(match) || root.document.title;

    if (!isPopState) {
        root.history.pushState({}, title, path);
    }

    root.document.title = title;
}

// @see https://github.com/jesseditson/fs-router/blob/v0.2.0/index.js#L7
function addMatch(url: string, path: string) {
    let matched;

    const paramPattern = /:([^/]+)/;
    const paramNames = [] as Array<any>;

    while ((matched = path.match(paramPattern))) {
        path = path.replace(paramPattern, '([^?/]+)');

        paramNames.push(matched[1] as never);
    }

    const pattern = new RegExp(`^${path}(\\?(.*)|$)`, 'i');
    const match = url.match(pattern);

    if (match) {
        return paramNames.reduce((map: Model, param: string, index: number) => {
            map[param] = match[index + 1];

            return map;
        }, {});
    }
}

function storeMatcher(): SetMatcher {
    const storeMatches = new Map();
    const noop = () => {};

    return {
        set(options: RouterOptions, url: string): Match {
            if (!storeMatches.has(url)) {
                let rout = '';
                let params;

                const optionsRouter = options.router;
                const routes = Object.keys(optionsRouter);
                const length = routes.length;

                for (let i = 0; i < length; i = i + 1) {
                    rout = routes[i];
                    params = addMatch(url, routes[i]);

                    if (params) {
                        break;
                    }
                }

                const item = optionsRouter[rout];

                storeMatches.set(url, {
                    params,
                    title: item.title || noop,
                    view: item.view || noop,
                });
            }

            return storeMatches.get(url);
        },
    };
}
