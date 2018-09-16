#!/usr/bin/env ../../node_modules/.bin/ts-node
import { test, only } from 'tap';
import * as incrementalDomString from 'incremental-dom-string';
import * as proxyquire from 'proxyquire';

const element = {
    checked: false,
};

const {
    attributesIDom,
    notificationsIDom,
} = proxyquire('../src/incremental-dom', {
    'incremental-dom': {
        attr: incrementalDomString.attr,
        attributes: {
            value: (el: any, name: any, value: any) =>
                (el.value =
                    value === null || typeof value === 'undefined'
                        ? ''
                        : value),
            checked: (el: any, name: any, value: any) => (el.checked = !!value),
        },
        elementClose: incrementalDomString.elementClose,
        elementOpenEnd: incrementalDomString.elementOpenEnd,
        elementOpenStart: incrementalDomString.elementOpenStart,
        skip: () => {},
        text: incrementalDomString.text,
    },
    'incremental-dom-string': {
        attr: incrementalDomString.attr,
        elementClose: incrementalDomString.elementClose,
        elementOpenEnd: incrementalDomString.elementOpenEnd,
        elementOpenStart: incrementalDomString.elementOpenStart,
        text: incrementalDomString.text,
    },
});

test('attributesIDom.checked true', (t: any) => {
    attributesIDom.checked(element, '', true);

    t.deepEqual(element, { checked: true });
    t.end();
});

test('attributesIDom.checked false', (t: any) => {
    attributesIDom.checked(element, '', false);

    t.deepEqual(element, { checked: false });
    t.end();
});

test('attributesIDom.value', (t: any) => {
    attributesIDom.checked(element, '', false);
    attributesIDom.value(element, '', 'test');

    t.deepEqual(element, { checked: false, value: 'test' });
    t.end();
});

test('attributesIDom.value', (t: any) => {
    attributesIDom.checked(element, '', false);
    attributesIDom.value(element, '', undefined);

    t.deepEqual(element, { checked: false, value: '' });
    t.end();
});

test('attributesIDom.value', (t: any) => {
    attributesIDom.checked(element, '', false);
    attributesIDom.value(element, '', null);

    t.deepEqual(element, { checked: false, value: '' });
    t.end();
});

test('notifications.nodesDeleted', (t: any) => {
    let executed: boolean;

    notificationsIDom.nodesDeleted([
        { _elementDetached: () => (executed = true) },
    ]);

    setTimeout(() => {
        t.equal(executed, true);
        t.end();
    });
});

test('notifications.nodesCreated', (t: any) => {
    let executed: boolean;

    notificationsIDom.nodesCreated([
        { _elementAttached: () => (executed = true) },
    ]);

    setTimeout(() => {
        t.equal(executed, true);
        t.end();
    });
});
