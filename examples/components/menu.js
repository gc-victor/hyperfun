import { to } from '../../dist/hyperfun.cjs.development';
import { a, li, ul } from '../html';

export const menu = () =>
    ul({ className: 'flex list ma0 pa0 f7' }, [
        li([a({ href: '/', className: 'black mr2', onClick: to }, ['Clock'])]),
        li([a({ href: '/whatever-slug', className: 'black', onClick: to }, ['Counter'])]),
    ]);
