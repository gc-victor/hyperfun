import { patch } from '../dom';
import { Props, Render, UpdateResponse } from './component.types';
import { quicktask } from '../quicktask';

interface ComponentFactory {
    hooks: any;
    key: string;
    onCreate: (key: string, element: Element) => void;
    onDelete: (key: string, element: Element) => void;
    render: Render;
    newProps: Props;
}

const schedule = quicktask();

export function componentFactory({
    hooks,
    newProps,
    key,
    onCreate,
    onDelete,
    render,
}: ComponentFactory) {
    const noop = () => {};
    const keys = new Set();

    let element: Element;
    let created: (element: Element) => void = noop;
    let deleted: (element: Element) => void = noop;
    let props: Props = {};

    const update = (currentHook: string) => {
        return <S>(initialState: S): UpdateResponse<S> => {
            const setStateHookIndex = currentHook;
            const setState = (newState: S) => {
                schedule(() => {
                    hooks.set(setStateHookIndex, newState);
                    patch(element, renderElement(props));
                });
            };

            if (!hooks.has(currentHook)) {
                hooks.set(currentHook, initialState);
                keys.add(currentHook);
            }

            return [hooks.get(currentHook), setState];
        };
    };

    const execute = (currentHook: string) => {
        return (callback: () => void, depArray: any[]) => {
            const hasNoDeps = !depArray;
            const deps = hooks.get(currentHook);
            const hasChangedDeps = deps
                ? !depArray.every((item, i) => {
                      return JSON.stringify(item) === JSON.stringify(deps[i]);
                  })
                : true;

            if (hasNoDeps || hasChangedDeps) {
                schedule(() => {
                    hooks.set(currentHook, depArray);
                    keys.add(currentHook);
                    callback();
                });
            }
        };
    };

    const renderElement = (nextProps?: Props): (() => Element | null) => {
        let currentHook = 0;

        props = nextProps || {};

        const reRender = render({
            created: (callback: (element: Element) => void) => {
                return (created = callback || created);
            },
            deleted: (callback: (element: Element) => void) => {
                return (deleted = callback || deleted);
            },
            execute: (callback: () => void, deps: any[]) => {
                return execute(`execute-${key}-${currentHook++}`)(callback, deps);
            },
            key,
            props,
            update: (initialState) => {
                return update(`update-${key}-${currentHook++}`)(initialState);
            },
        });

        if (reRender === null) {
            return () => {
                return null;
            };
        }

        return function elementCallback() {
            element = reRender({
                key,
                elementAttached: () => {
                    const e = element as any;

                    e.__hooks = keys;
                    e.__deleted = deleted;

                    if (props.view) {
                        e.dataset.view = props.view;
                    }

                    created(element);
                    onCreate(key, element);
                },
                elementDetached: () => {
                    onDelete(key, element);
                },
            });

            return element;
        };
    };

    return renderElement(newProps);
}
