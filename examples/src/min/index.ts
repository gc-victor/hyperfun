import { run } from '@hyperfun/run';
import { div, patch } from '@hyperfun/dom';
import { localStorage } from './plugins/local-storage';
import { logs } from './plugins/logs';
import { view } from './view';

/* Types */

interface TestState {
    text: string;
    submitText: string;
}

/* State */

const testState: TestState = {
    text: '',
    submitText: '',
};

/* Render */

interface RenderOptions {
    view?: Function;
    element?: Function;
}

const appHTMLElement = document.getElementById('app');
const render = (element, options: RenderOptions = {}) =>
    patch(options.element ? options.element() : appHTMLElement, element);

/* App */

const app = () => {
    patch(appHTMLElement, div('#app'));

    run({
        view,
        render,
        state: testState,
        plugins: [localStorage, logs],
    });

    document.removeEventListener('hotModuleReplace', app);
};

document.addEventListener('DOMContentLoaded', app);
document.addEventListener('hotModuleReplace', app);
