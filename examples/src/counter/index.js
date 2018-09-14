import { connect, run, update } from '@hyperfun/run';
import { article, button, div, h1, h2, li, p, patch, ul } from '@hyperfun/dom';
import { Component, element, container } from '@hyperfun/component';
import { localStorage } from './plugins/local-storage';
import { logs } from './plugins/logs';

/* State */

const initialState = {
    counter: 0,
    title: 'Load time',
};

/* Update */

const date = () => new Date().toLocaleTimeString();
const updateOptions = {
    element: () => document.querySelector('.js-counter'),
    view: () => counterComponent(),
};

const incrementCounter = () =>
    update({
        type: 'INCREMENT_COUNTER',
        payload: (state) => ({ counter: state.counter + 1 }),
        options: updateOptions,
    });

const decrementCounter = () =>
    update({
        type: 'DECREMENT_COUNTER',
        payload: (state) => ({ counter: state.counter - 1 }),
        options: updateOptions,
    });

const resetCounter = () =>
    update({
        type: 'RESET_COUNTER',
        payload: () => ({ counter: 0 }),
        options: updateOptions,
    });

const incrementPage = () =>
    update({
        type: 'INCREMENT_PAGE',
        payload: (state) => ({ counter: state.counter + 1 }),
    });

const decrementPage = () =>
    update({
        type: 'DECREMENT_PAGE',
        payload: (state) => ({ counter: state.counter - 1 }),
    });

const resetPage = () =>
    update({
        type: 'RESET_PAGE',
        payload: () => ({ counter: 0 }),
    });

/* Views */

const titleRender = element(({ title }) =>
    h1('.ph3.pv3.dark-blue.bg-light-yellow', [`${title} ${date()}`])
);

const titleComponent = (props = { title: '' }) =>
    connect((state) => ({ title: props.title || state.title }))(titleRender);

const counterRender = element(({ counter }) =>
    h2('.js-counter.ph3.pv2.bg-light-yellow.dark-blue', [`Counter = ${counter} (${date()})`])
);

const counterComponent = () =>
    connect((state) => ({ counter: state.counter }))(counterRender);

const buttonsClasses = 'w-100 f6 tl link dim ph3 pv2 mb2 white bn';

const page = ({ title }, { counter }) =>
    article('.pv5', [
        titleComponent({ title }),
        counterComponent(),
        p('.ph3.pv1.bg-light-yellow.dark-blue', `Page = ${counter} (${date()})`),
        ul('.ma0.pa0', [
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer f6 bg-dark-red`,
                        onClick: incrementCounter,
                    },
                    ['Increment Counter']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-red`,
                        onClick: decrementCounter,
                    },
                    ['Decrement Counter']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer h3 bg-red`,
                        onClick: resetCounter,
                    },
                    ['Reset Counter']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-blue`,
                        onClick: incrementPage,
                    },
                    ['Increment Page']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-blue`,
                        onClick: decrementPage,
                    },
                    ['Decrement Page']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer h3 bg-blue`,
                        onClick: resetPage,
                    },
                    ['Reset Page']
                ),
            ]),
        ]),
    ]);

class Page extends Component {
    constructor() {
        super();

        this.state = {
            title: 'Party',
        };
    }

    attached() {
        console.log('attached');

        this.setState(() => ({
            title: this.props.title,
        }));
    }

    updated() {
        console.log('updated');
    }

    detached() {
        console.log('detached');
    }

    render() {
        return page(this.state, this.props);
    }
}

const pageContainer = container(Page);

const view = () => div('#app', [connect(state => state)(pageContainer)]);

const appHTMLElement = document.getElementById('app');

/* Render */
const render = (node, options = {}) =>
    patch(options.element ? options.element() : appHTMLElement, node);

/*
setInterval(() => {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const milliseconds = time.getMilliseconds();

    update({
        type: 'TIMER',
        payload: () => ({
            timer:
                harold(hours) +
                ':' +
                harold(minutes) +
                ':' +
                harold(seconds) +
                ':' +
                milliseconds,
        }),
    });

    function harold(standIn) {
        if (standIn < 10) {
            standIn = '0' + standIn;
        }
        return standIn;
    }
}, 1);
*/

/* Run */

const app = () => {
    patch(appHTMLElement, div('#app'));

    run({
        view,
        render,
        state: initialState,
        plugins: [localStorage, logs],
    });
    document.removeEventListener('hotModuleReplace', app);
};

document.addEventListener('DOMContentLoaded', app);
document.addEventListener('hotModuleReplace', app);
