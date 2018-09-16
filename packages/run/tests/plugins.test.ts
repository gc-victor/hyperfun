#!/usr/bin/env ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { RunOptions, State } from '../types';
import { extend } from '../src/plugins';

const globalOptions = (): RunOptions => ({
    state: {},
    view: (state: State): string => 'view',
    render: (view: any): string => view,
    subscriptions: [(): void => {}, (): void => {}],
    willUpdate: [(): void => {}],
    plugins: [
        () => ({
            state: { plugin: '', plugin0: '' },
            render: () => 'notExtendRender',
            view: () => 'notExtendView',
            subscriptions: [(): void => {}],
            willUpdate: [(): void => {}],
        }),
        () => ({}),
        () => ({
            state: { plugin: 'last', plugin2: '' },
            render: () => 'extendRender',
            view: () => 'extendView',
            subscriptions: [(): void => {}, (): void => {}],
            willUpdate: [(): void => {}],
        }),
    ],
});

test('Last plugin render', (t: any) => {
    const options = globalOptions();

    extend(options);

    t.equal(options.render(), 'extendRender');
    t.end();
});

test('Last plugin view', (t: any) => {
    const options = globalOptions();

    extend(options);

    t.equal(options.view({ test: 'test' }), 'extendView');
    t.end();
});

test('Extend state', (t: any) => {
    const options = globalOptions();
    const newOptions = extend(options);

    t.deepEqual(newOptions.state, { plugin: 'last', plugin0: '', plugin2: '' });
    t.end();
});

test('Concat subscriptions', (t: any) => {
    const options = globalOptions();

    options.subscriptions = options.subscriptions || [];

    extend(options);

    t.equal(options.subscriptions.length, 5);
    t.end();
});

test('Subscriptions empty Array', (t: any) => {
    const options = globalOptions();

    delete options.subscriptions;
    options.plugins = [];

    const newOptions = extend(options);

    t.deepEqual(newOptions.subscriptions, []);
    t.end();
});

test('Concat willUpdate', (t: any) => {
    const options = globalOptions();

    options.willUpdate = options.willUpdate || [];

    extend(options);

    t.equal(options.willUpdate.length, 3);
    t.end();
});

test('Subscriptions empty Array', (t: any) => {
    const options = globalOptions();

    delete options.willUpdate;
    options.plugins = [];

    const newOptions = extend(options);

    t.deepEqual(newOptions.willUpdate, []);
    t.end();
});

test('Without plugins', (t: any) => {
    const options = globalOptions();

    delete options.plugins;

    extend(options);

    t.equal(options.plugins, undefined);
    t.end();
});
