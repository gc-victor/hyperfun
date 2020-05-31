import { h } from '../../dist';

export function Layer(children, props = {}, as = '') {
    return h(props.as || 'div', props, children);
}
export function Paragraph(text, props = {}) {
    return h(props.as || 'p', { className: 'ma0', ...props }, [text]);
}
export function Row(text, props = {}) {
    return h(props.as || 'p', { className: 'ma0', ...props }, [text]);
}
export function Button(children, props = {}) {
    return h(
        'button',
        {
            type: 'button',
            ...props,
            className: `bn ${props.className || ''}`,
        },
        [children]
    );
}
export function Buttons(tuple) {
    return HorizontalList(tuple, (button) => Button(button[0], button[1]));
}
export function HorizontalList(items, children = (it) => it) {
    return h(
        'ul',
        { className: 'flex flex-auto flex-row justify-end list ma0 pa0' },
        items.map((item) => h('li', {}, [children(item)]))
    );
}
export function VerticalList(items, props = {}) {
    return h(
        'ul',
        { className: 'list ma0 pa0' },
        items.map((item) => h('li', {}, [item]))
    );
}
