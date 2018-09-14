import { article, div, main } from '@hyperfun/dom';
import { todoHeader } from './header';
import { todoList } from './todo-list';
import { todoFooter } from './footer';
import { about } from './about';

export const mainContent = state =>
    div('#app', [
        main([
            article('.todoapp', [
                todoHeader(state),
                todoList(state),
                todoFooter(state),
            ]),
            about(),
        ]),
    ]);
