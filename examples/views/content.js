import { app } from '../../dist/hyperfun.cjs.development';
import { clockComponentInit } from '../components/clock';
import { counterComponent } from '../components/counter';
import { wrapper } from './wrapper';

export function content() {
    const APP_ID = 'app';
    const clockComponent = clockComponentInit();
    // IMPORTANT! Is important to define tha view component to reset the view
    const setView = (component) => component({ view: true });

    app({
        id: APP_ID,
        router: {
            '/': {
                title: () => ':: Clock ::',
                // IMPORTANT! every view has to be wrap with the same element
                // as the container, in this case <div id="app">
                view: () => wrapper(APP_ID, [setView(clockComponent)]),
                staticData: () => {},
            },
            '/:slug': {
                title: () => ':: Minimal ::',
                view: () => wrapper(APP_ID, [setView(counterComponent)]),
                staticData: () => {},
            },
        },
    });
}
