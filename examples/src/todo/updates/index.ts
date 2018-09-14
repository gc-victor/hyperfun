import { update } from '@hyperfun/run';

export const updateInput = value =>
    update({
        type: 'TODO_INPUT',
        payload: () => ({ input: value }),
    });

export const add = event =>
    event.keyCode === 13 && event.target.value.length > 0
        ? update({
              type: 'TODO_ADD',
              payload: state => ({
                  input: '',
                  todos: state.todos.concat({
                      completed: false,
                      editing: false,
                      value: state.input,
                      id: new Date().valueOf(),
                  }),
              }),
          })
        : '';

export const toggle = ({ id }) =>
    update({
        type: 'TODO_TOGGLE',
        payload: state =>
            mapTodos(state, id, {
                completed: !state.todos.filter(item => item.id === id)[0]
                    .completed,
            }),
    });

export const edit = ({ id, value }) =>
    update({
        type: 'TODO_EDIT',
        payload: state => mapTodos(state, id, { editing: value }),
    });

export const updateValue = ({ id, value }) =>
    update({
        type: 'TODO_UPDATE',
        payload: state => mapTodos(state, id, { value }),
    });

export const remove = ({ id }) => {
    update({
        type: 'TODO_REMOVE',
        payload: state => ({
            todos: state.todos.filter(todo => todo.id !== id),
        }),
    });
};

export const clear = () =>
    update({
        type: 'TODO_CLEAR',
        payload: state => ({
            todos: state.todos.filter(todo => !todo.completed),
        }),
    });

export const toggleAll = () =>
    update({
        type: 'TODO_TOGGLE_ALL',
        payload: state => ({
            todos: state.todos.map(todo => ({
                ...todo,
                completed: !state.all,
            })),
            all: !state.all,
        }),
    });

function mapTodos(state, id, prop) {
    const completed =
        state.todos.filter(todo => !todo.completed).length +
        (prop.completed ? -1 : 1);

    return {
        todos: state.todos.map(
            todo => (id === todo.id ? { ...todo, ...prop } : todo)
        ),
        all: state.todos.length !== completed,
    };
}
