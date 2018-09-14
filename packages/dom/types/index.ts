import 'incremental-dom';
import 'incremental-dom-string';

export type Props = {
    [key: string]: any;
};

export type HyperScriptChildren = any;

export interface HyperScriptFn {
    (sel: string, props?: Object, children?: HyperScriptChildren): Function;
}

export type State = {
    [key: string]: any;
};

export interface HyperScriptNode extends Node {
    _listeners: {
        [key: string]: any;
    };
    _elementAttached: Function;
    _elementDetached: Function;
}
