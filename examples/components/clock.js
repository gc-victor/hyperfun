import { component } from '../../dist/hyperfun.cjs.development';
import { h1, span, time } from '../html';
import { debug } from '../utils';

let timerID = {};

export const clockComponentInit = component(
    ({
        created,
        deleted,
        execute,
        key,
        props: { as = h1, background = 'bg-black', color = 'white', padding = 'pa2' },
        update,
    }) => {
        const [textColor, setTextColor] = update('transparent');
        const [data, setData] = update('');
        const [date, setDate] = update(new Date());
        const dateTime = date.toLocaleTimeString();

        created(() => {
            timerID[key] = setInterval(() => setDate(new Date()), 1000);
            setTextColor(color);
            debug(' CREATED Clock', key, timerID[key]);
        });
        deleted(() => {
            debug(' DELETED Clock', key, timerID[key]);
            clearInterval(timerID[key]);
        });
        // execute(() => debug(' EXECUTED ONCE Clock', key), []);
        // execute(() => debug(' EXECUTED ALWAYS Clock', key, date));
        execute(async () => {
            const fetchedData = await new Promise((resolve) =>
                setTimeout(() => resolve('.'), 1000)
            );

            debug('EXECUTED ONCE Clock', { key, fetchedData });

            setData(fetchedData);
        }, []);

        return as({ className: `${background} ${textColor} ${padding} mb0`, ref: '' }, [
            time({ dateTime }, [dateTime]),
            span([data]),
        ]);
    }
);
