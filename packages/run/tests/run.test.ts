#!/usr/bin/env NODE_ENV=ssr ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { run } from '../src/run';
import { View } from '../types';

const options = {
    state: {},
    view: (): string => 'view',
    render: (view: View): View => view,
    subscriptions: [(): void => {}],
    plugins: [
        () => ({
            render: () => 'extendedRender',
        }),
    ],
};

test('Extend plugin render', (t: any) => {
    const view: View = () => 'View';

    run(options);

    t.equal(options.render(view), 'extendedRender');
    t.end();
});
