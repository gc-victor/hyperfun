#!/usr/bin/env NODE_ENV=test ../../node_modules/.bin/ts-node
import { test } from 'tap';
import * as incrementalDomString from 'incremental-dom-string';
import * as proxyquire from 'proxyquire';
import { patchIDom } from '../src/incremental-dom';

const { a, div, li, p, ul } = proxyquire('../src/hyperscript-helpers', {
    './incremental-dom': {
        attrIDom: incrementalDomString.attr,
        elementCloseIDom: (tag: any) => {
            incrementalDomString.elementClose(tag);

            return {};
        },
        elementOpenEndIDom: incrementalDomString.elementOpenEnd,
        elementOpenStartIDom: incrementalDomString.elementOpenStart,
        textIDom: incrementalDomString.text,
        skipIDom: () => {},
        '@global': true,
    },
});

test('An element receives a single dot string as a fist parameter', (t: any) => {
    const output = patchIDom(div('.test'));

    t.equal(output, '<div class="test"></div>');
    t.end();
});

test('An element receives a dotted string with multiple classes as a fist parameter', (t: any) => {
    const output = patchIDom(div('.test .test1.test2 .test3'));

    t.equal(output, '<div class="test test1 test2 test3"></div>');
    t.end();
});

test('An element receives a hash string as a fist parameter', (t: any) => {
    const output = patchIDom(div('#test'));

    t.equal(output, '<div id="test"></div>');
    t.end();
});

test('An element receives a hash and dotted string as a fist parameter', (t: any) => {
    const output = patchIDom(div('#test.test .test1 .test2 .test3'));

    t.equal(output, '<div id="test" class="test test1 test2 test3"></div>');
    t.end();
});

test('An element receives a hash, not as a first word, and dotted string, as a fist parameter', (t: any) => {
    const output = patchIDom(div('.test #test .test1 .test2 .test3'));

    t.equal(output, '<div class="test test1 test2 test3"></div>');
    t.end();
});

test('An element receives a dotted string as first parameter and a string as a second parameter', (t: any) => {
    const output = patchIDom(p('.test', ['Test']));

    t.equal(output, '<p class="test">Test</p>');
    t.end();
});

test('An element receives a string as first parameter', (t: any) => {
    const output = patchIDom(p('Test'));

    t.equal(output, '<p>Test</p>');
    t.end();
});

test('An element receives a number as first parameter', (t: any) => {
    const output = patchIDom(p(1));

    t.equal(output, '<p></p>');
    t.end();
});

test('An element receives a string, with dots, as first parameter', (t: any) => {
    const output = patchIDom(p('Test. Test.'));

    t.equal(output, '<p>Test. Test.</p>');
    t.end();
});

test('An element receives a string, with dots and a hash as a first word, as first parameter', (t: any) => {
    const output = patchIDom(p('#ID Test. Test.'));

    t.equal(output, '<p id="ID"></p>');
    t.end();
});

test('An element receives a string, with dots and hash not as a first word, as first parameter', (t: any) => {
    const output = patchIDom(p('A #ID Test. Test.'));

    t.equal(output, '<p>A #ID Test. Test.</p>');
    t.end();
});

test('An element with a selector, receives the properties as a second parameter and on third position the child as an array', (t: any) => {
    const output = patchIDom(a('.test', { href: '/' }, ['Link']));

    t.equal(output, '<a class="test" href="/">Link</a>');
    t.end();
});

test('An element receives the properties as a first parameter with className and a string as a second parameter as child', (t: any) => {
    const output = patchIDom(a({ className: 'test', href: '/' }, 'Test'));

    t.equal(output, '<a class="test" href="/">Test</a>');
    t.end();
});

test('An element receives the properties as a first parameter with className and an array as a second parameter as child', (t: any) => {
    const output = patchIDom(a({ className: 'test', href: '/' }, ['Test']));

    t.equal(output, '<a class="test" href="/">Test</a>');
    t.end();
});

test('An element receives a list of elements as a first parameter', (t: any) => {
    const list = () => ['1', '2'];
    const output = patchIDom(ul(list().map(item => li(`test${item}`))));

    t.equal(output, '<ul><li>test1</li><li>test2</li></ul>');
    t.end();
});

test('An element receives a list of elements as a second parameter', (t: any) => {
    const list = () => ['1', '2'];
    const output = patchIDom(
        ul('.test', list().map(item => li([`test${item}`])))
    );

    t.equal(output, '<ul class="test"><li>test1</li><li>test2</li></ul>');
    t.end();
});

test('An element receives a list of elements as a third parameter', (t: any) => {
    const list = () => ['1', '2'];
    const output = patchIDom(
        ul('.test', { id: 'test' }, list().map(item => li([`test${item}`])))
    );

    t.equal(
        output,
        '<ul class="test" id="test"><li>test1</li><li>test2</li></ul>'
    );
    t.end();
});
