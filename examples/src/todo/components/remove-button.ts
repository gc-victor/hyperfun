import { button, span } from '@hyperfun/dom';
import { remove } from '../updates';

export const removeButton = (id) =>
    button(
        '.destroy',
        {
            type: 'button',
            onclick: () => remove({ id }),
        },
        [span('.sr-only', ['Remove'])]
    );
