export interface State {
    [key: string]: any;
}

export interface Props {
    [key: string]: any;
}

export type Subscriptions = Array<Function>;

export type View = (state: State) => any;

export type Plugin = Array<Function>;

export type WillUpdate = Array<Function>;

export interface UpdateConfig {
    type: string;
    payload: Function;
    options?: RenderOptions;
}

export type Update = (config: UpdateConfig) => any;

export interface RunOptions {
    [key: string]: any;
    state: State;
    view: View;
    render: Function;
    subscriptions?: Subscriptions;
    plugins?: Plugin;
    willUpdate?: WillUpdate;
}

export type MapStateToProps = (state: State) => State;

export type Connect = (
    mapStateToProps: MapStateToProps
) => (component: Function, props?: Props) => any;

export interface Command {
    update: Update;
    connect: Connect;
}

export interface RenderOptions {
    element?: Function | null;
    view?: View;
}
