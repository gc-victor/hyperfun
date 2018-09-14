import { input, label, span } from '@hyperfun/dom';
import { edit, updateValue } from '../updates';

const maybeEditById = (id) => is =>
    is ? edit({ value: false, id }) : '';

export const todoEditInput = (todo) => {
    const maybeEdit = maybeEditById(todo.id);
    const isValueBiggerThanZero = event => event.target.value.length > 0;

    return label([
        span('.sr-only', ['Edit']),
        input('.edit', {
            onBlur: event => maybeEdit(isValueBiggerThanZero(event)),
            onKeydown: event =>
                maybeEdit(isValueBiggerThanZero(event) && event.keyCode === 13),
            onInput: event =>
                isValueBiggerThanZero(event)
                    ? updateValue({
                          value: event.target.value,
                          id: todo.id,
                      })
                    : () => ({}),
            value: todo.value,
        }),
    ]);
};
