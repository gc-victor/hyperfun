import { app } from '../../dist/hyperfun.cjs.development';
import { wrapper } from './wrapper';
import { menu as component } from '../components/menu';

const MENU_ID = 'menu';

export function menu() {
    app({
        id: MENU_ID,
        view: () => wrapper(MENU_ID, [component()]),
    });
}
