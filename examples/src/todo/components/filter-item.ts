import { a, li } from '@hyperfun/dom';
import { to } from '@hyperfun/router';
import { ALL } from '../constants';

const className = (state, key, currentFilter) =>
    state.router.params.slug === currentFilter ||
    (state.router.params.slug === undefined && currentFilter === ALL)
        ? 'selected'
        : '';

export const filterItem = (state, key, currentFilter) =>
    li([
        a(
            {
                className: className(state, key, currentFilter),
                href: currentFilter === ALL ? '/' : `/${currentFilter}`,
                onClick: to
            },
            key
        ),
    ]);
