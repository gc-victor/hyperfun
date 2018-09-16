#!/usr/bin/env ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { clone } from '../src/utils';

test('Deep clone object', (t: any) => {
    const state = { clone: '' };
    const newState = clone(state);

    state.clone = 'mutate';

    t.deepEqual(newState, { clone: '' });
    t.end();
});
