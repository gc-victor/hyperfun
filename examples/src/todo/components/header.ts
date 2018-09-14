import { add, updateInput } from '../updates';
import { h1, header, form, label, input } from '@hyperfun/dom';

export const todoHeader = state =>
    header('.header', [
        h1('Todo!'),
        form({ onSubmit: event => event.preventDefault() }, [
            label('.sr-only', { for: 'new-todo' }, 'New Todo'),
            input('#new-todo.new-todo', {
                autocomplete: 'off',
                autofocus: true,
                onInput: event => updateInput(event.target.value),
                onKeyup: event => add(event),
                placeholder: state.placeholder,
                type: 'text',
                value: state.input,
            }),
        ]),
    ]);
