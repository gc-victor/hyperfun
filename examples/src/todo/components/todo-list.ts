import { form, section, ul } from '@hyperfun/dom';
import { ALL, ACTIVE, COMPLETED } from '../constants';
import { todoItem } from './todo-item';
import { toggleAllBox } from './toggle-all-box';

const filterTodo = state => todo =>
    state.router.params.slug === COMPLETED
        ? todo.completed
        : state.router.params.slug === ACTIVE
          ? !todo.completed
          : state.router.params.slug === undefined ||
            state.router.params.slug === ALL;

export const todoList = state =>
    section('.main', [
        form({ onSubmit: event => event.preventDefault() }, [
            toggleAllBox(state),
            ul(
                '.todo-list',
                state.todos
                    .filter(filterTodo(state))
                    .reverse()
                    .map(todo => todoItem(todo))
            ),
        ]),
    ]);
