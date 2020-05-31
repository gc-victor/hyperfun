import { App } from '../app/app.types';

export interface Params {
    [key: string]: any;
}

export interface RouterOptions extends App {
    router: {
        [key: string]: {
            title: (params: Params) => string;
            view: () => void;
        };
    };
    routerId: string;
}
