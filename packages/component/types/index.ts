export type State = {
    [key: string]: any;
};

export type Props = {
    readonly [key: string]: any;
};

export type NextProps = Props;

export type PrevProps = Props;

export interface Attached {
    (element: HTMLElement): void;
}

export interface Detached {
    (element: HTMLElement): void;
}

export interface Updated {
    (nextProps: NextProps, prevProps: PrevProps): void;
}

export interface Render {
    (nextProps: NextProps): Function;
}

export interface ShouldUpdate {
    (nextProps: NextProps, prevProps: PrevProps): boolean;
}

export type Updater = () => State;

export type SetState = (updater: Updater) => void;

export interface ComponentLifecycle {
    attached?: Attached;
    detached?: Detached;
    updated?: Updated;
}

export interface Component extends ComponentLifecycle {
    forceUpdate?: boolean;
    isComponent?: boolean;
    render: Render;
    shouldUpdate?: ShouldUpdate;
    setState?: SetState;
    state?: State;
}

export interface RestComponent extends ComponentLifecycle {
    render?: Render;
}

export interface RenderOptions {
    forceUpdate?: boolean;
}
