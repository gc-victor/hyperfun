import { div, input, label, li, span } from '@hyperfun/dom';
import { COMPLETED, EDITING } from '../constants';
import { removeButton } from './remove-button';
import { todoEditInput } from './todo-edit-input';
import { edit, toggle } from '../updates';

export const todoItem = (todo) =>
    li(
        `#item-${todo.id}`,
        { className: [COMPLETED, EDITING].filter(key => todo[key]).join('.') },
        [
            div('.view', [
                input('.toggle', {
                    id: `item-label-${todo.id}`,
                    type: 'checkbox',
                    onChange: () => toggle({ id: todo.id }),
                    checked: todo.completed ? 'checked' : '',
                }),
                label('.item-label', {
                    htmlFor: `item-label-${todo.id}`,
                }, [
                    span(
                        {
                            onDblClick: () =>
                                edit({ value: true, id: todo.id }),
                        },
                        todo.value
                    ),
                ]),
                removeButton(todo.id),
            ]),
            todoEditInput(todo),
        ]
    );
