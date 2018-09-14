import { footer, ul } from '@hyperfun/dom';
import { ALL, ACTIVE, COMPLETED } from '../constants';
import { clearButton } from './clear-button';
import { filterItem } from './filter-item';
import { todoCount } from './todo-count';

const FILTERS = { ALL, ACTIVE, COMPLETED };

export const todoFooter = state =>
    footer('.footer', [
        todoCount(state.todos.filter(todo => !todo.completed).length),
        ul(
            '.filters',
            Object.keys(FILTERS).map(key =>
                filterItem(state, key, FILTERS[key])
            )
        ),
        state.todos.filter(todo => todo.completed).length > 0
            ? clearButton(state)
            : '',
    ]);
