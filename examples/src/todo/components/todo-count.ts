import { p, span, strong } from '@hyperfun/dom';

export const todoCount = count =>
    p('.todo-count', [
        count > 0
            ? span([strong(count), ' items left'])
            : span('No items left'),
    ]);
