import { shallowEqual } from './shallow-equal';
import {
    Attached,
    Component,
    Detached,
    NextProps,
    PrevProps,
    Render,
    RenderOptions,
    State,
    Updated,
    Updater,
} from '../types';
import { patch } from '@hyperfun/dom';

export class ComponentFactory implements Component {
    private currentState: State = {};
    private firstUpdate = 0;
    private element: HTMLElement;
    private lastRender: Function;
    private nextProps: NextProps = {};
    private prevProps: PrevProps;
    private noop = () => {};

    public attached: Attached;
    public detached: Detached;
    public render: Render;
    public updated: Updated;

    constructor({ attached, detached, render, shouldUpdate, state = {}, updated }: Component) {
        this.attached = attached || this.noop;
        this.currentState = state;
        this.detached = detached || this.noop;
        this.render = render;
        this.shouldUpdate = shouldUpdate || this.shouldUpdate;
        this.updated = updated || this.noop;
    }

    get state() {
        return this.currentState;
    }

    get props() {
        return this.nextProps;
    }

    public setState(updater: Updater) {
        const state = this.state;

        this.currentState = {
            ...state,
            ...updater(),
        };

        const update = this.shouldUpdate(state, this.currentState);

        return (
            update &&
            this.element &&
            patch(this.element, this.renderElement(this.props, {
                forceUpdate: true,
            }) as Function)
        );
    }

    public renderElement(nextProps: NextProps, options: RenderOptions = {}): Function | void {
        const { forceUpdate = false } = options;
        const firstUpdate = !this.firstUpdate;
        const skip =
            forceUpdate || firstUpdate ? false : !this.shouldUpdate(nextProps, this.nextProps);

        this.firstUpdate = 1;
        // Set new props before render
        this.prevProps = { ...this.nextProps };
        this.nextProps = nextProps;
        this.lastRender = skip && this.lastRender ? this.lastRender : this.render(nextProps);

        return () => {
            this.element = this.lastRender({
                skip,
                firstUpdate,
                elementAttached: () => firstUpdate && this.attached && this.attached(this.element),
                elementDetached: () => this.detached(this.element),
                elementUpdated: () => !firstUpdate && this.updated(nextProps, this.prevProps),
            });

            return this.element;
        };
    }

    public shouldUpdate(nextProps: NextProps, prevProps: PrevProps) {
        return !shallowEqual(nextProps, prevProps);
    }
}
