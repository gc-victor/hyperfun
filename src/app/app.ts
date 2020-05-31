import { patch } from '../dom';
import { RouterOptions, router } from '../router';
import { App } from './app.types';
import { APP_ID } from './app.constants';

export function app(options: App) {
    const plugin = options.router && router(options as RouterOptions);
    const view = (plugin && plugin.view) || options.view;
    const fragment = new DocumentFragment();
    const tempContainer = document.createElement('div');
    const appContainer = document.getElementById(options.id || APP_ID);

    if (appContainer?.hasAttribute('data-skip')) return;

    fragment.appendChild(tempContainer);
    patch((fragment.querySelector('div') as unknown) as Element, view());
    appContainer?.parentNode?.replaceChild(tempContainer, appContainer as Element);
}
