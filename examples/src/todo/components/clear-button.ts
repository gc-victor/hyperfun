import { button } from '@hyperfun/dom';
import { clear } from '../updates';

export const clearButton = state =>
    button(
        '.clear-completed',
        {
            onclick: () => clear(),
        },
        ['Clear completed']
    );
