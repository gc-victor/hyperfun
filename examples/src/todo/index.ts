import { div, patch } from '@hyperfun/dom';
import { router } from '@hyperfun/router';
import { run } from '@hyperfun/run';
import { RouterState } from '@hyperfun/router/types';
import { RenderOptions } from '@hyperfun/run/types';
import { mainContent } from './components/main';
import { localStorage } from './plugins/local-storage';
import { logs } from './plugins/logs';

/* Types */

export interface Main extends RouterState {
    todos: Array<TodoState>;
    input: string;
    all: boolean;
    placeholder: string;
    router: {
        params: {
            slug: string;
        };
    };
}

export interface TodoState extends RouterState {
    completed: boolean;
    editing: boolean;
    value: string;
    id: number;
}

/* State */

const todo: Main = {
    todos: [],
    all: false,
    input: '',
    placeholder: 'What needs to be done?',
    router: {
        params: {
            slug: '',
        },
    },
};

/* Render */

const appDomElement = document.getElementById('app');

const render = (element, options: RenderOptions = {}) =>
    patch(options.element ? options.element() : appDomElement, element);

/* Run */

const app = () => {
    patch(appDomElement, div('#app'));

    run({
        view: mainContent,
        render,
        state: todo,
        plugins: [router, localStorage, logs],
        router: {
            '/': {
                title: () => 'Index',
                view: mainContent,
            },
            '/:slug': {
                title: params => params.slug,
                view: mainContent,
            },
        },
    });
    document.removeEventListener('hotModuleReplace', app);
};

document.addEventListener('DOMContentLoaded', app);
document.addEventListener('hotModuleReplace', app);
