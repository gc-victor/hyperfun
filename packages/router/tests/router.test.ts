#!/usr/bin/env ../../node_modules/.bin/ts-node
// Note: hack to not type the mocks
declare module './mock-dom';

import { test } from 'tap';
import * as proxyquire from 'proxyquire';
import { Params, UpdateConfig } from '../types';
import { addEventListener, createElement, setupLocation } from './mock-dom';

const root = {
    addEventListener,
    document: createElement('document'),
    history: {
        pushState: (stateObject: Object, title: string, url: string) =>
            `title: "${title}" | url: "${url}"`,
    },
    location: setupLocation('https://hyperfun.com'),
};
// Mocking root
const routerPlugin = proxyquire('../src/router', { './root': { root } });
const link = root.document.createElement('a');
const state = {};
const noop = () => ({});
const runOptions = {
    state,
    router: {
        '/': {
            title: () => 'Index - Title',
            view: () => 'Index View!',
        },
        '/fun': {
            title: () => 'Fun - Title',
            view: () => 'Fun View!',
        },
        '/:app/:name': {
            title: (params: Params) => `${params.app}${params.name.toUpperCase()} - Title`,
            view: () => '/:app/:name View!',
        },
        '/:slug': {
            title: (params: Params) => `${params.slug.toUpperCase()} - Title`,
            view: () => 'Slug View!',
        },
    },
};

test('Empty options router, should return the params with an undefined item', (t: any) => {
    const newOptions = JSON.parse(JSON.stringify(runOptions));
    const newState = routerPlugin.router(newOptions).state;

    delete newOptions.router;

    t.deepEqual(newState, {
        router: { params: undefined },
    });
    t.end();
});

test('State is updated with the slug as a params that matches with the router', (t: any) => {
    root.location.pathname = '/hyperfun';

    t.deepEqual(routerPlugin.router(runOptions).state, {
        router: { params: { slug: 'hyperfun' } },
    });
    t.end();
});

test("State shouldn't be updated with any params as the router is defined directly", (t: any) => {
    root.location.pathname = '/fun';

    t.deepEqual(routerPlugin.router(runOptions).state, {
        router: { params: {} },
    });
    t.end();
});

test('State is updated with the name as a params that matches with the router', (t: any) => {
    root.location.pathname = '/hyperfun/test';

    t.deepEqual(routerPlugin.router(runOptions).state, {
        router: { params: { app: 'hyperfun', name: 'test' } },
    });
    t.end();
});

test('Should redirect to the href defined', (t: any) => {
    root.location.pathname = '/';

    const router = routerPlugin.router(runOptions);

    // Is needed to force the subscriptions, as is a plugin
    router.subscriptions.forEach((subscription: Function) => subscription(state, noop));

    routerPlugin.redirect('/redirect');

    t.deepEqual(root.document.title, 'REDIRECT - Title');
    t.end();
});

test('Should go to the href defined', (t: any) => {
    root.location.pathname = '/';

    const router = routerPlugin.router(runOptions);

    // Is needed to force the subscriptions, as is a plugin
    router.subscriptions.forEach((subscription: Function) => subscription(state, noop));

    link.href = '/go-to';
    link.onClick = routerPlugin.to;
    link.click();

    t.deepEqual(root.document.title, 'GO-TO - Title');
    t.end();
});

test('Should change the view to match with the anchor clicked', (t: any) => {
    root.location.pathname = '/';

    const router = routerPlugin.router(runOptions);

    router.subscriptions.forEach((subscription: Function) => subscription(state, noop));

    router.view(); // First view execution

    link.href = '/hyper/fun';
    link.onClick = routerPlugin.to;
    link.click();

    t.equal(router.view(), '/:app/:name View!');
    t.end();
});

test('The update method should return the action', (t: any) => {
    let params: any = {};

    const update = (routerParams: UpdateConfig) => (params = routerParams);
    const router = routerPlugin.router(runOptions);

    root.location.pathname = '/';

    router.subscriptions.forEach((subscription: Function) => subscription(state, update));

    link.href = '/hyper/fun';
    link.onClick = routerPlugin.to;
    link.click();

    t.deepEqual(
        {
            payload: params.payload(),
            type: params.type,
        },
        {
            payload: {
                router: {
                    params: {
                        app: 'hyper',
                        name: 'fun'
                    },
                    path: '/hyper/fun'
                }
            },
            type: routerPlugin.ROUTER_UPDATED,
        }
    );
    t.end();
});

test('Action payload updated', (t: any) => {
    let params: any = {};

    const update = (routerParams: UpdateConfig) => (params = routerParams);
    const router = routerPlugin.router(runOptions);

    root.location.pathname = '/';

    router.subscriptions.forEach((subscription: Function) => subscription(state, update));

    link.href = '/hyper/fun';
    link.onClick = routerPlugin.to;
    link.click();

    t.deepEqual(params.payload(), {
        router: { params: { app: 'hyper', name: 'fun' }, path: '/hyper/fun' },
    });
    t.end();
});
