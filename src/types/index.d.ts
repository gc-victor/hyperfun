import 'incremental-dom';
import 'incremental-dom-string';
export declare type Props = {
    [key: string]: any;
};
export declare type HyperScriptChildren = any;
export interface HyperScriptFn {
    (sel: string, props?: Object, children?: HyperScriptChildren): Function;
}
export declare type State = {
    [key: string]: any;
};
export interface HyperScriptNode extends Node {
    _elementAttached: Function;
    _elementDetached: Function;
}
