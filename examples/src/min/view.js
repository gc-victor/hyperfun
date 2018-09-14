import { connect } from '@hyperfun/run';
import { Component, container, element } from '@hyperfun/component';
import { button, div, form, h1, input, label, li, p, ul } from '@hyperfun/dom';
import { reset, submit, typing } from './updates';

/* Views */

const date = () => new Date().toLocaleTimeString();
const buttons = () => [
    li('.list', [
        button(
            {
                className: 'fl w-50 link dim pa2 f7 mb2 white bn bg-black',
                type: 'submit',
            },
            ['Submit']
        ),
    ]),
    li('.list', [
        button(
            {
                className: 'fl w-50 link dim pa2 f7 mb2 white bn bg-black-50',
                type: 'reset',
            },
            ['Reset']
        ),
    ]),
];

const buttonsComponent = () => ul('.pa0 .ma0', buttons());
const inputSearch = () =>
    label([
        input({
            className: 'fl w-100 f6 pa2 mv0 f7 bn',
            type: 'search',
            name: 'name',
            onInput: typing,
            placeholder: '…',
        }),
    ]);
const paragraphClass = '.mv0 .pv2 .f7 .bb .b--black .bw1 .sans-serif';
const submittedMessage = element(({ submitText } = {}) =>
    p(paragraphClass, [` ${date()} → ${submitText || ''}`])
);
const submittedMessageContainer = (props = { submitText: '' }) =>
    connect(state => ({ submitText: props.submitText || state.submitText }))(submittedMessage);
const createMessage = element(({ text } = {}) => p(paragraphClass, [` ${date()} → ${text || ''}`]));
const createMessageContainer = (props = { text: '' }) =>
    connect(state => ({ text: props.text || state.text }))(createMessage);
const title = element(({ title }) => h1('.f7 .pl4 .mt5 .mb0 .sans-serif .black', title));
const bindMessage = state =>
    div([
        title(state),
        form(
            {
                className: 'pl4 pr4',
                onSubmit: submit,
                onReset: reset,
            },
            [
                submittedMessageContainer(),
                createMessageContainer(),
                inputSearch(),
                buttonsComponent(),
            ]
        ),
    ]);

class Page extends Component {
    constructor() {
        super();

        this.state = { title: 'minimal' };
    }

    render(nextProps) {
        return bindMessage({ ...this.state, ...this.props });
    }
}

const pageContainer = container(Page);

export const view = () => div('#app', [connect(state => state)(pageContainer)]);
