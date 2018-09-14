import { RunOptions } from '../types';

export function extend(options: RunOptions): RunOptions {
    const plugins = options.plugins || [];
    const concatOptions = (plugin: Array<Function>, option: Array<Function>) =>
        plugin.length ? option.concat(plugin) : option;

    options.subscriptions = options.subscriptions || [];
    options.willUpdate = options.willUpdate || [];

    for (let i = 0; i < plugins.length; i++) {
        const { render, state = {}, view, subscriptions = [], willUpdate = [] } = plugins[i](
            options
        );

        options.render = render || options.render;
        options.state = { ...options.state, ...state };
        options.subscriptions = concatOptions(subscriptions, options.subscriptions);
        options.willUpdate = concatOptions(willUpdate, options.willUpdate);
        options.view = view || options.view;
    }

    return options;
}
