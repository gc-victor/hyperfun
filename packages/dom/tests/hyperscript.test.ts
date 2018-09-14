#!/usr/bin/env NODE_ENV=test ../../node_modules/.bin/ts-node
import { test } from 'tap';
import { patchIDom } from '../src/incremental-dom';
import * as incrementalDomString from 'incremental-dom-string';
import * as proxyquire from 'proxyquire';

let element = {
    addEventListener: (eventName: any, eventProxy: any) => {},
    removeEventListener: () => {},
};

const { hyperScript } = proxyquire('../src/hyperscript', {
    './incremental-dom': {
        attrIDom: incrementalDomString.attr,
        elementCloseIDom: (tag: any) => {
            incrementalDomString.elementClose(tag);

            return element;
        },
        elementOpenEndIDom: incrementalDomString.elementOpenEnd,
        elementOpenStartIDom: incrementalDomString.elementOpenStart,
        textIDom: incrementalDomString.text,
        skipIDom: () => {},
    },
});

test('An element with only a tagName', (t: any) => {
    t.equal(patchIDom(hyperScript('p')), '<p></p>');
    t.end();
});

test('An element with an array as a children', (t: any) => {
    t.equal(patchIDom(hyperScript('p', ['test'])), '<p>test</p>');
    t.end();
});

test('An element with a string as a children', (t: any) => {
    t.equal(patchIDom(hyperScript('p', 'test')), '<p>test</p>');
    t.end();
});

test('An element with a number as a children', (t: any) => {
    t.equal(patchIDom(hyperScript('p', 1)), '<p>1</p>');
    t.end();
});

test('A label with attribute htmlFor and a number as a children', (t: any) => {
    t.equal(
        patchIDom(hyperScript('label', { htmlFor: 'test' }, 1)),
        '<label for="test">1</label>'
    );
    t.end();
});

test('An element with a true as a second param', (t: any) => {
    t.throws(
        () => patchIDom(hyperScript('p', { className: 'test' }, true)),
        new Error('Second parameter has to be an array, string or number')
    );
    t.end();
});

test('An element with a false as a second param', (t: any) => {
    t.throws(
        () => patchIDom(hyperScript('p', { className: 'test' }, false)),
        new Error('Second parameter has to be an array, string or number')
    );
    t.end();
});

test('An element with an object as a second param', (t: any) => {
    t.throws(
        () => patchIDom(hyperScript('p', { className: 'test' }, {})),
        new Error('Second parameter has to be an array, string or number')
    );
    t.end();
});

test('An element with attribute skip as true will not add the skip attribute but will add the others', (t: any) => {
    const paragraph = hyperScript(
        'p',
        { skip: true, className: 'noop' },
        'Test'
    );

    t.equal(patchIDom(paragraph), '<p class="noop"></p>');
    t.end();
});

test('A render with attribute skip as true will not add child elements', (t: any) => {
    const paragraph = hyperScript('p', 'Test');

    t.equal(patchIDom(() => paragraph({ skip: true })), '<p></p>');
    t.end();
});

test('An element with attribute skip as false will not add attributes, but child elements', (t: any) => {
    const paragraph = hyperScript(
        'p',
        { skip: false, className: 'yep' },
        'Test'
    );

    t.equal(patchIDom(paragraph), '<p class="yep">Test</p>');
    t.end();
});

test('An element with attribute firstUpdate as true and elementUpdated, will execute elementUpdated', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript(
        'p',
        {
            firstUpdate: true,
            elementUpdated: () => (hasBeenExecuted = 'hasBeenExecuted'),
        },
        'Test'
    );

    patchIDom(paragraph);

    t.equal(hasBeenExecuted, undefined);
    t.end();
});

test('An element with attribute firstUpdate as false and elementUpdated, will execute elementUpdated', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript(
        'p',
        {
            firstUpdate: false,
            elementUpdated: () => (hasBeenExecuted = 'hasBeenExecuted'),
        },
        'Test'
    );

    patchIDom(paragraph);

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('A render with options firstUpdate as false and elementUpdated, will execute elementUpdated', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript('p', 'Test');

    patchIDom(() =>
        paragraph({
            firstUpdate: false,
            elementUpdated: () => (hasBeenExecuted = 'hasBeenExecuted'),
        })
    );

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('An element without option or attribute elementAttached', (t: any) => {
    const paragraph = hyperScript('p', 'Test');
    const htmlElement = paragraph();

    patchIDom(() => htmlElement);

    t.equal(htmlElement._elementAttached, undefined);
    t.end();
});

test('An element with attribute elementAttached', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript(
        'p',
        {
            elementAttached: () => (hasBeenExecuted = 'hasBeenExecuted'),
        },
        'Test'
    );
    const htmlElement = paragraph();

    patchIDom(() => htmlElement);

    htmlElement._elementAttached();

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('An element with option elementAttached', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript('p', 'Test');
    const htmlElement = paragraph({
        elementAttached: () => (hasBeenExecuted = 'hasBeenExecuted'),
    });

    patchIDom(() => htmlElement);

    htmlElement._elementAttached();

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('An element without option or attribute elementDetached', (t: any) => {
    const paragraph = hyperScript('p', 'Test');
    const htmlElement = paragraph();

    patchIDom(() => htmlElement);

    t.equal(htmlElement._elementDetached, undefined);
    t.end();
});

test('An element with attribute elementDetached', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript(
        'p',
        {
            elementDetached: () => (hasBeenExecuted = 'hasBeenExecuted'),
        },
        'Test'
    );
    const htmlElement = paragraph();

    patchIDom(() => htmlElement);

    htmlElement._elementDetached();

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('An element with option elementDetached', (t: any) => {
    let hasBeenExecuted;

    const paragraph = hyperScript('p', 'Test');
    const htmlElement = paragraph({
        elementDetached: () => (hasBeenExecuted = 'hasBeenExecuted'),
    });

    patchIDom(() => htmlElement);

    htmlElement._elementDetached();

    t.equal(hasBeenExecuted, 'hasBeenExecuted');
    t.end();
});

test('An element with an event as an attribute is rendered removing the attribute', (t: any) => {
    let eventProxyTest: Function;

    const event = {
        type: 'click',
        currentTarget: {
            _listeners: { click: (ev: any) => ev },
        },
    };

    element = {
        addEventListener: (eventName, eventProxy) => {
            const eventProxyBind = eventProxy.bind(
                { _listeners: { click: (ev: any) => ev } },
                event
            );

            eventProxyTest = eventProxyBind();
        },
        removeEventListener: () => {},
    };

    const button = hyperScript(
        'button',
        { onClick: () => 'On CLick event' },
        'Test'
    );

    t.equal(patchIDom(button), '<button>Test</button>');
    t.end();

    test('... and add events to the HTMLElement', (tInner: any) => {
        const htmlElement = button();

        tInner.equal(
            htmlElement._listeners.click.toString(),
            "function () { return 'On CLick event'; }"
        );
        tInner.end();
    });

    test('... and add events to the HTMLElement and executes the listener with event as a param', (tInner: any) => {
        tInner.deepEqual(eventProxyTest, event);
        tInner.end();
    });
});
