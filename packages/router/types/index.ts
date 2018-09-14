export interface RouterState {
    router: {
        params: Object;
    };
}

export interface RouterOptions {
    [key: string]: any;
    view?: Function;
    element?: Function;
    router: string;
}

export type Subscriptions = Array<Function>;

export type View = (state: any) => any;

export type Plugin = Array<Function>;

export type WillUpdate = Array<Function>;

export interface RenderOptions {
    element?: () => HTMLElement | null;
    view?: View;
}

export interface UpdateConfig {
    type: string;
    payload: Function;
    options?: RenderOptions;
}

export type Update = (config: UpdateConfig) => any;

export interface RunOptionsRouter {
    [key: string]: any;
    plugins?: Plugin;
    render: Function;
    router: RouterOptions;
    state: State;
    subscriptions?: Subscriptions;
    view: View;
    willUpdate?: WillUpdate;
}

export interface State {
    [key: string]: any;
}

export interface Params {
    [key: string]: any;
}
