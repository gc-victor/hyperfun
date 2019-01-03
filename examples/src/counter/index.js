import { connect, run, update } from '@hyperfun/run';
import { article, button, div, h1, h2, li, p, patch, ul } from '@hyperfun/dom';
import { Component, element, container } from '@hyperfun/component';
import { localStorage } from './plugins/local-storage';
import { logs } from './plugins/logs';

/* State */

const initialState = {
    counter: 0,
    title: 'One counter with three controllers',
};

/* Update */

const SELECTOR_0 = '.js-item-0';
const SELECTOR_1 = '.js-item-1';

const date = () => new Date().toLocaleTimeString();
const updateOptions = selector => ({
    element: () => document.querySelector(selector),
    view: () => (selector === SELECTOR_0 ? counterComponent0() : counterComponent1()),
});

const incrementItem = selector => () =>
    update({
        type: 'INCREMENT_ITEM',
        payload: state => ({ counter: state.counter + 1 }),
        options: updateOptions(selector),
    });

const decrementItem = selector => () =>
    update({
        type: 'DECREMENT_ITEM',
        payload: state => ({ counter: state.counter - 1 }),
        options: updateOptions(selector),
    });

const resetItem = selector => () =>
    update({
        type: 'RESET_ITEM',
        payload: () => ({ counter: 0 }),
        options: updateOptions(selector),
    });

const incrementBoth = () =>
    update({
        type: 'INCREMENT_ALL',
        payload: state => ({ counter: state.counter + 1 }),
    });

const decrementBoth = () =>
    update({
        type: 'DECREMENT_ALL',
        payload: state => ({ counter: state.counter - 1 }),
    });

const resetBoth = () =>
    update({
        type: 'RESET_ALL',
        payload: () => ({ counter: 0 }),
    });

/* Views */

const titleRender = element(({ title }) =>
    h1('.ph3.pv3.dark-blue.bg-light-yellow', [`${title} (${date()})`])
);

const titleComponent = (props = { title: '' }) =>
    connect(state => ({ title: props.title || state.title }))(titleRender);

const counterRender = selector =>
    element(({ counter }) =>
        h2(`${selector}.ph3.pv2.bg-light-yellow`, [`Counter = ${counter} (${date()})`])
    );

const counterRender0 = counterRender(SELECTOR_0);
const counterRender1 = counterRender(SELECTOR_1);

const counterComponent0 = () => connect(state => ({ counter: state.counter }))(counterRender0);

const counterComponent1 = () => connect(state => ({ counter: state.counter }))(counterRender1);

const buttonsClasses = 'w-100 f6 tl link dim ph3 pv2 mb2 white bn';

const page = ({ title }, { counter }) =>
    article('.pv5', [
        titleComponent({ title }),
        ul('.ma0.pa0', [
            li('.dark-red', [counterComponent0()]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer f6 bg-dark-red`,
                        onClick: incrementItem(SELECTOR_0),
                    },
                    ['Increment First Item']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-red`,
                        onClick: decrementItem(SELECTOR_0),
                    },
                    ['Decrement First Item']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer h3 bg-red`,
                        onClick: resetItem(SELECTOR_0),
                    },
                    ['Reset First Item']
                ),
            ]),
            li('.dark-blue', [counterComponent1()]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer f6 bg-dark-blue`,
                        onClick: incrementItem(SELECTOR_1),
                    },
                    ['Increment Second Item']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-blue`,
                        onClick: decrementItem(SELECTOR_1),
                    },
                    ['Decrement Second Item']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer h3 bg-blue`,
                        onClick: resetItem(SELECTOR_1),
                    },
                    ['Reset Second Item']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-green`,
                        onClick: incrementBoth,
                    },
                    ['Increment Both']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer bg-dark-green`,
                        onClick: decrementBoth,
                    },
                    ['Decrement Both']
                ),
            ]),
            li('.list', [
                button(
                    {
                        className: `${buttonsClasses} pointer h3 bg-green`,
                        onClick: resetBoth,
                    },
                    ['Reset Both']
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
}, 1000);
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
