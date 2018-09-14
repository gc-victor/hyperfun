import { Command, MapStateToProps, RenderOptions, RunOptions, UpdateConfig, Props } from '../types';

export let update = ({ type, payload, options }: UpdateConfig): any => {};
export let connect = (mapStateToProps: MapStateToProps) => (component: Function, props?: Props) =>
    typeof component === 'function' && component(mapStateToProps({}), props);

export function command({
    state,
    view,
    render,
    subscriptions = [],
    willUpdate = [],
}: RunOptions): Command {
    let newState = { ...state };

    const renderView = (options: RenderOptions = {}) => {
        const newView = options.view || view;

        return render(newView(newState), options);
    };

    const updateState = ({ type, payload, options }: UpdateConfig): any => {
        const mutation = payload(newState);

        newState = { ...newState, ...mutation };

        willUpdate.forEach(item =>
            item({
                type,
                newState,
                options,
                mutation,
            })
        );

        return renderView(options);
    };

    setTimeout(() => renderView());
    setTimeout(() => subscriptions.forEach(subscription => subscription(newState, updateState)));

    update = updateState;
    connect = (mapStateToProps: MapStateToProps) => (component: Function, props?: Props) =>
        component(mapStateToProps(newState), props);

    return { update, connect };
}
