import { footer as wrapper, p, span } from '../html';

export const footer = () => {
    return wrapper({ dataSkip: 'true' }, [
        p({ className: 'f7 mt0' }, ['Made with @hyperfun XD', span({ id: 'footerClock' })]),
    ]);
};
