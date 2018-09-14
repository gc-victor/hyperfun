import { input, label, span } from '@hyperfun/dom';
import { toggleAll } from '../updates';

export const toggleAllBox = state =>
    label([
        span('.sr-only', ['Toggle All']),
        input('.toggle-all', {
            type: 'checkbox',
            onChange: () => toggleAll(state),
            checked: state.all ? 'checked' : '',
        }),
    ]);
