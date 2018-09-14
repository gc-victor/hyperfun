import { footer, p, a } from '@hyperfun/dom';

export const about = () =>
    footer('.info', [
        p(['Created with ', a({ href: 'https://github.com/gc-victor/hyperfun' }, ['hyperfun'])]),
        p(['Based in ', a({ href: 'http://todomvc.com' }, ['TodoMVC'])]),
        p('.special', [a({ href: '' }, ['Source Code'])]),
    ]);
