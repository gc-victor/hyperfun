import { app } from '../../dist/hyperfun.cjs.development';
import { span } from '../html';
import { footer as component } from '../components/footer';
import { wrapper } from './wrapper';
import { clockComponentInit } from '../components/clock';

const FOOTER_ID = 'footer';
const FOOTER_CLOCK_ID = 'footerClock';

export function footer() {
    app({
        id: FOOTER_ID,
        // TODO: add an extra property for actions before is rendered the view, like before (?)
        view: () => wrapper(FOOTER_ID, [component()]),
        // TODO: add an extra property for actions once is rendered the view, like after (?)
    });
}

export function footerClock() {
    const clockComponent = clockComponentInit();

    app({
        id: FOOTER_CLOCK_ID,
        view: () =>
            span({ id: FOOTER_CLOCK_ID }, [
                ' | ',
                clockComponent({ as: span, background: '', color: '', padding: '' }),
            ]),
    });
}
