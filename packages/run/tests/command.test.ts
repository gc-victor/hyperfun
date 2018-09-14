#!/usr/bin/env NODE_ENV=ssr ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { command, connect, update } from '../src/command';
import { State, View } from '../types';

test('Command return the update function to render the view', (t: any) => {
    const options = {
        state: {},
        view: (): string => 'view',
        render: (view: View): View => view,
    };

    command(options);

    t.equal(update({ type: 'TEST', payload: () => ({}) }), 'view');
    t.end();
});

test('The updated state will be passed to the view', (t: any) => {
    let newState;

    const options = {
        state: {
            test: true,
        },
        view: (state: State): State => (newState = state),
        render: (view: View): View => view,
    };

    command(options);

    update({
        type: 'TEST',
        payload: () => ({ test: false }),
    });

    t.deepEqual(newState, {
        test: false,
    });
    t.end();
});

test('The state will be injected to the state thought the connect', (t: any) => {
    let newState;

    const component = (state: State) => (newState = state);

    const options = {
        state: {
            test: true,
        },
        view: (): void => {},
        render: (view: View): View => view,
    };

    command(options);

    connect(state => ({ newTest: state.test }))(component);

    t.deepEqual(newState, {
        newTest: true,
    });
    t.end();
});

test('Execute subscriptions after render', (t: any) => {
    let spy: any;

    const options = {
        state: { spy: true },
        view: (): void => {},
        render: (): void => {
            // Force spy to false on render to check that the subscriptions are executed after the render
            spy = false;
        },
        subscriptions: [(state: State): State => (spy = state)],
    };

    command(options);

    setTimeout(() => {
        t.deepEqual(spy, { spy: true });
        t.end();
    });
});

test('Execute willUpdate before render', (t: any) => {
    let spy: any;

    const options = {
        state: {},
        view: (): void => {},
        render: (): void => {
            // Force spy to false on render to check that the willUpdate are executed before the render
            spy = false;
        },
        willUpdate: [(): boolean => (spy = true)],
    };

    command(options);

    update({
        type: 'TEST',
        payload: () => ({ test: false }),
    });

    setTimeout(() => {
        t.equal(spy, false);
        t.end();
    });
});
